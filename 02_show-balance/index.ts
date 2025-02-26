import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const showBalance = async (publicKey: PublicKey) => {
  console.log("show balance");

  const connnection = new Connection("http://localhost:8899", "confirmed");
  const response = await connnection.getBalance(publicKey);
  return response / LAMPORTS_PER_SOL;
};
