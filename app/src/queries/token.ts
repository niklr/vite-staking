import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';
import { Token } from '../util/types';

export const GET_TOKEN_QUERY = gql`
  query GetToken($id: ID!) {
    token(id: $id) @client {
      id
      name
      symbol
      originalSymbol
      decimals
      iconUrl
      url
    }
  }
`;

export const TokenQueries = {
  async token(parent: any, { id }: any, context: ApolloContext): Promise<Maybe<Token>> {
    return context.client.datasource.getTokenAsync(id);
  }
}