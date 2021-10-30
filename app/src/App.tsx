import { ApolloProvider } from '@apollo/client';
import { styled } from '@mui/material';
import BigNumber from 'bignumber.js';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import BackgroundSVG from './bg.svg';
import { getApolloClient } from './clients/apollo.client';
import { ConnectedWeb3 } from './contexts/connectedWeb3';
import { Web3Provider } from './contexts/web3';
import { Main } from './features/main/components/main';

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
  // Almost never return exponential notation
  BigNumber.config({ EXPONENTIAL_AT: 1e+9 })
  return (
    <Background>
      <SnackbarProvider maxSnack={3}>
        <ApolloProvider client={apolloClient}>
          <Web3Provider>
            <ConnectedWeb3>
              <Main />
            </ConnectedWeb3>
          </Web3Provider>
        </ApolloProvider>
      </SnackbarProvider>
    </Background>
  );
}

export default App;
