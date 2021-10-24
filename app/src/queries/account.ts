import { gql } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { ApolloContext } from '../clients/apollo.client';

export const GET_ACCOUNT_BALANCE_QUERY = gql`
  query GetAccountBalance($account: String) {
    accountBalance(account: $account) @client
  }
`;

export const AccountQueries = {
  async accountBalance(parent: any, { account }: any, context: ApolloContext): Promise<BigNumber> {
    return await context.client.datasource.getAccountBalanceAsync(account);
  }
}