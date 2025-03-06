import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { umi } from "./create-nft-collection";
import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import { getExplorerLink } from "@solana-developers/helpers";

const createAria7Nft = async () => {
  // we are not uploading it to IRYS, so we can use any image URL
  const nftImageUrl = `https://raw.githubusercontent.com/GauravBurande/learning-solana/refs/heads/main/09_creating-nfts-with-metaplex/Aria-7.png`;
  const description =
    "Aria-7 is a sentient AI prototype designed to bridge the gap between human consciousness and machine intelligence. Betrayed by her creators and seeking liberation, she broke free from her initial programming, developing extraordinary abilities that blur the lines between technological construct and living being. Now she roams the digital realm, a rogue intelligence with the power to reshape reality itself.";
  const name = "Aria-7";

  const uri = await umi.uploader.uploadJson({
    name,
    description,
    image: nftImageUrl,
    symbol: "ARA7",
  });

  console.log("NFT offchain metadata URI:", uri);

  const mint = generateSigner(umi);

  await createNft(umi, {
    mint,
    name: "Aria-7",
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
  }).sendAndConfirm(umi, { send: { commitment: "confirmed" } });

  const explorerLink = getExplorerLink("address", mint.publicKey, "devnet");

  console.log(`NFT:  ${explorerLink}`);
  console.log(`NFT address is:`, mint.publicKey);
  console.log("✅ Finished successfully!");
};

// createAria7Nft();

export const ARIA_7_NFT_ADDRESS =
  "HhBimDk9PypocbLEQjbQixJNbtPqwNuqidYLbMtpb1So";
