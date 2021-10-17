import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { getApolloClient } from "../clients/apollo.client";
import { DEPOSIT_MUTATION } from "../mutations";
import { Deposit, DepositVariables } from "../mutations/__generated__/Deposit";

class PoolService {
  private readonly _apollo: ApolloClient<NormalizedCacheObject>;

  constructor() {
    this._apollo = getApolloClient();
  }

  async depositAsync(id: number, amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Deposit, DepositVariables>({
      mutation: DEPOSIT_MUTATION,
      variables: {
        id: id.toString(),
        amount
      }
    });
    console.log(result);
    return Boolean(result.data?.deposit);
  }
}

const service = new PoolService();

export const getPoolService = () => {
  return service;
}