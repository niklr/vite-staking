/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPoolUserInfo
// ====================================================

export interface GetPoolUserInfo_poolUserInfo {
  __typename: "PoolUserInfo";
  poolId: number;
  address: string;
  stakingBalance: any;
  rewardDebt: any;
}

export interface GetPoolUserInfo {
  poolUserInfo: GetPoolUserInfo_poolUserInfo | null;
}

export interface GetPoolUserInfoVariables {
  poolId: number;
  address: string;
}
