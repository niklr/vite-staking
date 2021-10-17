import { gql } from "@apollo/client";
import { ApolloContext } from "../clients/apollo.client";

export const DEPOSIT_MUTATION = gql`
mutation Deposit($id: ID!, $amount: String!) {
  deposit(id: $id, amount: $amount) @client
}
`;

export const PoolMutations = {
  async deposit(parent: any, { id, amount }: any, context: ApolloContext): Promise<boolean> {
    return context.client.datasource.depositAsync(Number(id), amount);
  }
}