import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { approve, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import "dotenv/config";
import { TRAINING_MINT_ADDRESS } from "../../07_creating-token-with-metadata/create-token-mint";
import { ACCOUNT_2_PUBLIC_KEY } from "../../01_airdrop";

const DEVNET_URL = clusterApiUrl("devnet");
const TOKEN_DECIMALS = 2;
const DELEGATE_AMOUNT = 5;
const MINOR_UNITS_PER_MAJOR_UNITS = 10 ** TOKEN_DECIMALS;

const connection = new Connection(DEVNET_URL);
const me = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

const delegateTokens = async (user = me, mint = TRAINING_MINT_ADDRESS) => {
  try {
    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      user,
      mint,
      user.publicKey
    );

    // For this example, we will be using System Program's ID as a delegate
    // const delegatePublicKey = new PublicKey(SystemProgram.programId);
    const delegatePublicKey = new PublicKey(ACCOUNT_2_PUBLIC_KEY);

    const approveTransactionSignature = await approve(
      connection,
      user,
      userTokenAccount.address,
      delegatePublicKey,
      user.publicKey,
      DELEGATE_AMOUNT * MINOR_UNITS_PER_MAJOR_UNITS
    );

    const explorerLink = getExplorerLink(
      "transaction",
      approveTransactionSignature,
      "devnet"
    );
    console.log(`✅ Delegate approved. Transaction: ${explorerLink}`);
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

export default delegateTokens;

delegateTokens();
