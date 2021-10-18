import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { getApolloClient } from "../clients/apollo.client";
import { DEPOSIT_MUTATION, WITHDRAW_MUTATION } from "../mutations";
import { Deposit, DepositVariables } from "../mutations/__generated__/Deposit";
import { Withdraw, WithdrawVariables } from "../mutations/__generated__/Withdraw";
import { GET_POOL_QUERY, GET_POOL_USER_INFO_QUERY } from "../queries";
import { GetPool, GetPoolVariables } from "../queries/__generated__/GetPool";
import { GetPoolUserInfo, GetPoolUserInfoVariables } from "../queries/__generated__/GetPoolUserInfo";
import { getLogger } from "../util/logger";
import { Pool } from "../util/types";
import { getWalletManager, WalletManager } from "../wallet";

const logger = getLogger();

class PoolService {
  private readonly _apollo: ApolloClient<NormalizedCacheObject>;
  private readonly _walletManager: WalletManager;

  constructor() {
    this._apollo = getApolloClient();
    this._walletManager = getWalletManager();
  }

  async getAsync(id: number, fetchPolicy: FetchPolicy = "network-only"): Promise<Maybe<Pool>> {
    try {
      const poolQuery = await this._apollo.query<GetPool, GetPoolVariables>({
        query: GET_POOL_QUERY,
        variables: {
          id: id.toString()
        },
        fetchPolicy
      });
      const userInfoQuery = await this._apollo.query<GetPoolUserInfo, GetPoolUserInfoVariables>({
        query: GET_POOL_USER_INFO_QUERY,
        variables: {
          poolId: id,
          account: this._walletManager.getActiveAccount()?.address
        },
        fetchPolicy
      });
      const pool = poolQuery.data.pool as unknown as Pool;
      return {
        ...pool,
        userInfo: userInfoQuery.data.poolUserInfo
      }
    } catch (error) {
      logger.error(error)();
    }
  }

  async depositAsync(id: number, amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Deposit, DepositVariables>({
      mutation: DEPOSIT_MUTATION,
      variables: {
        id: id.toString(),
        amount
      }
    });
    return Boolean(result.data?.deposit ?? false);
  }

  async withdrawAsync(id: number, amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Withdraw, WithdrawVariables>({
      mutation: WITHDRAW_MUTATION,
      variables: {
        id: id.toString(),
        amount
      }
    });
    return Boolean(result.data?.withdraw ?? false);
  }
}

const service = new PoolService();

export const getPoolService = () => {
  return service;
}