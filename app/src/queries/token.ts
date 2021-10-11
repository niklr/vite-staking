import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';
import { Token } from '../util/types';

export const TOKEN_FIELDS = gql`
  fragment TokenFields on Token {
    id
    name
    symbol
    originalSymbol
    decimals
    iconUrl
    url
  }
`;

export const GET_TOKEN_QUERY = gql`
  ${TOKEN_FIELDS}
  query GetToken($id: ID!) {
    token(id: $id) @client {
      ...TokenFields
    }
  }
`;

export const TokenQueries = {
  async token(parent: any, { id }: any, context: ApolloContext): Promise<Token> {
    return context.client.datasource.getTokenAsync(id);
  }
}