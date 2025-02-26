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

export const transaction = async (
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

  console.log(`sent ${amount} SOL to `, recipientAddress);
  console.log("The transaction signature is: ", signature);
};

const secret = Uint8Array.from(JSON.parse(process.env.ACC_1_SECRET_KEY!));
const keyPair = Keypair.fromSecretKey(secret);

// transaction(keyPair, account2PubKey, 1);
