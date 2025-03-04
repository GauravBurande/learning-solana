// const transactionSignature = await approve(
//   connection,
//   payer,
//   account,
//   delegate,
//   owner,
//   amount
// );

import { createApproveInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

async function buildApproveTransaction(
  account: PublicKey,
  delegate: PublicKey,
  owner: PublicKey,
  amount: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createApproveInstruction(account, delegate, owner, amount)
  );

  return transaction;
}

export default buildApproveTransaction;
