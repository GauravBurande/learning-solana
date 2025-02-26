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
Object.defineProperty(exports, "__esModule", { value: true });
exports.showBalance = void 0;
const web3_js_1 = require("@solana/web3.js");
const showBalance = (publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("show balance");
    const connnection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const response = yield connnection.getBalance(publicKey);
    return response / web3_js_1.LAMPORTS_PER_SOL;
});
exports.showBalance = showBalance;
//# sourceMappingURL=index.js.map