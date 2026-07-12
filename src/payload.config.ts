import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { buildConfig } from "payload/config";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { Users } from "./collections/Users";
import dotenv from "dotenv";
import { UsersCollection } from "./constants";
import { Products } from "./collections/Products/Products";
import { Media } from "./collections/Media";
import { ProductFiles } from "./collections/ProductFile";
import { Orders } from "./collections/Orders";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { gcsAdapter } from "@payloadcms/plugin-cloud-storage/gcs";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// GCS adapter configuration for Google Cloud Storage
const gcsMediaAdapter = gcsAdapter({
  bucket: process.env.GCS_MEDIA_BUCKET!,
  options: {
    projectId: process.env.GCP_PROJECT_ID!,
  },
});

const gcsProductFilesAdapter = gcsAdapter({
  bucket: process.env.GCS_PRODUCT_FILES_BUCKET!,
  options: {
    projectId: process.env.GCP_PROJECT_ID!,
  },
});

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFiles, Orders],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: UsersCollection, //use existing users collection, if exists
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- Next Marketplace",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg", //when you share a link to this application
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    //export the types to this files, when we have collections
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  plugins: [
    // Pass the plugin to Payload
    cloudStorage({
      collections: {
        // Enable cloud storage for Media collection
        media: {
          adapter: gcsMediaAdapter,
          disablePayloadAccessControl: true,
        },
        product_files: {
          adapter: gcsProductFilesAdapter,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
});
