"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
var account_credentials_validator_1 = require("../lib/validators/account-credentials-validator");
var trpc_1 = require("./trpc");
var get_payload_1 = require("../get-payload");
var server_1 = require("@trpc/server");
var zod_1 = require("zod");
var constants_1 = require("../constants");
exports.authRouter = (0, trpc_1.router)({
    createPayloadUser: trpc_1.publicProcedure
        .input(account_credentials_validator_1.AuthCredentialsValidator)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var email, password, payload, users;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = input.email, password = input.password;
                    return [4 /*yield*/, (0, get_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.find({
                            collection: constants_1.UsersCollection,
                            where: {
                                email: {
                                    equals: email,
                                },
                            },
                        })];
                case 2:
                    users = (_c.sent()).docs;
                    if (users.length !== 0)
                        throw new server_1.TRPCError({ code: "CONFLICT" });
                    return [4 /*yield*/, payload.create({
                            collection: constants_1.UsersCollection,
                            data: {
                                email: email,
                                password: password,
                                role: "user",
                            },
                        })];
                case 3:
                    _c.sent();
                    return [2 /*return*/, { success: true, sentToEmail: email }];
            }
        });
    }); }),
    verifyEmail: trpc_1.publicProcedure
        .input(zod_1.z.object({ token: zod_1.z.string() }))
        .query(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var token, payload, isVerified;
        var input = _b.input;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    token = input.token;
                    return [4 /*yield*/, (0, get_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    return [4 /*yield*/, payload.verifyEmail({
                            collection: constants_1.UsersCollection,
                            token: token,
                        })];
                case 2:
                    isVerified = _c.sent();
                    if (!isVerified)
                        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
                    return [2 /*return*/, { success: true }];
            }
        });
    }); }),
    signIn: trpc_1.publicProcedure
        .input(account_credentials_validator_1.AuthCredentialsValidator)
        .mutation(function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var email, password, res, payload, err_1;
        var input = _b.input, ctx = _b.ctx;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    email = input.email, password = input.password;
                    res = ctx.res;
                    return [4 /*yield*/, (0, get_payload_1.getPayloadClient)()];
                case 1:
                    payload = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    //Login, if successful, cookie will be set to res object
                    return [4 /*yield*/, payload.login({
                            collection: constants_1.UsersCollection,
                            data: {
                                email: email,
                                password: password,
                            },
                            res: res,
                        })];
                case 3:
                    //Login, if successful, cookie will be set to res object
                    _c.sent();
                    return [2 /*return*/, { success: true }];
                case 4:
                    err_1 = _c.sent();
                    throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
                case 5: return [2 /*return*/];
            }
        });
    }); }),
});
