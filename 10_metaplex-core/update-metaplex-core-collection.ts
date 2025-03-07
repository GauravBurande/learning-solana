import {
  fetchCollection,
  updateCollection,
} from "@metaplex-foundation/mpl-core";
import {
  CORE_COLLECTION_ADDRESS,
  umi,
} from "./create-metaplex-core-collection";
import { getExplorerLink } from "@solana-developers/helpers";
import { publicKey as UMIPublicKey } from "@metaplex-foundation/umi";

const updateMetaplexCoreCollection = async () => {
  const image = `https://raw.githubusercontent.com/GauravBurande/learning-solana/refs/heads/main/09_creating-nfts-with-metaplex/arena-champions-of-realms.png`;

  const metadata = {
    name: "Arena: Veins of Eternity",
    description: `"Arena: Veins of Eternity" showcases mystical entities bound to eternal combat across dimensions—each bearer of ancient power, each marked by destiny. Fox sages, star-crossed lovers, elemental wielders, and dark oracles clash and converge in a universe where magic flows through every vein and victory demands both strength and sacrifice.`,
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

  const uri = await umi.uploader.uploadJson(metadata);
  console.log("Collection offchain metadata URI:", uri);

  const collection = await fetchCollection(
    umi,
    UMIPublicKey(CORE_COLLECTION_ADDRESS)
  );
  await updateCollection(umi, {
    collection: collection.publicKey,
    uri,
    name: "Arena: Veins of Eternity",
  }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

  const explorerLink = getExplorerLink(
    "address",
    collection.publicKey,
    "devnet"
  );
  console.log(`Collection: ${explorerLink}`);
  console.log("✅ Finished successfully!");
};

// updateMetaplexCoreCollection();

export default updateMetaplexCoreCollection;
