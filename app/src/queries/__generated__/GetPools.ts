/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPools
// ====================================================

export interface GetPools_pools_stakingToken {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface GetPools_pools_rewardToken {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface GetPools_pools_userInfo {
  __typename: "PoolUserInfo";
  id: string;
  poolId: number;
  account: string;
  stakingBalance: any;
  rewardDebt: any;
}

export interface GetPools_pools {
  __typename: "Pool";
  id: string;
  stakingToken: GetPools_pools_stakingToken;
  rewardToken: GetPools_pools_rewardToken;
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
  userInfo: GetPools_pools_userInfo | null;
}

export interface GetPools {
  pools: GetPools_pools[];
}

export interface GetPoolsVariables {
  account?: string | null;
}
