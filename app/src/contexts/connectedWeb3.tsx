import React, { useEffect, useState } from 'react';
import { MainLoading } from '../features/main/components/loading';
import { WalletManager } from '../wallet';
import { useWeb3Context } from './web3';

export interface IConnectedWeb3Context {
  account?: string
  walletManager: WalletManager
}

const ConnectedWeb3Context = React.createContext<Maybe<IConnectedWeb3Context>>(undefined)

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

interface Props {
  children?: React.ReactNode
}

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC<Props> = (props: Props) => {
  const [connection, setConnection] = useState<IConnectedWeb3Context | null>(null)
  const context = useWeb3Context()

  const { walletManager } = context

  const wallet = walletManager.getWallet()

  useEffect(() => {
    const value = {
      account: wallet?.active?.address,
      walletManager
    }

    console.log('ConnectedWeb3.account', wallet?.active?.address)

    const initAsync = async () => {
      console.log('ConnectedWeb3.initAsync')
      setConnection(value)
    }
    initAsync()
    return () => {
      // provider.dispose()
    }
  }, [wallet, walletManager])

  if (!connection) {
    return MainLoading()
  }

  const value = {
    ...connection
  }

  return (
    <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
  )
}