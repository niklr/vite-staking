import BigNumber from "bignumber.js"

export interface GenericType {
  name: string;
  type: string;
}

export type Contract = {
  address: string
  contractName: string
  binary: string
  offChain: string
  abi: any[]
}

export type Network = {
  id: number
  networkId: number
  name: string
  rpcUrl: string
  connectorUrl: string
}

export type Token = {
  __typename: string
  id: string
  name: string
  symbol: string
  originalSymbol: string
  decimals: number
  iconUrl: Maybe<string>
  url: Maybe<string>
}

export type Pool = {
  __typename: string
  id: number
  stakingToken: Token
  rewardToken: Token
  apr?: Maybe<BigNumber>
  totalStaked: BigNumber
  totalRewards: BigNumber
  startBlock: BigNumber
  endBlock: BigNumber
  endTimestamp: number
  latestRewardBlock: BigNumber
  rewardPerPeriod: BigNumber
  rewardPerToken: BigNumber
  paidOut: BigNumber
  userInfo?: Maybe<PoolUserInfo>
  fetchTimestamp: number
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
  __typename: string
  id: string
  poolId: number
  account: string
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

export type PoolDialogState = {
  type: PoolDialogType
  open: boolean
}

export enum PoolDialogType {
  DEPOSIT = 0,
  WITHDRAW = 1,
  CLAIM = 2
}

export enum GlobalEvent {
  ConfirmTransactionDialog = 'ConfirmTransactionDialog',
  ConnectWalletDialog = 'ConnectWalletDialog',
  NetworkBlockHeightChanged = 'NetworkBlockHeightChanged',
  PoolFilterValuesChanged = 'PoolFilterValuesChanged',
  PoolDeposit = 'PoolDeposit',
  PoolWithdraw = 'PoolWithdraw',
  PoolUpdate = 'PoolUpdate'
}

export type VmLog = {
  event: string
  topic: string
  args: any
}

export enum VmLogEvent {
  PoolCreated = 'PoolCreated',
  Deposit = 'Deposit',
  Withdraw = 'Withdraw'
}