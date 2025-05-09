import { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { lendCash } from '../../utils/lendCash';
import { PoolInfo } from '../../utils/getCashPoolList';
import '../../style/Theme.css';
import '../../style/button.css';
import '../../style/wrapper.css';
import defaultTokenIcon from '../../assets/default-token.png';

interface DepositLiquidityFormProps {
  pool: PoolInfo | null;
  onSuccess: (signature: string) => void;
}

export const DepositLiquidityForm: FC<DepositLiquidityFormProps> = ({ 
  pool, 
  onSuccess 
}) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState({
    amountA: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const amountA = parseFloat(formData.amountA) ;

      const signature = await lendCash(
        wallet,
        connection,
        new PublicKey(pool?.poolPk || ''),
        amountA,
      );

      onSuccess(signature.tx);
      setFormData({ amountA: '' });
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
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
          
          <div className="wrapper-box">
            <div className="input-header">Token A</div>
            <div className="token-input-section">
              <div className="token-selector">
                <img 
                  src={pool?.tokenAIcon || defaultTokenIcon} 
                  alt={pool?.tokenASymbol || 'Token A'} 
                  className="token-icon"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultTokenIcon;
                  }}
                />
                <span>{pool?.tokenASymbol}</span>
              </div>
              <input
                type="number"
                step="any"
                value={formData.amountA}
                onChange={(e) => setFormData({...formData, amountA: e.target.value})}
                placeholder="0.00"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="button btn-primary"
            disabled={isLoading || !wallet || !formData.amountA}
            >
            {!wallet  ? 'Connect Wallet'  : isLoading  ? 'Depositing Liquidity...'  : 'Deposit Liquidity'}
          </button>
        </div>
      </form>
    </div>
  );
}; 