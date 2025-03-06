import {
  findMetadataPda,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { NFT_COLLECTION_ADDRESS, umi } from "./create-nft-collection";
import { ARENA_7_NFT_ADDRESS } from "./create-nft-inside-collection";
import { publicKey as UMIPublicKey } from "@metaplex-foundation/umi";
import { getExplorerLink } from "@solana-developers/helpers";

const verifyMetaplexNFT = async (
  nftAddressString: string = ARENA_7_NFT_ADDRESS,
  nftColletionAddressString: string = NFT_COLLECTION_ADDRESS
) => {
  console.log("Verifying Metaplex NFT...");

  const collectionAddress = UMIPublicKey(nftColletionAddressString);
  const nftAddress = UMIPublicKey(nftAddressString);

  // Verify our collection as a Certified Collection
  // See https://developers.metaplex.com/token-metadata/collections
  const metadata = findMetadataPda(umi, { mint: nftAddress });

  await verifyCollectionV1(umi, {
    metadata,
    collectionMint: collectionAddress,
    authority: umi.identity,
  }).sendAndConfirm(umi);

  const explorerLink = getExplorerLink("address", nftAddress, "devnet");
  console.log(`NFT Collection Verified: ${explorerLink}`);
  console.log("✅ Metaplex NFT verified!");
};

verifyMetaplexNFT();
export default verifyMetaplexNFT;
