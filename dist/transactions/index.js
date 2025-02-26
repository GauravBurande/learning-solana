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
exports.transaction = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
require("dotenv/config");
const transaction = (keyPair, recipientAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("processing a transaction");
    const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const sender = new web3_js_1.PublicKey(keyPair.publicKey);
    const recipient = new web3_js_1.PublicKey(recipientAddress);
    const transaction = new web3_js_1.Transaction();
    const sendSolInstruction = web3_js_1.SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
    });
    transaction.add(sendSolInstruction);
    const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        keyPair,
    ]);
    console.log(`sent ${amount} SOL to `, recipientAddress);
    console.log("The transaction signature is: ", signature);
});
exports.transaction = transaction;
const secret = Uint8Array.from(JSON.parse(process.env.ACC_1_SECRET_KEY));
const keyPair = web3_js_1.Keypair.fromSecretKey(secret);
(0, exports.transaction)(keyPair, airdrop_1.account2PubKey, 1);
//# sourceMappingURL=index.js.map