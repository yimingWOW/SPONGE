import { FC, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCashPoolList, PoolInfo } from '../../utils/getCashPoolList';
import { TokenPairDisplay } from './TokenPairDisplay';
import '../../style/Theme.css';
import '../../style/Typography.css';

interface CashPoolListProps {
  showCreatePool?: boolean;
  onCreatePool?: () => void;
}

export const CashPoolList: FC<CashPoolListProps> = ({
  showCreatePool = false,
  onCreatePool
}) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const navigate = useNavigate();
  const location = useLocation();
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPools = async () => {
    try {
      setIsLoading(true);
      if (!wallet) return;
      const poolList = await getCashPoolList(wallet, connection);
      setPools(poolList);
    } catch (error) {
      console.error('Error fetching pools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPools();
  }, [connection, wallet]);

  const handleDetailsClick = (pool: PoolInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    const basePath = location.pathname.split('/')[1];
    navigate(`/${basePath}/${pool.poolPk.toString()}`);
  };

  return (
    <div className="tap-page">
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="section">
          {showCreatePool && (
            <>
              <div className="right-location-button">
                <button className="button btn-primary" onClick={onCreatePool}>
                  Create Pool
                </button>
              </div>
              <div className="section"></div>
            </>
          )}
          {pools.length === 0 ? (
            <span className="code-text">No pools available</span>
          ) : (
            pools.map((pool) => (
              <div
                key={pool.poolPk.toString()}
                className="step"
              >
                <div className="row-align-center">
                  <TokenPairDisplay
                    poolInfo={pool}
                  />
                  <button 
                    className="button btn-primary"
                    onClick={(e) => handleDetailsClick(pool, e)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};