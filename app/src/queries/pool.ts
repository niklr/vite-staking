import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';

export const GET_TOTAL_PROJECTS_QUERY = gql`
  query GetTotalPools {
    totalPools @client
  }
`;

export const PoolQueries = {
  async totalPools(parent: any, params: any, context: ApolloContext): Promise<number> {
    return await context.client.datasource.getTotalPoolsAsync();
  },
}