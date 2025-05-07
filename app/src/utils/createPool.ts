import * as anchor from '@coral-xyz/anchor';
import { web3 } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import fallIdl from '../idl/cash.json';
import { 
  ADMIN_PUBLIC_KEY,
  AUTHORITY_SEED,
  LENDING_TOKEN_SEED,
  CASH_TOKEN_SEED,
} from '../utils/constants';
import { Idl } from '@coral-xyz/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface CreatePoolResult {
  tx1: string;
}
export async function createPool(
  wallet: AnchorWallet,
  connection: Connection,
  ammPda: PublicKey,
  mintA: PublicKey,
): Promise<CreatePoolResult> {
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
      [ammPda.toBuffer(), mintA.toBuffer()],
      program.programId
    );
    const [poolAuthorityPda] = PublicKey.findProgramAddressSync(
      [ammPda.toBuffer(), mintA.toBuffer(), Buffer.from(AUTHORITY_SEED)],
      program.programId
    );
    const poolAccountA = await anchor.utils.token.associatedAddress({
      mint: mintA,
      owner: poolAuthorityPda
    });
    const [lendingReceiptTokenMint] = PublicKey.findProgramAddressSync(
      [
        ammPda.toBuffer(), mintA.toBuffer(),
        Buffer.from(LENDING_TOKEN_SEED)
      ],
      program.programId
    );
    const [cashTokenMint] = PublicKey.findProgramAddressSync(
      [
        ammPda.toBuffer(), mintA.toBuffer(),
        Buffer.from(CASH_TOKEN_SEED)
      ],
      program.programId
    );
    const modifyComputeUnits = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({ 
      units: 1_000_000  
    });
    console.log('Step 1: Creating pool...');
    let tx1: string='';
    if (!await accountExists(connection, poolPda)) {
      tx1 = await program.methods.createPool1().accounts({
        amm: ammPda,
        mintA: mintA,
        pool: poolPda,
        poolAuthority: poolAuthorityPda,
        poolAccountA: poolAccountA,
        lendingReceiptTokenMint: lendingReceiptTokenMint,
        cashTokenMint: cashTokenMint,
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
    console.log('Step 2: Creating pool...');

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