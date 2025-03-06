import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { promises as fs } from "fs";
import * as path from "path";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");
console.log("Loaded user:", user.publicKey.toBase58());

export const umi = createUmi(connection);
// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);

// load the MPL metadata program plugin and assign a signer to the umi instance
umi
  .use(keypairIdentity(umiKeypair))
  .use(mplTokenMetadata())
  .use(irysUploader());

const generateNFTCollection = async () => {
  const collectionImagePath = path.join(
    process.cwd(),
    "09_creating-nfts-with-metaplex/arena-champions-of-realms.png"
  );

  const buffer = await fs.readFile(collectionImagePath);
  const file = createGenericFile(buffer, collectionImagePath, {
    contentType: "image/png",
  });

  const [image] = await umi.uploader.upload([file]);
  console.log("image uri:", image);

  // upload offchain json to Arweave using irys
  const uri = await umi.uploader.uploadJson({
    name: "Arena: Champions of Realms",
    symbol: "ACR",
    description: `"Arena: Champions of Realms" showcases mystical entities bound to eternal combat across dimensions—each bearer of ancient power, each marked by destiny. Fox sages, star-crossed lovers, elemental wielders, and dark oracles clash and converge in a universe where magic flows through every vein and victory demands both strength and sacrifice.`,
    image,
  });
  console.log("Collection offchain metadata URI:", uri);

  // generate mint keypair
  const collectionMint = generateSigner(umi);

  await createNft(umi, {
    mint: collectionMint,
    name: "Arena: Champions of Realms",
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
  }).sendAndConfirm(umi, { send: { commitment: "confirmed" } });

  let explorerLink = getExplorerLink(
    "address",
    collectionMint.publicKey,
    "devnet"
  );

  console.log(`Collection NFT:  ${explorerLink}`);
  console.log(`Collection NFT address is:`, collectionMint.publicKey);
  console.log("✅ Finished successfully!");
};

export const NFT_COLLECTION_ADDRESS =
  "DACGLock1ZYxqZpbiXC7Q8mmB4mzqSixwBhNiXkfYKtN";

export default generateNFTCollection;
