import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { ACCOUNT_2_PUBLIC_KEY } from "../01_airdrop";
import { TRAINING_MINT_ADDRESS } from "./create-token-mint";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"));

const me = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${me.publicKey.toBase58()}`
);

const my2ndAccount = new PublicKey(ACCOUNT_2_PUBLIC_KEY);

const tokenMintAccount = new PublicKey(TRAINING_MINT_ADDRESS);

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

const transferTokens = async (
  sender = me,
  recipient = my2ndAccount,
  mint = tokenMintAccount
) => {
  const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    mint,
    sender.publicKey
  );

  console.log("source token acount: ", sourceTokenAccount.address);

  const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    mint,
    recipient
  );

  console.log("destination token account: ", destinationTokenAccount.address);
  // transfer the tokens
  const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    1 * MINOR_UNITS_PER_MAJOR_UNITS
  );

  const explorerLink = getExplorerLink(
    "transaction",
    signature.toString(),
    "devnet"
  );

  console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}`);
};

transferTokens();

export default transferTokens;
