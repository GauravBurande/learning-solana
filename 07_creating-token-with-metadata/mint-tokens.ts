import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { mintTo } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

// Our token has two decimal places
const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);
const RECIPIENT_TOKEN_ACCOUNT = new PublicKey(
  "7HW5xSfwigRPD4Nyx2GaiSkZGWRh2UphcadHtQSoKcsQ" //which is mine
);

const mintTokens = async (
  recipientAssociatedTokenAccount = RECIPIENT_TOKEN_ACCOUNT,
  mintString = "5qv2nmww9UAgwPDV3EYZQYhVfzL7VbRQD984m1Eu31de"
) => {
  const tokenMintAccount = new PublicKey(mintString);

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
};

export default mintTokens;
