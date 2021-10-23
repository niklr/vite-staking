/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPool
// ====================================================

export interface GetPool_pool_stakingToken {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface GetPool_pool_rewardToken {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface GetPool_pool_userInfo {
  __typename: "PoolUserInfo";
  id: string;
  poolId: number;
  account: string;
  stakingBalance: any;
  rewardDebt: any;
}

export interface GetPool_pool {
  __typename: "Pool";
  id: string;
  stakingToken: GetPool_pool_stakingToken;
  rewardToken: GetPool_pool_rewardToken;
  apr: any;
  totalStaked: any;
  totalRewards: any;
  startBlock: any;
  endBlock: any;
  endTimestamp: number;
  latestRewardBlock: any;
  rewardPerPeriod: any;
  rewardPerToken: any;
  paidOut: any;
  userInfo: GetPool_pool_userInfo | null;
}

export interface GetPool {
  pool: GetPool_pool;
}

export interface GetPoolVariables {
  id: string;
  account?: string | null;
}
