import { createCollection, mplCore } from "@metaplex-foundation/mpl-core";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from "@solana-developers/helpers";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import "dotenv/config";

const connection = new Connection(clusterApiUrl("devnet"));

const user = getKeypairFromEnvironment("ACC_1_SECRET_KEY");

export const umi = createUmi(connection).use(mplCore()).use(irysUploader());

const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiKeypair));

const image = `https://raw.githubusercontent.com/GauravBurande/learning-solana/refs/heads/main/09_creating-nfts-with-metaplex/arena-champions-of-realms.png`;

const metadata = {
  name: "Arena: Champions of Realms",
  description: `"Arena: Champions of Realms" showcases mystical entities bound to eternal combat across dimensions—each bearer of ancient power, each marked by destiny. Fox sages, star-crossed lovers, elemental wielders, and dark oracles clash and converge in a universe where magic flows through every vein and victory demands both strength and sacrifice.`,
  image,
  external_url: "https://github.com/GauravBurande/learning-solana",
  properties: {
    files: [
      {
        uri: image,
        type: "image/png",
      },
    ],
    category: "image",
  },
};

const createNFTCollection = async () => {
  const uri = await umi.uploader.uploadJson(metadata);
  console.log("Collection offchain metadata URI:", uri);

  // generate mint keypair
  const collection = generateSigner(umi);

  await createCollection(umi, {
    collection,
    name: "Arena: Champions of Realms",
    uri,
  }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

  let explorerLink = getExplorerLink("address", collection.publicKey, "devnet");
  console.log(`Collection: ${explorerLink}`);
  console.log(`Collection address is:  ${collection.publicKey}`);
  console.log("✅ Finished successfully!");
};

// createNFTCollection();
export default createNFTCollection;

export const CORE_COLLECTION_ADDRESS =
  "6ofNpoACzpB7BREcBmmq5vRC65x1qbTtpCpinqjj5ox8";
