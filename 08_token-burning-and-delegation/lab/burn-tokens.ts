import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TRAINING_MINT_ADDRESS } from "../../07_creating-token-with-metadata/create-token-mint";
import { burn, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { ACCOUNT_2_PUBLIC_KEY } from "../../01_airdrop";

const TOKEN_DECIMALS = 2;
const BURN_TOKEN_AMOUNT = 4;
const MINOR_UNITS_PER_MAJOR_UNITS = 10 ** TOKEN_DECIMALS;
const DEVNET_URL = clusterApiUrl("devnet");

const connection = new Connection(DEVNET_URL);
const me = getKeypairFromEnvironment("ACC_1_SECRET_KEY");
const account2KeyPair = getKeypairFromEnvironment("ACC_2_SECRET_KEY");

const burnToken = async (
  amount = BURN_TOKEN_AMOUNT,
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

    const burnAmount = amount * MINOR_UNITS_PER_MAJOR_UNITS;
    const delegateAccount = new PublicKey(ACCOUNT_2_PUBLIC_KEY);

    // burn token via delegate account
    const burnTransactionSignature = await burn(
      connection,
      account2KeyPair,
      userTokenAccount.address,
      mint,
      delegateAccount,
      burnAmount
    );

    const explorerLink = getExplorerLink(
      "transaction",
      burnTransactionSignature,
      "devnet"
    );

    console.log(
      `✅ Burned ${BURN_TOKEN_AMOUNT} token, transaction: `,
      explorerLink
    );
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
};

burnToken();

export default burnToken;
