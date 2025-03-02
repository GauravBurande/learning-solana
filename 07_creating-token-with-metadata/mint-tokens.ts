import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";
import { TRAINING_MINT_ADDRESS } from "./create-token-mint";
import { ACC_1_TOKEN_ACCOUNT } from "./create-token-account";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
const RECIPIENT_TOKEN_ACCOUNT = new PublicKey(
  ACC_1_TOKEN_ACCOUNT //which is mine ACCOUNT 1
);

const mintTokens = async (
  recipientAssociatedTokenAccount = RECIPIENT_TOKEN_ACCOUNT,
  tokenMintAccount = TRAINING_MINT_ADDRESS
) => {
  const transactionSignature = await mintTo(
    connection,
    user,
    tokenMintAccount,
    recipientAssociatedTokenAccount,
    user.publicKey,
    10 * MINOR_UNITS_PER_MAJOR_UNITS
  );

  const link = getExplorerLink(
    "transaction",
    transactionSignature.toString(),
    "devnet"
  );

  console.log(`✅ Success! Mint Token Transaction: ${link}`);
  return link;
};

export default mintTokens;
