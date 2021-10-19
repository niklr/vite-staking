import { GenericType, Network, PoolFilterValues, PoolSortType, Token } from "../util/types"

export const CommonConstants = {
  APP_NAME: 'VITE Staking Pools',
  WEB_WALLET_STORAGE_SPACE: 'VSP_WEB_WALLET',
  SESSION_WALLET_STORAGE_SPACE: 'VSP_SESSION_WALLET',
  POOLS_CONTRACT_ADDRESS: 'vite_5b2fc567f4fe1b807307b4360a76f94266cbe702672dfc7257'
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