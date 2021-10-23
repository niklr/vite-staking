import { gql } from "@apollo/client";
import { ApolloContext } from "../clients/apollo.client";

export const DEPOSIT_MUTATION = gql`
mutation Deposit($id: ID!, $tokenId: String!, $amount: String!) {
  deposit(id: $id, tokenId: $tokenId, amount: $amount) @client
}
`;

export const WITHDRAW_MUTATION = gql`
mutation Withdraw($id: ID!, $amount: String!) {
  withdraw(id: $id, amount: $amount) @client
}
`;

export const PoolMutations = {
  async deposit(parent: any, { id, tokenId, amount }: any, context: ApolloContext): Promise<boolean> {
    return context.client.datasource.depositAsync(Number(id), tokenId, amount);
  },
  async withdraw(parent: any, { id, amount }: any, context: ApolloContext): Promise<boolean> {
    return context.client.datasource.withdrawAsync(Number(id), amount);
  }
}