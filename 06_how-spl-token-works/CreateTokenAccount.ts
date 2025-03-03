import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

// const tokenAccount = await createAccount(
//   connection,
//   payer,
//   mint,
//   owner,
//   keypair
// );
// how this works is:

async function buildCreateTokenAccountTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  mint: web3.PublicKey
): Promise<web3.Transaction> {
  const mintState = await token.getMint(connection, mint);
  const accountKeyPair = web3.Keypair.generate();
  const space = token.getAccountLenForMint(mintState);
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  const programId = token.TOKEN_PROGRAM_ID;

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeyPair.publicKey,
      lamports,
      space,
      programId,
    }),
    token.createInitializeAccountInstruction(
      accountKeyPair.publicKey,
      mint,
      payer,
      programId
    )
  );

  return transaction;
}

export default buildCreateTokenAccountTransaction;
