import BigNumber from "bignumber.js"

export interface GenericType {
  name: string;
  type: string;
}

export type Network = {
  id: number
  networkId: number
  name: string
  rpcUrl: string
  connectorUrl: string
}

export type Token = {
  id: string
  name: string
  symbol: string
  originalSymbol: string
  decimals: number
  iconUrl: Maybe<string>
  url: Maybe<string>
}

export type Pool = {
  id: number
  stakingToken: Token
  rewardToken: Token
  apr: BigNumber
  totalStaked: BigNumber
  totalRewards: BigNumber
  startBlock: BigNumber
  endBlock: BigNumber
  endTimestamp: number
  latestRewardBlock: BigNumber
  rewardPerPeriod: BigNumber
  rewardPerToken: BigNumber
  paidOut: BigNumber
}

export type ContractPool = {
  stakingTokenId: string
  rewardTokenId: string
  totalStakingBalance: string
  totalRewardBalance: string
  startBlock: string
  endBlock: string
  latestRewardBlock: string
  rewardPerPeriod: string
  rewardPerToken: string
  paidOut: string
}

export type PoolUserInfo = {
  poolId: number
  address: string
  stakingBalance: BigNumber
  rewardDebt: BigNumber
}

export type ContractPoolUserInfo = {
  poolId: number
  address: string
  stakingBalance: string
  rewardDebt: string
}

export type PoolFilterValues = {
  stakedOnly: boolean
  showLive: boolean
  sortBy: string
  search: string
}

export enum PoolSortType {
  DEFAULT = 0,
  APR = 1,
  TOTAL_STAKED = 2
}

export enum GlobalEvent {
  NetworkBlockHeightChanged = 'NetworkBlockHeightChanged',
  PoolFilterValuesChanged = 'PoolFilterValuesChanged'
}