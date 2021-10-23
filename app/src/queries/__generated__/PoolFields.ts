/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PoolFields
// ====================================================

export interface PoolFields_stakingToken {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface PoolFields_rewardToken {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface PoolFields_userInfo {
  __typename: "PoolUserInfo";
  id: string;
  poolId: number;
  account: string;
  stakingBalance: any;
  rewardDebt: any;
}

export interface PoolFields {
  __typename: "Pool";
  id: string;
  stakingToken: PoolFields_stakingToken;
  rewardToken: PoolFields_rewardToken;
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
  userInfo: PoolFields_userInfo | null;
}
