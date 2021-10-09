import BigNumber from "bignumber.js";
import { getVitexClient, VitexClient } from "../clients/vitex.client";
import { UnknownToken } from "../common/constants";
import { Ensure } from "../util/ensure";
import { getLogger } from "../util/logger";
import { Pool, PoolUserInfo, Token } from "../util/types";
import { getWalletManager, WalletAccount, WalletManager } from "../wallet";

const logger = getLogger();

export interface IDataSource {
  initAsync(): Promise<void>;
  getBalanceAsync(_address: string): Promise<BigNumber>;
  getPoolAsync(id: number): Promise<Pool>;
  getPoolUserInfoAsync(poolId: number, address: string): Promise<PoolUserInfo>;
  getTokenAsync(id: string): Promise<Token>;
  getTotalPoolsAsync(): Promise<number>;
}

export abstract class BaseDataSource implements IDataSource {
  private readonly _walletManager: WalletManager;
  private readonly _vitexClient: VitexClient;
  private readonly _tokens: Map<string, Token>;

  constructor() {
    this._walletManager = getWalletManager();
    this._vitexClient = getVitexClient();
    this._tokens = new Map<string, Token>();
  }

  async initAsync(): Promise<void> {
    logger.info("BaseDataSource.initAsync")();
    await this.initAsyncProtected();
  }

  getAccount(): WalletAccount {
    const account = this._walletManager.getActiveAccount();
    Ensure.notNull(account, "account", "Please connect your wallet first.");
    return account as WalletAccount;
  }

  async getTokenAsync(id: string): Promise<Token> {
    try {
      const existing = this._tokens.get(id);
      if (existing) {
        return existing;
      }
      const result = await this._vitexClient.getTokenDetailAsync(id);
      if (result) {
        const token = {
          id,
          name: result.name,
          symbol: result.symbol,
          originalSymbol: result.originalSymbol,
          decimals: result.tokenDecimals,
          iconUrl: result.urlIcon,
          url: "https://coinmarketcap.com/currencies/" + result.name.replace(" ", "-")
        }
        this._tokens.set(id, token);
        return token;
      }
    } catch (error) {
      logger.error(error)();
    }
    const unknownToken = {
      ...UnknownToken,
      id
    }
    this._tokens.set(id, unknownToken);
    return unknownToken;
  }

  protected abstract initAsyncProtected(): Promise<void>;

  abstract getBalanceAsync(_address: string): Promise<BigNumber>;

  abstract getPoolAsync(id: number): Promise<Pool>;

  abstract getPoolUserInfoAsync(poolId: number, address: string): Promise<PoolUserInfo>;

  abstract getTotalPoolsAsync(): Promise<number>;
}