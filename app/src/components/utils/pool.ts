import { PoolStatusInfo } from '../../utils/getPoolDetail';

export const shouldInitializePool = (status: PoolStatusInfo | null) => {
    if (!status) return true;
    return !(
      status.createPool1
    );
  };