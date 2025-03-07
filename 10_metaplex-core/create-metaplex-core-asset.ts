import {
  generateSigner,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import {
  CORE_COLLECTION_ADDRESS,
  umi,
} from "./create-metaplex-core-collection";
import { create, fetchCollection } from "@metaplex-foundation/mpl-core";
import { getExplorerLink } from "@solana-developers/helpers";

const createMetaplexCoreAsset = async () => {
  const image = `https://raw.githubusercontent.com/GauravBurande/learning-solana/refs/heads/main/09_creating-nfts-with-metaplex/arena-1.png`;

  const metadata = {
    name: "Arena 1",
    description: `"The Nine-Tailed Strategist" - From the mystical Eastern Forest Realm comes the legendary fennec fox spirit who outsmarts opponents with tactical brilliance and ancient magic, wielding fan and dagger with lethal precision while nine enchanted tails manifest the wisdom of centuries...`,
    image,
    external_url: "https://github.com/gauravburande/learning-solana",
    attributes: [
      {
        trait_type: "Rarity",
        value: "Legendary",
      },
      {
        trait_type: "Element",
        value: "Fire",
      },
      {
        trait_type: "Role",
        value: "Strategist",
      },
      {
        trait_type: "Weapon",
        value: "Fan and Dagger",
      },
      {
        trait_type: "Tails",
        value: "Nine",
      },
      {
        trait_type: "Magic",
        value: "Ancient",
      },
    ],
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

  const uri = await umi.uploader.uploadJson(metadata);
  console.log("Asset offchain metadata URI:", uri);

  const collection = await fetchCollection(
    umi,
    UMIPublicKey(CORE_COLLECTION_ADDRESS)
  );
  // generate mint keypair
  const asset = generateSigner(umi);

  // create and mint nft
  await create(umi, {
    asset,
    collection,
    name: "Arena 1",
    uri,
  }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

  let explorerLink = getExplorerLink("address", asset.publicKey, "devnet");
  console.log(`Asset: ${explorerLink}`);
  console.log(`Asset address is:  ${asset.publicKey}`);
  console.log("✅ Finished successfully!");
};

createMetaplexCoreAsset();

export default createMetaplexCoreAsset;

export const CORE_ARENA_1_ADDRESS =
  "BuFMCsajKDuszz3ZZQEpWkFSKj1UgSZJNWVsCrgsMAhz";
