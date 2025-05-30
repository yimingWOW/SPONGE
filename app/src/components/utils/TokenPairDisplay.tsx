import { FC } from 'react';
import defaultTokenIcon from '../../assets/default-token.png'; // 请确保路径正确
import '../../style/Theme.css';
import '../../style/Typography.css';
import { PoolInfo } from '../../utils/getPoolList';
import { CopyableAddress } from './copyableaddress';

interface TokenPairDisplayProps {
  poolInfo: PoolInfo | null;
}

export const TokenPairDisplay: FC<TokenPairDisplayProps> = ({ poolInfo }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = defaultTokenIcon;
  };

  return (
    <div className="combine-text">
      <div className="info-row">
        <div className="token-pair-container">
          <img 
            src={poolInfo?.tokenAIcon || defaultTokenIcon} 
            alt={poolInfo?.tokenASymbol || 'Token A'} 
            className="token-icon"
            onError={handleImageError}
          />
          <img 
            src={poolInfo?.tokenBIcon || defaultTokenIcon} 
            alt={poolInfo?.tokenBSymbol || 'Token B'} 
            className="token-icon"
            onError={handleImageError}
          />
        </div>
        <span className="body-text">Trading Pair: </span>
        <CopyableAddress address={poolInfo?.tokenASymbol || '@'} shortened={false} />
        <span className="body-text">Pool Address:</span>
        <CopyableAddress address={poolInfo?.poolPk.toString() || '#'} shortened={false} />
      </div>
    </div>
  );
}; 