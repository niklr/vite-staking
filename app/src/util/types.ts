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
  stakingBalance: BigNumber
  rewardDebt: BigNumber
}