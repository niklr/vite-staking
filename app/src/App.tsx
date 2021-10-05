import React from 'react';
import { ConnectedWeb3 } from './contexts/connectedWeb3';
import { Web3Provider } from './contexts/web3';
import { Main } from './features/main/components/main';

const App: React.FC = () => {
  return (
    <Web3Provider>
      <ConnectedWeb3>
        <Main />
      </ConnectedWeb3>
    </Web3Provider>
  );
}

export default App;
