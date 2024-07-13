"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var constants_1 = require("../constants");
exports.Users = {
    slug: "users", //usually the same as the collection name
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "<a href='".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?").concat(constants_1.QueryParamKeys.Token, "=").concat(token, "'>Verify your account</a>");
            },
        },
    },
    access: {
        read: function () { return true; },
        create: function () { return true; },
    },
    fields: [
        {
            name: "role",
            required: true,
            defaultValue: "user",
            type: "select",
            options: [
                {
                    value: "admin",
                    label: "Admin",
                },
                {
                    value: "user",
                    label: "User",
                },
            ],
        },
    ],
};
