"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductFiles = void 0;
var constants_1 = require("../constants");
var addUser = function (_a) {
    var req = _a.req, data = _a.data;
    var user = req.user;
    return __assign(__assign({}, data), { user: user === null || user === void 0 ? void 0 : user.id }); //attach user propertyto product_file
};
var yourOwnAndPurchased = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user, products, ownProductFileIds, orders, purchasedProductFileIds;
    var req = _b.req;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                user = req.user;
                if ((user === null || user === void 0 ? void 0 : user.role) === "admin")
                    return [2 /*return*/, true];
                if (!user)
                    return [2 /*return*/, false];
                return [4 /*yield*/, req.payload.find({
                        collection: constants_1.ProductsCollection,
                        //do not include entire user attached to product (if depth is 1)
                        depth: 0, // with depth = 0, this would return only the Product ID
                        where: {
                            user: {
                                equals: user.id,
                            },
                        },
                    })];
            case 1:
                products = (_c.sent()).docs;
                ownProductFileIds = products.map(function (prod) { return prod.product_files; }).flat();
                return [4 /*yield*/, req.payload.find({
                        collection: constants_1.OrdersCollection,
                        depth: 2, // with depth = 2, this order should have the entire Product objects
                        where: {
                            user: {
                                equals: user.id,
                            },
                        },
                    })];
            case 2:
                orders = (_c.sent()).docs;
                purchasedProductFileIds = orders
                    .map(function (order) {
                    return order.products.map(function (product) {
                        if (typeof product === "string")
                            //we do not get the whole Product object, but productId only
                            return req.payload.logger.error("Search depth not sufficient to find purchased file IDs"); // with this search depth, we only get the Product ID, not the ProductFiles in it
                        // if we get here, we actually get the ProductFile Id, which is inside Product Object
                        return typeof product.product_files === "string"
                            ? product.product_files
                            : product.product_files.id;
                    });
                })
                    .filter(Boolean) //take out all falsy values out of array
                    .flat();
                return [2 /*return*/, {
                        id: {
                            in: __spreadArray(__spreadArray([], ownProductFileIds, true), purchasedProductFileIds, true),
                        },
                    }];
        }
    });
}); };
exports.ProductFiles = {
    slug: constants_1.ProductFilesCollection,
    admin: {
        //Product files will not be a separate category, users will add files directly in Products category
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
    },
    hooks: {
        beforeChange: [addUser],
    },
    access: {
        read: yourOwnAndPurchased,
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    upload: {
        staticURL: "/product_files",
        staticDir: "product_files",
        mimeTypes: ["image/*", "font/*", "application/postscript"],
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: constants_1.UsersCollection,
            admin: {
                condition: function () { return false; },
            },
            hasMany: false,
            required: true,
        },
    ],
};
