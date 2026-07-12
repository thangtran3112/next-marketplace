/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 31536000,
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
        hostname: "market.tobytran.dev",
      },
      {
        // GCP Cloud Run default domain
        protocol: "https",
        hostname: "*.run.app",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
