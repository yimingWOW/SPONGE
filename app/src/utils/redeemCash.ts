import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fallIdl from '../idl/cash.json';
import { Idl } from '@coral-xyz/anchor';
import { AUTHORITY_SEED, CASH_TOKEN_SEED, SCASH_TOKEN_SEED } from './constants';

export async function redeemCash(
  wallet: any,
  connection: Connection,
  poolPda: PublicKey,
) {
  try {
    console.log('Executing redeemCash...');
    const provider = new anchor.AnchorProvider(
      connection,
      wallet,
      { preflightCommitment: "confirmed" }
    );

    const program = new anchor.Program(
      (fallIdl as any) as Idl,
      provider
    ) as any;

    const cashPool = await program.account.pool.fetch(poolPda);

    const [poolAuthority] = PublicKey.findProgramAddressSync(
      [
        cashPool.amm.toBuffer(),
        cashPool.mintA.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        cashPool.amm.toBuffer(),
        cashPool.mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED)
      ],
      program.programId
    );

    const poolAccountCash = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: poolAuthority,
    });

    const [sCashTokenMint] = PublicKey.findProgramAddressSync(
      [
        cashPool.amm.toBuffer(),
        cashPool.mintA.toBuffer(),
        Buffer.from(SCASH_TOKEN_SEED)
      ],
      program.programId
    );
    const [lenderAuthority] = PublicKey.findProgramAddressSync(
      [
        poolPda.toBuffer(),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(AUTHORITY_SEED)
      ],
      program.programId
    );
    const lenderCashToken = await anchor.utils.token.associatedAddress({
      mint: cashTokenMint,
      owner: provider.wallet.publicKey,
    });

    const lenderSCashToken = await anchor.utils.token.associatedAddress({
      mint: sCashTokenMint,
      owner: provider.wallet.publicKey,
    });


    const tx = await program.methods.redeemCash().accounts({
        cashPool: poolPda,
        poolAuthority: poolAuthority,
        poolAccountCash: poolAccountCash,
        cashTokenMint: cashTokenMint,
        sCashTokenMint: sCashTokenMint,
        lender: provider.wallet.publicKey,
        lenderAuthority: lenderAuthority,
        lenderCashToken: lenderCashToken,
        lenderSCashToken: lenderSCashToken,
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
    console.error('Error in redeem:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
}