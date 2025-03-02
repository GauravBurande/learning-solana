import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

// Once you know the receiver's token account address, you transfer tokens using the spl-token library's transfer function.

// const transactionSignature = await transfer(
//   connection,
//   payer,
//   source,
//   destination,
//   owner,
//   amount,
// );

// this is how it works:

async function buildTransferTransaction(
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.PublicKey,
  amount: number
): Promise<web3.Transaction> {
  const transaction = new web3.Transaction().add(
    token.createTransferInstruction(source, destination, owner, amount)
  );

  return transaction;
}

export default buildTransferTransaction;
