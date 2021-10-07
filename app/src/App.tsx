import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { styled } from '@mui/material';
import { getApolloClient } from './clients/apollo.client';
import { ConnectedWeb3 } from './contexts/connectedWeb3';
import { Web3Provider } from './contexts/web3';
import { Main } from './features/main/components/main';
import BackgroundSVG from './bg.svg';

const Background = styled('div')(`
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('${BackgroundSVG}');
`
);

const App: React.FC = () => {
  const apolloClient = React.useMemo(() => getApolloClient(), [])
  return (
    <Background>
      <Web3Provider>
        <ConnectedWeb3>
          <ApolloProvider client={apolloClient}>
            <Main />
          </ApolloProvider>
        </ConnectedWeb3>
      </Web3Provider>
    </Background>
  );
}

export default App;
