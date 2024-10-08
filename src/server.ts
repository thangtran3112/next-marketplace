import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { TRPC_ENDPOINT } from "./constants";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";
import { PayloadRequest } from "payload/types";
import { parse } from "url";

/**
 * Using Express as NextJs middleware (custom server)
 * https://medium.com/@obulareddyveera/next-js-invite-express-js-as-middleware-ea5e7bb494f0
 */

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;
export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  //this is for ECS Fargate healthcheck
  app.get("/healthcheck", (req, res) => {
    res.send({ health: "ok" });
  });
  //parsing webhook requests, and we will eventually validate the signature, to make sure the request came from Stripe
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _res, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  const cartRouter = express.Router();
  // attach user object to request, and protect the route
  cartRouter.use(payload.authenticate);

  //root of cart route
  cartRouter.get("/", (req, res) => {
    const request = req as PayloadRequest;

    if (!request.user) return res.redirect("/sign-in?origin=cart");

    const parsedUrl = parse(req.url, true);
    const { query } = parsedUrl;

    //user is authenticated, so we tell nextjs to render the cart page
    return nextApp.render(req, res, "/cart", query);
  });

  app.use("/cart", cartRouter);

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  /**
   * when we receive a request to /api/trpc, we want to forward it to our trpc in NextJS
   * Use createContext to attach Express's request and response as context to forward to NextJS
   * Send appRouter (auth_router with sign-in, sign-up and verify-email) to NextJS
   */
  app.use(
    TRPC_ENDPOINT,
    trpcExpress.createExpressMiddleware({
      router: appRouter, //send to NextJS
      createContext, //send to NextJS
    })
  );

  /*
   * Forward all express requests and responses to nextjs handler.
   * Any requests not handled by Express will be forwarded to be handled by NextJS
   */
  app.use((req, res) => nextHandler(req, res));

  //prepare() — resolves after NextJS successful instantiation.
  //At success callback will initialize ExpressJS and bind with 3000 port
  nextApp.prepare().then(() => {
    payload.logger.info(`Next.js started`);
    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
