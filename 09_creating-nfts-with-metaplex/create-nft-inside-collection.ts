import { getExplorerLink } from "@solana-developers/helpers";
import {
  createGenericFile,
  generateSigner,
  percentAmount,
  publicKey as UMIPublicKey,
} from "@metaplex-foundation/umi";
import { promises as fs } from "fs";
import * as path from "path";
import { NFT_COLLECTION_ADDRESS, umi } from "./create-nft-collection";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";

const createNFTInsideCollection = async () => {
  const collectionNftAddress = UMIPublicKey(NFT_COLLECTION_ADDRESS);

  // const imageFilePath = path.join(
  //   process.cwd(),
  //   "09_creating-nfts-with-metaplex/arena-3.png"
  // );

  // const buffer = await fs.readFile(imageFilePath);
  // const file = createGenericFile(buffer, imageFilePath, {
  //   contentType: "image/png",
  // });

  // const [image] = await umi.uploader.upload([file]);
  // console.log("NFT image URI:", image);

  const image = `https://raw.githubusercontent.com/GauravBurande/learning-solana/refs/heads/main/09_creating-nfts-with-metaplex/arena-3.png`;

  const uri = await umi.uploader.uploadJson({
    name: "Arena 3",
    symbol: "A3",
    description: `"Scarlet Fang, the White-Maned Fury of the Crimson Wastes, strikes fear with her blazing crimson eyes and mystical third-eye rune that channels ancient desert magic. Her elaborate ceremonial garb—adorned with protective sigils and geometric patterns—belies a tactical brilliance that has left a hundred champions broken beneath the unforgiving arena sands.`,
    image,
  });
  console.log("Collection offchain metadata URI:", uri);

  const mint = generateSigner(umi);

  const transaction = createNft(umi, {
    mint,
    uri,
    name: "Arena 3",
    symbol: "A3",
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
      key: collectionNftAddress,
      verified: false,
    },
  });

  await transaction.sendAndConfirm(umi, { send: { commitment: "confirmed" } });

  let explorerLink = getExplorerLink("address", mint.publicKey, "devnet");
  console.log(`Token Mint:  ${explorerLink}`);
};

createNFTInsideCollection();
export default createNFTInsideCollection;

export const ARENA_1_NFT_ADDRESS =
  "8WrxAf7RvAYLmZzWofFHd15JKHwmz55FiJ6UuHshPzSb";

export const ARENA_2_NFT_ADDRESS =
  "9s6Po7oq4qHinzPdqPA9tFpq4YqzixgJa3ECKFTA9s1N";

export const ARENA_3_NFT_ADDRESS =
  "G9yUZJUivtSaykHMbw7kmUR2iqxf4x2rFrQYz3qdAcK1";

// assignment: create nfts for arena 2 - 11 in this collection and verify them using the verifyMetaplexNFT function.

// image description prompt: `this is an image of an arena champion of one of the realms, you have to give me a description for this character, you're the best fantasy writer in the world, be creative! max 3 sentences and 30 words!`
