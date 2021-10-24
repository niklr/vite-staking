import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import BigNumber from "bignumber.js";
import { getApolloClient } from "../clients/apollo.client";
import { CommonConstants } from "../common/constants";
import { getMomentFactory } from "../factories";
import { DEPOSIT_MUTATION, WITHDRAW_MUTATION } from "../mutations";
import { Deposit, DepositVariables } from "../mutations/__generated__/Deposit";
import { Withdraw, WithdrawVariables } from "../mutations/__generated__/Withdraw";
import { GET_POOL_QUERY, GET_POOL_USER_INFO_QUERY } from "../queries";
import { GetPool, GetPoolVariables } from "../queries/__generated__/GetPool";
import { GetPoolUserInfo, GetPoolUserInfoVariables } from "../queries/__generated__/GetPoolUserInfo";
import { getLogger } from "../util/logger";
import { MomentUtil } from "../util/moment.util";
import { Pool } from "../util/types";
import { getWalletManager, WalletManager } from "../wallet";

const logger = getLogger();

export class PoolService {
  private readonly _apollo: ApolloClient<NormalizedCacheObject>;
  private readonly _walletManager: WalletManager;
  private readonly _moment: MomentUtil;

  constructor() {
    this._apollo = getApolloClient();
    this._walletManager = getWalletManager();
    this._moment = getMomentFactory().create();
  }

  async getAsync(_id: number, _fetchPolicy: FetchPolicy = "network-only"): Promise<Maybe<Pool>> {
    try {
      const poolQuery = await this._apollo.query<GetPool, GetPoolVariables>({
        query: GET_POOL_QUERY,
        variables: {
          id: _id.toString()
        },
        fetchPolicy: _fetchPolicy
      });
      const userInfoQuery = await this._apollo.query<GetPoolUserInfo, GetPoolUserInfoVariables>({
        query: GET_POOL_USER_INFO_QUERY,
        variables: {
          poolId: _id,
          account: this._walletManager.getActiveAccount()?.address
        },
        fetchPolicy: _fetchPolicy
      });
      const pool = poolQuery.data.pool as unknown as Pool;
      return {
        ...pool,
        userInfo: userInfoQuery.data.poolUserInfo,
        fetchTimestamp: this._moment.get().unix()
      }
    } catch (error) {
      logger.error(error)();
    }
  }

  async depositAsync(_id: number, _tokenId: string, _amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Deposit, DepositVariables>({
      mutation: DEPOSIT_MUTATION,
      variables: {
        id: _id.toString(),
        tokenId: _tokenId,
        amount: _amount
      }
    });
    return Boolean(result.data?.deposit ?? false);
  }

  async withdrawAsync(_id: number, _amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Withdraw, WithdrawVariables>({
      mutation: WITHDRAW_MUTATION,
      variables: {
        id: _id.toString(),
        amount: _amount
      }
    });
    return Boolean(result.data?.withdraw ?? false);
  }

  updateRewardPerToken(pool: Maybe<Pool>, blockNumber: BigNumber): boolean {
    if (!pool?.userInfo) {
      return false;
    }

    const latestBlock = blockNumber.lt(pool.endBlock) ? blockNumber : pool.endBlock;

    // rewardPerToken is global, so we only want to update once per timestamp/block.
    // latestRewardBlock initially set to startBlock, so no updates before that.
    if (latestBlock.lte(pool.latestRewardBlock)) {
      return false;
    }

    // if staking balance is 0 over a period, the rewardPerToken should not increase.
    if (pool.totalStaked.eq(new BigNumber(0))) {
      pool.latestRewardBlock = latestBlock;
      return true;
    }

    // increase rewardPerToken by reward amount over period since previous reward block.
    const period = latestBlock.minus(pool.latestRewardBlock);
    const latestReward = pool.rewardPerPeriod.times(period).times(CommonConstants.REWARD_FACTOR).div(pool.totalStaked);
    pool.rewardPerToken = pool.rewardPerToken.plus(latestReward);

    pool.latestRewardBlock = latestBlock;
    return true;
  }
}

const service = new PoolService();

export const getPoolService = () => {
  return service;
}