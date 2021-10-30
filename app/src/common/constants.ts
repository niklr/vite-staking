import { GenericType, Network, PoolFilterValues, PoolSortType, Token } from "../util/types"

export const CommonConstants = {
  APP_NAME: 'VITE Staking Pools',
  WEB_WALLET_STORAGE_SPACE: 'VSP_WEB_WALLET',
  SESSION_WALLET_STORAGE_SPACE: 'VSP_SESSION_WALLET',
  POOLS_CONTRACT_ADDRESS: 'vite_901762159a2e39b79dc23c8a498fcd8c5a7b359ea616f00993',
  VITE_TOKEN_ID: 'tti_5649544520544f4b454e6e40',
  REWARD_FACTOR: 1e36 // 10^36 = new BigNumber(10).pow(36)
}

export const Networks: Network[] = [
  {
    id: 1,
    networkId: 1,
    name: 'MAINNET',
    rpcUrl: 'wss://node.vite.net/gvite/ws',
    connectorUrl: 'wss://biforst.vite.net'
  },
  {
    id: 2,
    networkId: 2,
    name: 'TESTNET',
    rpcUrl: 'wss://buidl.vite.net/gvite/ws', // https://buidl.vite.net/gvite
    connectorUrl: 'wss://biforst.vite.net'
  },
  {
    id: 3,
    networkId: 2,
    name: 'TESTNET+MOCK',
    rpcUrl: 'wss://buidl.vite.net/gvite/ws',
    connectorUrl: 'wss://biforst.vite.net'
  },
  {
    id: 4,
    networkId: 5,
    name: 'DEBUG',
    rpcUrl: 'ws://localhost:23457',
    connectorUrl: 'wss://biforst.vite.net'
  }
]

export const TypeNames = {
  Pool: "Pool",
  PoolUserInfo: "PoolUserInfo",
  Token: "Token"
}

export const UnknownToken: Token = {
  __typename: TypeNames.Token,
  id: "-1",
  name: "UNKNOWN",
  symbol: "UNKNOWN",
  originalSymbol: "UNKNOWN",
  decimals: 0,
  iconUrl: undefined,
  url: undefined
}

export const PoolSortTypes: GenericType[] = [
  {
    name: "",
    type: "DEFAULT"
  },
  {
    name: "APR",
    type: "APR"
  },
  {
    name: "Total staked",
    type: "TOTAL_STAKED"
  }
]

export const DefaultPoolFilterValues: PoolFilterValues = {
  stakedOnly: false,
  showLive: true,
  sortBy: PoolSortTypes[PoolSortType.DEFAULT].type,
  search: ""
}