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
      {
        protocol: "https",
        hostname: `${process.env.S3_PRODUCT_FILES_BUCKET}.s3.us-west-2.amazonaws.com`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: `${process.env.S3_MEDIA_BUCKET}.s3.us-west-2.amazonaws.com`,
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
