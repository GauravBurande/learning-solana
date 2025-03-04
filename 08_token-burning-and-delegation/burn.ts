import { createBurnInstruction } from "@solana/spl-token";
import { PublicKey, Transaction } from "@solana/web3.js";

// const transactionSignature = await burn(
//   connection,
//   payer,
//   account,
//   mint,
//   owner,
//   amount
// );

async function buildBurnTransaction(
  account: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  amount: number
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createBurnInstruction(account, mint, owner, amount)
  );

  return transaction;
}

export default buildBurnTransaction;
