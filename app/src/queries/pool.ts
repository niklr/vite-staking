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
  }
`;

export const GET_POOL_QUERY = gql`
  ${TOKEN_FIELDS}
  ${POOL_FIELDS}
  query GetPool($id: ID!) {
    pool(id: $id) @client {
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