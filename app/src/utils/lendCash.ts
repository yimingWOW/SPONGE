import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fallIdl from '../idl/cash.json';
import BN from 'bn.js';
import { Idl } from '@coral-xyz/anchor';
import { AUTHORITY_SEED, CASH_TOKEN_SEED, SCASH_TOKEN_SEED } from './constants';

export async function lendCash(
  wallet: any,
  connection: Connection,
  poolPda: PublicKey,
  amount: number | BN,
) {
  try {
    console.log('Executing lendCash...');
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    const pool = await program.account.pool.fetch(poolPda);
    
    console.log('pool.amm', pool.amm.toString());

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        pool.mintA.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        pool.mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED)
      ],
      program.programId
    );
    const [sCashTokenMint] = PublicKey.findProgramAddressSync(
      [
        pool.amm.toBuffer(),
        pool.mintA.toBuffer(),
        Buffer.from(SCASH_TOKEN_SEED)
      ],
      program.programId
    );

    const poolAccountCash = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: poolAuthority,
    });
    const lenderCashToken = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: provider.wallet.publicKey,
    });
    const lenderScashToken = await anchor.utils.token.associatedAddress({
      mint: sCashTokenMint,
      owner: provider.wallet.publicKey,
    });

    const tx = await program.methods.lendCash(new BN(amount)).accounts({
        mintA: pool.mintA,
        cashPool: poolPda,
        poolAuthority: poolAuthority,
        poolAccountCash: poolAccountCash,
        cashTokenMint: cashTokenMint,
        sCashTokenMint: sCashTokenMint,
        lender: provider.wallet.publicKey,
        lenderCashToken: lenderCashToken,
        lenderScashToken: lenderScashToken,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }).rpc();

    return {
      tx,
      accounts: {
        poolAuthority,
        cashTokenMint,
        lenderCashToken,
      }
    };
  } catch (error) {
    console.error('Error in lendCash:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}