import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';
import { Pool, PoolUserInfo } from '../util/types';

export const GET_POOL_QUERY = gql`
  query GetPool($id: ID!) {
    pool(id: $id) @client {
      id
      stakingToken {
        id
        name
        symbol
        originalSymbol
        decimals
        iconUrl
        url
      }
      rewardToken {
        id
        name
        symbol
        originalSymbol
        decimals
        iconUrl
        url
      }
      apr
      totalStaked
      totalRewards
      startBlock
      endBlock
      endTimestamp
      latestRewardBlock
      rewardPerPeriod
      rewardPerToken
      paidOut
    }
  }
`;

export const GET_TOTAL_POOLS_QUERY = gql`
  query GetTotalPools {
    totalPools @client
  }
`;

export const GET_POOL_USER_INFO_QUERY = gql`
  query GetPoolUserInfo($poolId: Int!, $address: String) {
    poolUserInfo(poolId: $poolId, address: $address) @client {
      poolId
      address
      stakingBalance
      rewardDebt
    }
  }
`;

export const PoolQueries = {
  async pool(parent: any, { id }: any, context: ApolloContext): Promise<Pool> {
    return context.client.datasource.getPoolAsync(id);
  },
  async totalPools(parent: any, params: any, context: ApolloContext): Promise<number> {
    return await context.client.datasource.getTotalPoolsAsync();
  },
  async poolUserInfo(parent: any, { poolId, address }: any, context: ApolloContext): Promise<Maybe<PoolUserInfo>> {
    return context.client.datasource.getPoolUserInfoAsync(poolId, address);
  }
}