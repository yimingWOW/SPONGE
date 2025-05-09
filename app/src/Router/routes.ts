import { RouteConfig } from './types';
import Dashboard from '../components/Dashboard';
import { Guide } from '../components/Guide/Guide';
import { AmmList } from '../components/Amm/AmmList';
import { FarmForm } from '../components/Cash/FarmForm';
import { PoolItem } from '../components/Cash/PoolItem';
import { CreatePoolForm } from '../components/Cash/CreatePoolForm';
import { FarmForm as ScashFarmForm } from '../components/Scash/FarmForm';
import { PoolItem as ScashPoolItem } from '../components/Scash/PoolItem';
import { CreatePoolForm as ScashCreatePoolForm } from '../components/Scash/CreatePoolForm';
import { Introduction } from '../components/Introduction/introduction';
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        component: Guide,
      },
      {
        path: 'introduction',
        component: Introduction,
        meta: { title: 'Introduction' }
      },
      {
        path: 'guide',
        component: Guide,
        meta: { title: 'Guide' }
      },
      {
        path: 'amm',
        component: AmmList,
        meta: { title: 'AMM' }
      },
      {
        path: 'cash',
        component: FarmForm,
        meta: { title: 'Cash' },
      },
      {
        path: 'cash/create',
        component: CreatePoolForm,
        meta: { title: 'Create Cash Pool' }
      },
      {
        path: 'cash/:poolAddress',
        component: PoolItem,
        meta: { title: 'Cash Pool Item' }
      },
      {
        path: 'scash',
        component: ScashFarmForm,
        meta: { title: 'Scash' },
      },
      {
        path: 'scash/create',
        component: ScashCreatePoolForm,
        meta: { title: 'Create Scash Pool' }
      },
      {
        path: 'scash/:poolAddress',
        component: ScashPoolItem,
        meta: { title: 'Scash Pool Item' }
      },
    ]
  }
]; 