import "dotenv/config";
import { TRAINING_MINT_ADDRESS } from "../../07_creating-token-with-metadata/create-token-mint";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, revoke } from "@solana/spl-token";

const DEVNET_URL = clusterApiUrl("devnet");

const connection = new Connection(DEVNET_URL);
const me = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

const revokeDelegateAccess = async (
  mint = TRAINING_MINT_ADDRESS,
  user = me
) => {
  try {
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      mint,
      user.publicKey
    );

    const revokeTransactionSignature = await revoke(
      connection,
      user,
      userTokenAccount.address,
      user
    );

    const explorerLink = getExplorerLink(
      "transaction",
      revokeTransactionSignature,
      "devnet"
    );

    console.log(`✅ Revoke Delegate Transaction: ${explorerLink}`);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

revokeDelegateAccess();

export default revokeDelegateAccess;
