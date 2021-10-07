import BigNumber from "bignumber.js"

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
  decimals: number
  iconUrl: string
  url: string
}

export type Pool = {
  id: number
  stakingToken: Token
  awardToken: Token
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

export type PoolUserInfo = {
  poolId: number
  stakingBalance: BigNumber
  rewardDebt: BigNumber
}