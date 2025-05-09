import fallIdl from '../idl/cash.json';
export const CONFIG = {
  fallIdl
} as const;


export const AUTHORITY_SEED= "a"; // authority
export const CASH_POOL = "b";
export const LENDING_TOKEN_SEED= "e"; // lending_token
export const CASH_TOKEN_SEED= "f"; // cash_token
export const SCASH_TOKEN_SEED= "g"; // scash_token
// Constants
export const MINIMUM_LIQUIDITY = 100;
export const PRICE_SCALE = 1_000_000_000; 
export const MIN_COLLATERAL_RATIO = 10000;
export const BASE_RATE = 10000;

export const EXCLUDED_PUBLIC_KEY = 'GUXNPX5ci1Qj76MZe2aRJ33zK48VmT6gXVyR86CsF4T5';
export const ADMIN_PUBLIC_KEY = 'EisXsrG1aCoaJTFSDdXTBRAEAZP46wPWkKJpF7RfC3DV';