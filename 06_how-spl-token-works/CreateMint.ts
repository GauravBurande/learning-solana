import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

// const tokenMint = await createMint(
//   connection,
//   payer,
//   mintAuthority,
//   freezeAuthority,
//   decimal
// );
// underneath this is:

async function buildCreateMintTransaction(
  connection: web3.Connection,
  payer: web3.PublicKey,
  decimals: number
): Promise<web3.Transaction> {
  const lamports = await token.getMinimumBalanceForRentExemptAccount(
    connection
  );
  const accountKeyPair = web3.Keypair.generate();
  const programId = token.TOKEN_PROGRAM_ID;

  const transaction = new web3.Transaction().add(
    web3.SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: accountKeyPair.publicKey,
      programId,
      space: token.MINT_SIZE,
      lamports,
    }),
    token.createInitializeMintInstruction(
      accountKeyPair.publicKey,
      decimals,
      payer,
      payer,
      programId
    )
  );

  return transaction;
}

export default buildCreateMintTransaction;
