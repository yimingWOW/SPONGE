import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import fallIdl from '../idl/cash.json';
import { Idl } from '@coral-xyz/anchor';
export interface PoolInfo {
  poolPk: PublicKey;
  amm: PublicKey;
  admin: PublicKey;
  mintA: PublicKey;
  tokenAAmount: number;
  displayName?: string;
  tokenAIcon?: string;
  tokenBIcon?: string;
  tokenASymbol?: string;
  tokenBSymbol?: string;
}

export async function getCashPoolList(
  wallet: any,
  connection: Connection
): Promise<PoolInfo[]> {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    console.log("catch cash pool");
    const accounts = await program.account.pool.all();
    console.log("accounts", accounts);
    console.log("pool accounts", accounts[0].account.poolType);


    return accounts.filter((account: any) => 
        account.account.poolType == 1
      )
      .map((account: any) => ({
        poolPk: new PublicKey(account.publicKey.toString()),
        amm: new PublicKey(account.account.amm.toString()),
        mintA: new PublicKey(account.account.mintA.toString()),
        tokenAAmount: account.account.tokenAAmount.toString(),
        displayName: `${account.account.mintA.toString().slice(0,4)}`
      }));
  } catch (error) {
    console.error('Error fetching cash pool accounts:', error);
    throw error;
  }
} 