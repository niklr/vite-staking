import { gql } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { ApolloContext } from '../clients/apollo.client';

export const GET_NETWORK_BLOCK_HEIGHT_QUERY = gql`
  query GetNetworkBlockHeight {
    networkBlockHeight @client
  }
`;

export const NetworkQueries = {
  async networkBlockHeight(parent: any, params: any, context: ApolloContext): Promise<BigNumber> {
    return await context.client.datasource.getNetworkBlockHeightAsync();
  }
}