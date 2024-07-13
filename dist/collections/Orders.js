"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var constants_1 = require("../constants");
var yourOwnOrders = function (_a) {
    var user = _a.req.user;
    if (user.role === "admin")
        return true;
    return {
        user: {
            equals: user === null || user === void 0 ? void 0 : user.id,
        },
    };
};
exports.Orders = {
    slug: constants_1.OrdersCollection,
    admin: {
        useAsTitle: "Your Orders",
        description: "A summary of all your orders on Next Marketplace.",
    },
    access: {
        read: yourOwnOrders,
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        create: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    fields: [
        {
            name: "_isPaid",
            type: "checkbox",
            access: {
                read: function (_a) {
                    var req = _a.req;
                    return req.user.role === "admin";
                }, // no user shpould change orders to Paid
                create: function () { return false; }, // can only create through code
                update: function () { return false; }, // can only update through code
            },
            admin: {
                hidden: true,
            },
            required: true,
        },
        {
            name: "user",
            type: "relationship",
            admin: {
                hidden: true, // should not see who created the order
            },
            relationTo: constants_1.UsersCollection,
            required: true,
        },
        {
            name: "products",
            type: "relationship",
            relationTo: constants_1.ProductsCollection,
            required: true,
            hasMany: true,
        },
    ],
};
