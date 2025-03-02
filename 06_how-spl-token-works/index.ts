import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import "dotenv/config";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

const createTokenMint = async () => {
  const tokenMint = createMint(connection, user, user.publicKey, null, 2);

  const link = getExplorerLink("address", tokenMint.toString(), "devnet");

  console.log(`✅ Finished! Created token mint: ${link}`);
  return tokenMint;
};

const createTokenMetadata = async () => {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const tokenMint = createTokenMint();

  const tokenMintAccount = new PublicKey(tokenMint);

  const metadataData = {
    name: "SPL Training Token",
    symbol: "TRAINING",
    uri: "https://arweave.net/1234",
    sellerFeeBasisPoints: 0,
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

  const transaction = new Transaction();

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
