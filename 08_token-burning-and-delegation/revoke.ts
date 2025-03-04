// import { revoke } from "@solana/spl-token";

// const transactionSignature = await revoke(connection, payer, account, owner);

import { PublicKey, Transaction } from "@solana/web3.js";
import { createRevokeInstruction } from "@solana/spl-token";

async function buildRevokeTransaction(
  account: PublicKey,
  owner: PublicKey
): Promise<Transaction> {
  const transaction = new Transaction().add(
    createRevokeInstruction(account, owner)
  );

  return transaction;
}

export default buildRevokeTransaction;
