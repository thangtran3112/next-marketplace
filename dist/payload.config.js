"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var config_1 = require("payload/config");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var path_1 = __importDefault(require("path"));
var Users_1 = require("./collections/Users");
var dotenv_1 = __importDefault(require("dotenv"));
var constants_1 = require("./constants");
var Products_1 = require("./collections/Products/Products");
var Media_1 = require("./collections/Media");
var ProductFile_1 = require("./collections/ProductFile");
var Orders_1 = require("./collections/Orders");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    collections: [Users_1.Users, Products_1.Products, Media_1.Media, ProductFile_1.ProductFiles, Orders_1.Orders],
    routes: {
        admin: "/sell",
    },
    admin: {
        user: constants_1.UsersCollection, //use existing users collection, if exists
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- Next Marketplace",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg", //when you share a link to this application
        },
    },
    rateLimit: {
        max: 2000,
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    typescript: {
        //export the types to this files, when we have collections
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
});
