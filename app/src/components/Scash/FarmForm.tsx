import { FC } from 'react';
import { CashPoolList } from '../utils/cashPoollist';
import { useNavigate } from 'react-router-dom';

export const FarmForm: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <CashPoolList
        showCreatePool={true}
        onCreatePool={() => navigate('/scash/create')}
      />
    </div>
  );
};