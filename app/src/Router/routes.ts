import { RouteConfig } from './types';
import Dashboard from '../components/Dashboard';
import { Guide } from '../components/Guide/Guide';
import { LenderPoolList } from '../components/Cash/LendPoolList';
import { AmmList } from '../components/Amm/AmmList';
import { FarmForm } from '../components/Farm/FarmForm';
import { LenderPoolItem } from '../components/Cash/LendPoolItem';
import { PoolItem } from '../components/Farm/PoolItem';
import { CreatePoolForm } from '../components/Farm/CreatePoolForm';
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
        path: 'farm',
        component: FarmForm,
        meta: { title: 'Farm' },
      },
      {
        path: 'farm/create',
        component: CreatePoolForm,
        meta: { title: 'Create Farm Pool' }
      },
      {
        path: 'farm/:poolAddress',
        component: PoolItem,
        meta: { title: 'Farm Pool Item' }
      },
      {
        path: 'cash',
        component: LenderPoolList,
        meta: { title: 'cash Pool' },
      },
      {
        path: 'cash/:poolAddress',
        component: LenderPoolItem,
      },
    ]
  }
]; 