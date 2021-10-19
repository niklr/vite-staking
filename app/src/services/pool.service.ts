import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import { getApolloClient } from "../clients/apollo.client";
import { CommonConstants } from "../common/constants";
import { DEPOSIT_MUTATION, WITHDRAW_MUTATION } from "../mutations";
import { Deposit, DepositVariables } from "../mutations/__generated__/Deposit";
import { Withdraw, WithdrawVariables } from "../mutations/__generated__/Withdraw";
import { GET_POOL_QUERY, GET_POOL_USER_INFO_QUERY } from "../queries";
import { GetPool, GetPoolVariables } from "../queries/__generated__/GetPool";
import { GetPoolUserInfo, GetPoolUserInfoVariables } from "../queries/__generated__/GetPoolUserInfo";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { getLogger } from "../util/logger";
import { Contract, Pool } from "../util/types";
import { getWalletManager, WalletManager } from "../wallet";

const logger = getLogger();

export class PoolService {
  private readonly _fileUtil: FileUtil;
  private readonly _walletManager: WalletManager;
  private _contract?: Contract;

  constructor(fileUtil: FileUtil = new BrowserFileUtil()) {
    this._fileUtil = fileUtil;
    this._walletManager = getWalletManager();
  }

  private get _apollo(): ApolloClient<NormalizedCacheObject> {
    return getApolloClient();
  }

  async initAsync(): Promise<void> {
    const contract = await this._fileUtil.readFileAsync('./assets/contracts/vite_staking_pools.json');
    this._contract = JSON.parse(contract) as Contract;
    this._contract.address = CommonConstants.POOLS_CONTRACT_ADDRESS
    logger.info(`Contract ${this._contract?.contractName} loaded`)();
  }

  dispose(): void {
    logger.info("Disposing PoolService")();
  }

  async getAsync(id: number, fetchPolicy: FetchPolicy = "network-only"): Promise<Maybe<Pool>> {
    try {
      const poolQuery = await this._apollo.query<GetPool, GetPoolVariables>({
        query: GET_POOL_QUERY,
        variables: {
          id: id.toString()
        },
        fetchPolicy
      });
      const userInfoQuery = await this._apollo.query<GetPoolUserInfo, GetPoolUserInfoVariables>({
        query: GET_POOL_USER_INFO_QUERY,
        variables: {
          poolId: id,
          account: this._walletManager.getActiveAccount()?.address
        },
        fetchPolicy
      });
      const pool = poolQuery.data.pool as unknown as Pool;
      return {
        ...pool,
        userInfo: userInfoQuery.data.poolUserInfo
      }
    } catch (error) {
      logger.error(error)();
    }
  }

  async depositAsync(id: number, amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Deposit, DepositVariables>({
      mutation: DEPOSIT_MUTATION,
      variables: {
        id: id.toString(),
        amount
      }
    });
    return Boolean(result.data?.deposit ?? false);
  }

  async withdrawAsync(id: number, amount: string): Promise<boolean> {
    const result = await this._apollo.mutate<Withdraw, WithdrawVariables>({
      mutation: WITHDRAW_MUTATION,
      variables: {
        id: id.toString(),
        amount
      }
    });
    return Boolean(result.data?.withdraw ?? false);
  }
}

const service = new PoolService();

export const getPoolService = () => {
  return service;
}