import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

const createTokenAccount = async (
  recipient = user.publicKey,
  mintString = "5qv2nmww9UAgwPDV3EYZQYhVfzL7VbRQD984m1Eu31de"
) => {
  const mint = new PublicKey(mintString);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    user,
    mint,
    recipient
  );

  console.log(`Token Account: ${tokenAccount.address.toBase58()}`);
  //   7HW5xSfwigRPD4Nyx2GaiSkZGWRh2UphcadHtQSoKcsQ

  const link = getExplorerLink(
    "address",
    tokenAccount.address.toString(),
    "devnet"
  );

  console.log(`✅ Created token Account: ${link}`);
};

export default createTokenAccount;
