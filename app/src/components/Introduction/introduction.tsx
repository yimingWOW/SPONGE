import { FC } from 'react';
import '../../style/Typography.css';
import '../../style/Theme.css';
import '../../style/guide.css';

export const Introduction: FC = () => {
  return (
    <div className="card-container">
      <h1 className="title">Welcome to SPONGE Protocol</h1>

      <section className="section">
        <h2>What is SPONGE Protocol?</h2>
        <p>SPONGE is a decentralized stablecoin protocol for payfi on solana .</p>
      </section>

      <section className="section">
        <h2>Key Features</h2>
        
        <div className="feature">
          <h3>⚡ ---</h3>
          <p>...</p>
        </div>

      </section>
    </div>
  );
};
