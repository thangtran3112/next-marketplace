/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "nextmarket.up.railway.app",
      },
      {
        protocol: "https",
        hostname: "market.thangtrandev.net",
      },
    ],
  },
};

export default nextConfig;
