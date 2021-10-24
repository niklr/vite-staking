import { ApolloClient, FetchPolicy, NormalizedCacheObject } from "@apollo/client";
import BigNumber from "bignumber.js";
import { getApolloClient } from "../clients/apollo.client";
import { GET_ACCOUNT_BALANCE_QUERY } from "../queries";
import { GetAccountBalance, GetAccountBalanceVariables } from "../queries/__generated__/GetAccountBalance";
import { CommonUtil } from "../util/common.util";
import { getLogger } from "../util/logger";
import { getWalletManager, WalletManager } from "../wallet";

const logger = getLogger();

export class AccountService {
  private readonly _apollo: ApolloClient<NormalizedCacheObject>;
  private readonly _walletManager: WalletManager;

  constructor() {
    this._apollo = getApolloClient();
    this._walletManager = getWalletManager();
  }

  async getBalanceAsync(_account?: Maybe<string>, _fetchPolicy: FetchPolicy = "network-only"): Promise<BigNumber> {
    try {
      const account = _account ?? this._walletManager.getActiveAccount()?.address;
      if (!account || CommonUtil.isNullOrWhitespace(account)) {
        return new BigNumber(0);
      }
      const poolQuery = await this._apollo.query<GetAccountBalance, GetAccountBalanceVariables>({
        query: GET_ACCOUNT_BALANCE_QUERY,
        variables: {
          account
        },
        fetchPolicy: _fetchPolicy
      });
      const balance = poolQuery.data.accountBalance as unknown as BigNumber;
      return balance;
    } catch (error) {
      logger.error(error)();
      return new BigNumber(0);
    }
  }
}

const service = new AccountService();

export const getAccountService = () => {
  return service;
}