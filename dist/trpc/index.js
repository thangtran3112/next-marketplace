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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
var zod_1 = require("zod");
var auth_router_1 = require("./auth-router");
var trpc_1 = require("./trpc");
var query_validator_1 = require("../lib/validators/query-validator");
var get_payload_1 = require("../get-payload");
var payment_router_1 = require("./payment-router");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_router_1.authRouter,
    payment: payment_router_1.paymentRouter,
    getInfiniteProducts: trpc_1.publicProcedure
        .input(zod_1.z.object({
        limit: zod_1.z.number().min(1).max(100),
        cursor: zod_1.z.number().nullish(),
        query: query_validator_1.QueryValidator,
    }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var cursor, query, sort, limit, queryOpts, payload, parsedQueryOpts, page, _c, items, hasNextPage, nextPage;
        var input = _b.input;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cursor = input.cursor, query = input.query;
                    sort = query.sort, limit = query.limit, queryOpts = __rest(query, ["sort", "limit"]);
                    return [4 /*yield*/, (0, get_payload_1.getPayloadClient)()];
                case 1:
                    payload = _d.sent();
                    parsedQueryOpts = {};
                    //Turn the query options into payload understandable format
                    Object.entries(queryOpts).forEach(function (_a) {
                        var key = _a[0], value = _a[1];
                        parsedQueryOpts[key] = {
                            equals: value,
                        };
                    });
                    page = cursor || 1;
                    return [4 /*yield*/, payload.find({
                            collection: "products",
                            where: __assign({ approvedForSale: {
                                    equals: "approved",
                                } }, parsedQueryOpts),
                            sort: sort,
                            depth: 1,
                            limit: limit,
                            page: page,
                        })];
                case 2:
                    _c = _d.sent(), items = _c.docs, hasNextPage = _c.hasNextPage, nextPage = _c.nextPage;
                    return [2 /*return*/, {
                            items: items,
                            nextPage: hasNextPage ? nextPage : null,
                        }];
            }
        });
    }); }),
});
