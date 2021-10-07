import BigNumber from "bignumber.js";
import { getVitexClient, VitexClient } from "../clients/vitex.client";
import { Ensure } from "../util/ensure";
import { getLogger } from "../util/logger";
import { Token } from "../util/types";
import { getWalletManager, WalletAccount, WalletManager } from "../wallet";

const logger = getLogger();

export interface IDataSource {
  getTokenAsync(id: string): Promise<Maybe<Token>>;
  getBalanceAsync(_address: string): Promise<BigNumber>;
}

export abstract class BaseDataSource implements IDataSource {
  private readonly _walletManager: WalletManager;
  private readonly _vitexClient: VitexClient;

  constructor() {
    this._walletManager = getWalletManager();
    this._vitexClient = getVitexClient();
  }

  async initAsync(): Promise<void> {
    await this.initAsyncProtected();
  }

  getAccount(): WalletAccount {
    const account = this._walletManager.getActiveAccount();
    Ensure.notNull(account, "account", "Please connect your wallet first.");
    return account as WalletAccount;
  }

  async getTokenAsync(id: string): Promise<Maybe<Token>> {
    try {
      const result = await this._vitexClient.getTokenDetailAsync(id);
      if (result) {
        return {
          id,
          name: result.name,
          symbol: result.symbol,
          originalSymbol: result.originalSymbol,
          decimals: result.tokenDecimals,
          iconUrl: result.urlIcon,
          url: "https://coinmarketcap.com/currencies/" + result.name
        }
      }
    } catch (error) {
      logger.error(error)();
    }
    return undefined;
  }

  protected abstract initAsyncProtected(): Promise<void>;

  abstract getBalanceAsync(_address: string): Promise<BigNumber>;
}