import {
  createMint,
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { ACCOUNT_1_PUBLIC_KEY, airdrop } from "../01_airdrop";

const connection = new Connection("http://localhost:8899", "confirmed");

const createToken = async (mintWallet: Keypair) => {
  const mint = await createMint(
    connection,
    mintWallet,
    mintWallet.publicKey,
    null,
    9
  );
  return mint;
};

const transferTokens = async (
  tokenAddress: PublicKey,
  mintWallet: Keypair,
  recipient: PublicKey
) => {
  const mintTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintWallet,
    tokenAddress,
    mintWallet.publicKey
  );
  await mintTo(
    connection,
    mintWallet,
    tokenAddress,
    mintTokenAccount.address,
    mintWallet.publicKey,
    10 ** 15
  );

  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    mintWallet,
    tokenAddress,
    recipient
  );
  console.log(
    `Receiver Token Account Address: ${recipientTokenAccount.address}`
  );

  const transaction = new Transaction().add(
    createTransferInstruction(
      mintTokenAccount.address,
      recipientTokenAccount.address,
      mintWallet.publicKey,
      10 ** 15,
      [],
      TOKEN_PROGRAM_ID
    )
  );

  await sendAndConfirmTransaction(connection, transaction, [mintWallet], {
    commitment: "confirmed",
  });
};

(async () => {
  const mintWallet = Keypair.generate();
  console.log("Mintwallet address: ", mintWallet.publicKey.toBase58());
  await airdrop(mintWallet.publicKey, 2);
  const creatorTokenAddress = await createToken(mintWallet);
  console.log("Creator token address: ", creatorTokenAddress.toBase58());
  await transferTokens(
    creatorTokenAddress,
    mintWallet,
    new PublicKey(ACCOUNT_1_PUBLIC_KEY)
  );
})();
