import { Keypair } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import "dotenv/config";

const PING_PROGRAM_ADDRESS = "ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa";
const PING_PROGRAM_DATA_ADDRESS =
  "Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod";

export const pingTransactions = async () => {
  const secret = Uint8Array.from(JSON.parse(process.env.ACC_1_SECRET_KEY!));
  const payer = Keypair.fromSecretKey(secret);

  // we doing devnet, cauz no ping program on local
  const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
  const transaction = new web3.Transaction();
  const programId = new web3.PublicKey(PING_PROGRAM_ADDRESS);
  const pingProgramDataId = new web3.PublicKey(PING_PROGRAM_DATA_ADDRESS);

  const instruction = new web3.TransactionInstruction({
    keys: [
      {
        pubkey: pingProgramDataId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId,
  });

  transaction.add(instruction);

  const signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
  );

  console.log(
    `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );
};

pingTransactions();
