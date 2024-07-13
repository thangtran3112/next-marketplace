"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentialsValidator = void 0;
var zod_1 = require("zod");
//These Zod types will be reused for both server-side and client-side form validation
exports.AuthCredentialsValidator = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, {
        message: "Password must be at least 8 characters long.",
    }),
});
