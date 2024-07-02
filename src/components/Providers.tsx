"use client";
import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@/trpc/client";
import { httpBatchLink } from "@trpc/client";
import { TRPC_ENDPOINT } from "@/constants";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          // http://localhost:3000/api/trpc
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}${TRPC_ENDPOINT}`,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include", // include cookies for both Next and Express servers
            });
          },
        }),
      ],
    })
  );

  // allow react-query to have option to use TRPC or running independently through QueryClientProvider
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Providers;
