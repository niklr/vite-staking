import { Network } from "../util/types"

export const CommonConstants = {
  APP_NAME: 'VITE Staking Pools',
  WEB_WALLET_STORAGE_SPACE: 'VSP_WEB_WALLET',
  SESSION_WALLET_STORAGE_SPACE: 'VSP_SESSION_WALLET'
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