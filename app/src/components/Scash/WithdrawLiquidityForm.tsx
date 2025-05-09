import { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { redeemCash } from '../../utils/redeemCash';
import { PoolInfo } from '../../utils/getCashPoolList';
import '../../style/Theme.css';
import '../../style/button.css';
import '../../style/wrapper.css';

interface WithdrawLiquidityFormProps {
  pool: PoolInfo;
  poolCashAmount: number;
  userCashAmount: number;
  userSCashAmount: number;
  onSuccess: (signature: string) => void;
}

export const WithdrawLiquidityForm: FC<WithdrawLiquidityFormProps> = ({ 
  pool, 
  poolCashAmount,
  userCashAmount,
  userSCashAmount,
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
      const signature = await redeemCash(
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
          <div className="body-text">Deposited  $Cash amount: {poolCashAmount}</div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="body-text">Owned  $Cash amount: {userCashAmount}</div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div className="body-text">Owned $SCASH amount: {userSCashAmount}</div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <button 
          type="submit" 
          className="button btn-primary"
          disabled={isLoading || !wallet|| !poolCashAmount}
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