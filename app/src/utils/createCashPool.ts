import * as anchor from '@coral-xyz/anchor';
import { web3 } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fallIdl from '../idl/cash.json';
import { 
  ADMIN_PUBLIC_KEY,
  AUTHORITY_SEED,
  CASH_TOKEN_SEED,
  SCASH_TOKEN_SEED,
  CASH_POOL,
} from './constants';
import { Idl } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface CreateCashPoolResult {
  tx1: string;
}
export async function createCashPool(
  wallet: AnchorWallet,
  connection: Connection,
  ammPda: PublicKey,
  mintA: PublicKey,
): Promise<CreateCashPoolResult> {
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

    const [poolPda] = PublicKey.findProgramAddressSync(
      [ammPda.toBuffer(), mintA.toBuffer(), Buffer.from(CASH_POOL)],
      program.programId
    );
    const [poolAuthorityPda] = PublicKey.findProgramAddressSync(
      [ammPda.toBuffer(), mintA.toBuffer(), Buffer.from(AUTHORITY_SEED)],
      program.programId
    );

    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        ammPda.toBuffer(), mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED)
      ],
      program.programId
    );
    const [sCashTokenMint] = PublicKey.findProgramAddressSync(
      [
        ammPda.toBuffer(), mintA.toBuffer(),
        Buffer.from(SCASH_TOKEN_SEED)
      ],
      program.programId
    );
    const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ 
      units: 1_000_000  
    });
    console.log('Step 1: Creating cash pool...');
    let tx1: string='';
    if (!await accountExists(connection, poolPda)) {
      tx1 = await program.methods.createCashPool().accounts({
        amm: ammPda,
        mintA: mintA,

        cashTokenMint: cashTokenMint,
        cashPool: poolPda,
        poolAuthority: poolAuthorityPda,

        sCashTokenMint: sCashTokenMint,
        admin: ADMIN_PUBLIC_KEY,
        payer: provider.wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: web3.SYSVAR_RENT_PUBKEY,  
        }).preInstructions([modifyComputeUnits]).rpc({
          commitment: 'confirmed',
        });
      await connection.confirmTransaction(tx1, 'confirmed');
      console.log('Transaction signature:', tx1);
    } else {
      console.log('Pool already exists, skipping...');
    }

    return {
      tx1,
    };
  } catch (error) {
    console.error('Error', error);
  }
  return {
    tx1: '',
  };
}

async function accountExists(connection: Connection, publicKey: PublicKey): Promise<boolean> {
  const account = await connection.getAccountInfo(publicKey);
  return account !== null;
}