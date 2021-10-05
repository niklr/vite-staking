import { useCallback, useReducer } from 'react'
import { SessionWallet, WebWallet } from '../wallet'

interface Web3ManagerState {
  wallet?: Maybe<WebWallet | SessionWallet>
  onError?: (error: Error) => void
  error?: Error
}

enum ActionType {
  UPDATE,
  ERROR
}

interface Action {
  type: ActionType
  payload?: any
}

function reducer(state: Web3ManagerState, { type, payload }: Action): Web3ManagerState {
  switch (type) {
    case ActionType.UPDATE: {
      const { wallet } = payload
      return {
        ...state,
        ...({ wallet })
      }
    }
    case ActionType.ERROR: {
      const { error } = payload
      const { onError } = state
      return {
        error,
        onError
      }
    }
  }
}

export const useWeb3Manager = (initWallet?: Maybe<WebWallet | SessionWallet>) => {
  const [state, dispatch] = useReducer(reducer, {
    wallet: initWallet
  })

  const { wallet, error } = state

  const setWallet = useCallback((wallet?: Maybe<WebWallet | SessionWallet>): void => {
    dispatch({ type: ActionType.UPDATE, payload: { wallet } })
  }, [])

  const setError = useCallback((error: Error): void => {
    dispatch({ type: ActionType.ERROR, payload: { error } })
  }, [])

  return { setWallet, wallet, setError, error }
}