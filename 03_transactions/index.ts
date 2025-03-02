import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import "dotenv/config";

export const transfer = async (
  keyPair: Keypair,
  recipientAddress: string,
  amount: number
) => {
  console.log("processing a transaction");
  const connection = new Connection("http://localhost:8899", "confirmed");
  const sender = new PublicKey(keyPair.publicKey);
  const recipient = new PublicKey(recipientAddress);

  const transaction = new Transaction();

  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: recipient,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  transaction.add(sendSolInstruction);

  const signature = await sendAndConfirmTransaction(connection, transaction, [
    keyPair,
  ]);

  // If you want to make it easier to look at Solana Explorer for transactions on localnet in the future, simply change your console.log to the following:
  // console.info(
  //   `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`
  // );

  console.log(`sent ${amount} SOL to `, recipientAddress);
  console.log("The transaction signature is: ", signature);
};

const secret = Uint8Array.from(JSON.parse(process.env.ACC_1_SECRET_KEY!));
const keyPair = Keypair.fromSecretKey(secret);

// transfer(keyPair, ACCOUNT_2_PUBLIC_KEY, 1);
