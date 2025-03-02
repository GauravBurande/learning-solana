import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));
const userKeyPair = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${userKeyPair.publicKey.toBase58()}`
);

const createTokenMint = async (user: Keypair = userKeyPair) => {
  const tokenMint = await createMint(connection, user, user.publicKey, null, 2);
  console.log("tokenMint: ", tokenMint);

  const link = getExplorerLink("address", tokenMint.toString(), "devnet");

  console.log(`✅ Finished! Created token mint: ${link}`);
  return tokenMint;
};

export default createTokenMint;
