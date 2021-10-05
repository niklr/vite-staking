import React, { useState } from 'react';
import { getNetworkManager } from '../common/network';
import { Network } from '../util/types';
import { getWalletManager, SessionWallet, WebWallet } from '../wallet';

export interface IWeb3Context {
  setError: (error: Error) => void,
  error?: Maybe<Error>,
  wallet?: Maybe<WebWallet | SessionWallet>
  network?: Maybe<Network>
}

const Web3Context = React.createContext<Maybe<IWeb3Context>>(undefined)

export const useWeb3Context = () => {
  const context = React.useContext(Web3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

interface Props {
  children?: React.ReactNode
}

export const Web3Provider: React.FC<Props> = (props: Props) => {
  const [error, setError] = useState<Maybe<Error>>(null)
  const [wallet, setWallet] = useState<Maybe<WebWallet | SessionWallet>>(null)
  const [network, setNetwork] = useState<Maybe<Network>>(null)

  const walletManager = getWalletManager()
  walletManager.onSetWalletCallback = setWallet

  const networkManager = getNetworkManager()
  networkManager.onSetNetworkCallback = setNetwork

  const context: IWeb3Context = {
    setError,
    error,
    wallet,
    network
  }

  return (
    <Web3Context.Provider value={context}>{props.children}</Web3Context.Provider>
  )
}
