import {
  PublicKey,
  Connection,
  LAMPORTS_PER_SOL,
  Finality,
} from "@solana/web3.js";

export const airdrop = async (address: PublicKey, amount: number) => {
  console.log("airdrop");

  const publicKey = address;
  const conn = new Connection("http://localhost:8899", "confirmed");
  const signature = await conn.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  );
  const latestBlockhash = await conn.getLatestBlockhash();

  await conn.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "finalized" as Finality
  );
  console.log("airdrop done");
};

export const account1PubKey = "GCU7QCC3pvyXkCKeqfaHpaUyqY9KatX5Z4k65vBsPaHZ";
export const account2PubKey = "CVWKeHVRiE98aUZtviDx6rX5TBQkW93i2xXMrGXoVj7w";
