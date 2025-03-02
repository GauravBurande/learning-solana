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

const connection = new Connection(clusterApiUrl("devnet"));
const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

const createTokenMetadata = async (
  tokenMintString: string = "5qv2nmww9UAgwPDV3EYZQYhVfzL7VbRQD984m1Eu31de"
) => {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const tokenMintAccount = new PublicKey(tokenMintString);

  const metadataData = {
    name: "SPL Training Token",
    symbol: "TRAINING",
    uri: "https://arweave.net/1234",
    image: "https://static.wikia.nocookie.net/kidvskat/images/c/c9/Kat1.png",
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

createTokenMetadata();

export default createTokenMetadata;
