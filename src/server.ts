import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";

/**
 * Using Express as NextJs middleware (custom server)
 * https://medium.com/@obulareddyveera/next-js-invite-express-js-as-middleware-ea5e7bb494f0
 */

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const start = async () => {
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL: ${cms.getAdminURL()}`);
      },
    },
  });

  //forward all express requests and responses to nextjs handler
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
