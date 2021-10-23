import { gql } from '@apollo/client';
import { ApolloContext } from '../clients/apollo.client';
import { Pool, PoolUserInfo } from '../util/types';
import { TOKEN_FIELDS } from './token';

export const POOL_FIELDS = gql`
  fragment PoolFields on Pool {
    id
    stakingToken {
      ...TokenFields
    }
    rewardToken {
      ...TokenFields
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
    userInfo {
      ...PoolUserInfoFields
    }
  }
`;

export const POOL_USER_INFO_FIELDS = gql`
  fragment PoolUserInfoFields on PoolUserInfo {
    id
    poolId
    account
    stakingBalance
    rewardDebt
  }
`;

export const GET_POOL_QUERY = gql`
  ${TOKEN_FIELDS}
  ${POOL_USER_INFO_FIELDS}
  ${POOL_FIELDS}
  query GetPool($id: ID!, $account: String) {
    pool(id: $id, account: $account) @client {
      ...PoolFields
    }
  }
`;

export const GET_POOLS_QUERY = gql`
  ${TOKEN_FIELDS}
  ${POOL_USER_INFO_FIELDS}
  ${POOL_FIELDS}
  query GetPools($account: String) {
    pools(account: $account) @client {
      ...PoolFields
    }
  }
`;

export const GET_TOTAL_POOLS_QUERY = gql`
  query GetTotalPools {
    totalPools @client
  }
`;

export const GET_POOL_USER_INFO_QUERY = gql`
  ${POOL_USER_INFO_FIELDS}
  query GetPoolUserInfo($poolId: Int!, $account: String) {
    poolUserInfo(poolId: $poolId, account: $account) @client {
      ...PoolUserInfoFields
    }
  }
`;

export const PoolQueries = {
  async pool(parent: any, { id, account }: any, context: ApolloContext): Promise<Pool> {
    return context.client.datasource.getPoolAsync(Number(id), account);
  },
  async pools(parent: any, { account }: any, context: ApolloContext): Promise<Pool[]> {
    return context.client.datasource.getPoolsAsync(account);
  },
  async totalPools(parent: any, params: any, context: ApolloContext): Promise<number> {
    return await context.client.datasource.getTotalPoolsAsync();
  },
  async poolUserInfo(parent: any, { poolId, account }: any, context: ApolloContext): Promise<Maybe<PoolUserInfo>> {
    return context.client.datasource.getPoolUserInfoAsync(Number(poolId), account);
  }
}