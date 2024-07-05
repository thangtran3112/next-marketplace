import { ExpressContext } from "@/server";
import { initTRPC } from "@trpc/server";

//tell typescript which type of context we are using
const t = initTRPC.context<ExpressContext>().create();
export const router = t.router;
export const publicProcedure = t.procedure;
