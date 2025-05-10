import { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { redeem } from '../../utils/redeem';
import { PoolInfo } from '../../utils/getPoolList';
import '../../style/Theme.css';
import '../../style/button.css';
import '../../style/wrapper.css';

interface WithdrawLiquidityFormProps {
  pool: PoolInfo;
  receiptAmount: number;
  cashAmount: number;
  onSuccess: (signature: string) => void;
}

export const WithdrawLiquidityForm: FC<WithdrawLiquidityFormProps> = ({ 
  pool, 
  receiptAmount,
  cashAmount,
  onSuccess 
}) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const signature = await redeem(
        wallet,
        connection,
        new PublicKey(pool.poolPk),
      );

      onSuccess(signature.tx);
    } catch (err) {
      console.error("Error depositing liquidity:", err);
      setError(err instanceof Error ? err.message : "Failed to deposit liquidity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
      <div className="wrapper-container">
        <div className="wrapper-header">
        <div className="body-text">Margin ratio: {cashAmount/receiptAmount*100}%</div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="body-text">Deposited $Sol value: {receiptAmount}</div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="body-text">Owned $Cash value: {cashAmount}</div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="button btn-primary"
          disabled={isLoading || !wallet|| !receiptAmount}
        >
          {!wallet 
            ? 'Connect Wallet' 
            : isLoading 
              ? 'Withdrawing Liquidity...' 
              : 'Withdraw Liquidity'}
        </button>
        </div>
      </form>
    </div>
  );
}; 