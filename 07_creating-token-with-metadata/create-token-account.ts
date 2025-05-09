import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import "dotenv/config";
import { TRAINING_MINT_ADDRESS } from "./create-token-mint";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

const createTokenAccount = async (
  recipient = user.publicKey,
  mint = TRAINING_MINT_ADDRESS
) => {
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mint,
    recipient
  );

  console.log(`Token Account: ${tokenAccount.address.toBase58()}`);
  //

  const link = getExplorerLink(
    "address",
    tokenAccount.address.toString(),
    "devnet"
  );

  console.log(`✅ Created token Account: ${link}`);
  return tokenAccount.address;
};

export default createTokenAccount;

export const ACC_1_TOKEN_ACCOUNT =
  "7HW5xSfwigRPD4Nyx2GaiSkZGWRh2UphcadHtQSoKcsQ";
