import { TRPC_ENDPOINT } from "@/constants";
import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  fetchRequestHandler({
    /* /api/trpc */
    endpoint: TRPC_ENDPOINT,
    req,
    router: appRouter, // our backend router
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };
