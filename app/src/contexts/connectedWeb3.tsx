import React, { useCallback, useEffect, useState } from 'react';
import { Networks } from '../common/constants';
import { getNetworkManager } from '../common/network';
import { MainLoading } from '../features/main/components/loading';
import { getLogger } from '../util/logger';
import { Network } from '../util/types';
import { getWalletManager } from '../wallet';
import { getCommonContext } from './common';
import { useWeb3Context } from './web3';

const logger = getLogger()

export interface IConnectedWeb3Context {
  account?: string
  network?: Maybe<Network>
  logout: () => void
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
  const web3Context = useWeb3Context()
  const commonContext = getCommonContext()

  const { wallet, network } = web3Context

  useEffect(() => {
    if (!wallet) {
      const walletManager = getWalletManager()
      walletManager.initWallet()
    }
  }, [wallet])

  useEffect(() => {
    if (!network) {
      const networkManager = getNetworkManager()
      const networkId = Number(process.env.REACT_APP_DEFAULT_NETWORK ?? "2");
      networkManager.setNetwork(Networks.find(e => e.id === networkId))
      logger.info("Network:", networkManager.getNetwork())()
    }
  }, [network])

  const logout = useCallback(() => {
    const walletManager = getWalletManager()
    walletManager.removeWallet()
    window.location.reload()
  }, [])

  useEffect(() => {
    const value = {
      account: wallet?.active?.address,
      network,
      logout
    }

    logger.info('ConnectedWeb3.account', wallet?.active?.address)()

    const initAsync = async () => {
      if (network) {
        logger.info('Init ConnectedWeb3')()
        try {
          setConnection(null)
          await commonContext.initAsync(network)
          setConnection(value)
        } catch (error) {
          logger.error(error)();
        }
      }
    }
    initAsync()
    return () => {
      commonContext.dispose()
    }
  }, [wallet, network, logout, commonContext])

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