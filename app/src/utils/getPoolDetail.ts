import { getAccount, getAssociatedTokenAddress } from '@solana/spl-token';
import { AUTHORITY_SEED,LENDING_TOKEN_SEED } from './constants';
import { PoolInfo } from './getPoolList';
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import fallIdl from '../idl/cash.json';
import { 
  CASH_TOKEN_SEED,
} from './constants';
import { Idl } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import defaultTokenIcon from '../assets/default-token.png';

export interface PoolStatusInfo {
  createPool1: boolean;
}

export type PoolDetailInfo = {
  poolStatus: PoolStatusInfo;
  poolInfo: PoolInfo;
  userAssets: {
    tokenAAmount: string;
    lendingReceiptAmount: string;
    cashAmount: string;
  };
}

export async function getPoolDetail(
  wallet: AnchorWallet,
  connection: Connection,
  poolPk: PublicKey,
  walletPublicKey: PublicKey  
): Promise<PoolDetailInfo> {
  try {
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed" 
      }
    );
    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    const pool = await program.account.pool.fetch(poolPk);
    let amm: any;
    try{
      amm = await program.account.amm.fetch(pool.amm);
      console.log("amm", amm);
    }catch(e){
      console.log("amm", e);
    }

    const mintA = new PublicKey(pool.mintA);
    
    const [lenderAuthority] = PublicKey.findProgramAddressSync(
      [
        poolPk.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );
    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );
    const [lendingReceiptTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from(LENDING_TOKEN_SEED)
      ],
      program.programId
    );
    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED)
      ],
      program.programId
    );
    const [
      createPool1,
      poolAccountAInfo,
      userTokenAAccount,
      userLendingReceiptAmount,
      userCashAmount,
    ] = await Promise.all([
      accountExists(connection, poolPk).catch(() => false),
      getUserTokenAmount(connection, poolAuthority, pool.mintA).catch(() => 0),
      getUserTokenAmount(connection, walletPublicKey, mintA).catch(() => 0),
      getUserTokenAmount(connection, lenderAuthority, lendingReceiptTokenMint).catch(() => 0),
      getUserTokenAmount(connection, walletPublicKey, cashTokenMint).catch(() => 0),
    ]);
    console.log("poolAccountAInfo", poolAccountAInfo);
    console.log("userTokenAAccount", userTokenAAccount);
    console.log("userLendingReceiptAmount", userLendingReceiptAmount);
    console.log("userCashAmount", userCashAmount);
    return {
      poolStatus: {
        createPool1,
      },
      poolInfo: {
        poolPk: poolPk,
        amm: pool.amm,
        admin: amm.admin,
        mintA: mintA,
        tokenASymbol: mintA.toString().slice(0, 4),
        tokenAIcon: defaultTokenIcon,
        tokenAAmount: Number(poolAccountAInfo),
      },
      userAssets: {
        tokenAAmount: userTokenAAccount.toString(),
        lendingReceiptAmount: userLendingReceiptAmount.toString(),
        cashAmount: userCashAmount.toString()
      }
    };
  } catch (error) {
    console.error('Error getting lending pool details:', error);
    return {
      poolStatus: {
        createPool1: false,
      },
      poolInfo: {
        poolPk: new PublicKey(poolPk),
        amm: new PublicKey(""),
        admin: new PublicKey(""),
        mintA: new PublicKey(""),
        tokenAAmount: 0,
      },
      userAssets: {
        tokenAAmount: '0',
        lendingReceiptAmount: '0',
        cashAmount: '0'
      }
    };
  }
}

async function getUserTokenAmount (connection: Connection, walletPublicKey: PublicKey, tokenMint: PublicKey): Promise<number> {
  try{
    const userToken = await getAssociatedTokenAddress(tokenMint, walletPublicKey, true);
    const userTokenAccount = await getAccount(connection as any, userToken);
    return Number(userTokenAccount.amount);
  }catch(e){
    console.log("getUserTokenAmount",e);
    return 0;
  }
}

async function accountExists(connection: Connection, publicKey: PublicKey): Promise<boolean> {
  const account = await connection.getAccountInfo(publicKey);
  return account !== null;
}


