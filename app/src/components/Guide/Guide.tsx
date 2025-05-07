import { FC } from 'react';
import { WrapSolForm } from './wrapSolForm';
import '../../style/Typography.css';
import '../../style/Theme.css';
import guidePic1 from '../../assets/guide_pic_1.png';
import '../../style/guide.css';
export const Guide: FC = () => {
  return (
    <div className="card-container">
        <h1 className="title">Getting Started with SPONGE Protocol</h1>
        
        <section className="section">
          <h2>Prerequisites</h2>
          <div className="step">
            <h3>1. Enable Devnet in Phantom Wallet</h3>
            <p>Open Phantom wallet settings → Developer Settings → Open Testnet Mode</p>
            <img src={guidePic1} alt="Enable Devnet in Phantom" className="guide-image" />
          </div>
          <div className="step">
            <h3>2. Get Devnet Token</h3>
            <p>Obtain Devnet SOL from the <a className="text-link" href="https://faucet.solana.com/" target="_blank" rel="noopener noreferrer">Solana Faucet</a></p>
            <p>Obtain Devnet USDT tokens from the <a className="text-link" href="https://spl-token-faucet.com/?token-name=USDT" target="_blank" rel="noopener noreferrer">SPL Token Faucet</a></p>
          </div>
          <div className="step">
            <h3>3. Convert SOL to WSOL for trading in Wsol-USDT Pool</h3>
            <WrapSolForm onSuccess={() => {}} />
          </div>
        </section>

        <section className="section">
          <h2>Using the Protocol</h2>
          <div className="step">
            <h3>1. Connect Your Wallet</h3>
            <p>Use the "Connect Wallet" button in the top right corner</p>
          </div>
          <div className="step">
            <h3>2. Deposit SOL</h3>
            <p>You can deposit SOL into the pool and get $cash</p>
          </div>
          <div className="step">
            <h3>3. Withdraw SOL</h3>
            <p>You can withdraw SOL and repay the $cash</p>
          </div>
        </section>
    </div>
  );
};