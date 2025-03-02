import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import "dotenv/config";
import {
  createCreateMetadataAccountV3Instruction,
  createUpdateMetadataAccountV2Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import { TRAINING_MINT_ADDRESS } from "./create-token-mint";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

const createTokenMetadata = async (
  tokenMintString: string = TRAINING_MINT_ADDRESS
) => {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const tokenMintAccount = new PublicKey(tokenMintString);

  const metadataData = {
    name: "SPL Training Token",
    symbol: "TRAINING",
    sellerFeeBasisPoints: 0,
    uri: "https://raw.githubusercontent.com/GauravBurande/supermemory/refs/heads/main/apps/web/public/images/landing_vault.png",
    creators: null,
    uses: null,
    collection: null,
  };

  const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const metadataPDA = metadataPDAAndBump[0];

  // Check if metadata account already exists
  let metadataAccountExists = false;
  try {
    const accountInfo = await connection.getAccountInfo(metadataPDA);
    if (accountInfo !== null) {
      metadataAccountExists = true;
    }
  } catch (error) {
    console.log("Metadata account not found, creating a new one...");
  }

  const transaction = new Transaction();

  if (!metadataAccountExists) {
    console.log("Creating new metadata account...");
    const createMetadataAccountInstruction =
      createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPDA,
          mint: tokenMintAccount,
          mintAuthority: user.publicKey,
          payer: user.publicKey,
          updateAuthority: user.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            collectionDetails: null,
            data: metadataData,
            isMutable: true,
          },
        }
      );

    transaction.add(createMetadataAccountInstruction);
  } else {
    console.log("Metadata account exists, updating...");
    const updateMetadataAccountInstruction =
      createUpdateMetadataAccountV2Instruction(
        {
          metadata: metadataPDA,
          updateAuthority: user.publicKey,
        },
        {
          updateMetadataAccountArgsV2: {
            data: metadataData,
            updateAuthority: user.publicKey,
            primarySaleHappened: false,
            isMutable: true,
          },
        }
      );

    transaction.add(updateMetadataAccountInstruction);
  }

  const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user]
  );

  const transactionLink = getExplorerLink(
    "transaction",
    transactionSignature,
    "devnet"
  );
  console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}`);

  const tokenMintLink = getExplorerLink(
    "address",
    tokenMintAccount.toString(),
    "devnet"
  );

  console.log(`✅ Look at the token mint again: ${tokenMintLink}`);
};

export default createTokenMetadata;
