import {
  fetchMetadataFromSeeds,
  updateV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { NFT_COLLECTION_ADDRESS, umi } from "./create-nft-collection";
import { publicKey as UMIPublicKey } from "@metaplex-foundation/umi";
import { getExplorerLink } from "@solana-developers/helpers";

const updateMetaplexNFT = async (
  nftAddressString: string = NFT_COLLECTION_ADDRESS
) => {
  console.log("Updating Metaplex NFT...");

  const nftImageUrl =
    "https://raw.githubusercontent.com/GauravBurande/learning-solana/refs/heads/main/09_creating-nfts-with-metaplex/arena-champions-of-realms.png";

  const uri = await umi.uploader.uploadJson({
    name: "Arena: Champions of Realms",
    symbol: "ACR",
    description: `"Arena: Champions of Realms" showcases mystical entities bound to eternal combat across dimensions—each bearer of ancient power, each marked by destiny. Fox sages, star-crossed lovers, elemental wielders, and dark oracles clash and converge in a universe where magic flows through every vein and victory demands both strength and sacrifice.`,
    image: nftImageUrl,
  });

  console.log("NFT offchain metadata URI:", uri);

  const mint = UMIPublicKey(nftAddressString);
  const nft = await fetchMetadataFromSeeds(umi, { mint });

  await updateV1(umi, {
    mint,
    authority: umi.identity,
    data: {
      ...nft,
      sellerFeeBasisPoints: 0,
      name: "Arena: Champions of Realms",
    },
    primarySaleHappened: true,
    isMutable: true,
  }).sendAndConfirm(umi);

  const explorerLink = getExplorerLink("address", mint, "devnet");
  console.log(`NFT Updated with new metadata URI: ${explorerLink}`);

  console.log("✅ Metaplex NFT updated!");
};

export default updateMetaplexNFT;
