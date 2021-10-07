import BigNumber from "bignumber.js";
import { Ensure } from "../util/ensure";
import { getWalletManager, WalletAccount, WalletManager } from "../wallet";

export interface IDataSource {
  getBalanceAsync(_address: string): Promise<BigNumber>;
}

export abstract class BaseDataSource implements IDataSource {
  private readonly _walletManager: WalletManager;

  constructor() {
    this._walletManager = getWalletManager();
  }

  getAccount(): WalletAccount {
    const account = this._walletManager.getActiveAccount();
    Ensure.notNull(account, "account", "Please connect your wallet first.");
    return account as WalletAccount;
  }

  async initAsync(): Promise<void> {
    await this.initAsyncProtected();
  }

  protected abstract initAsyncProtected(): Promise<void>;

  abstract getBalanceAsync(_address: string): Promise<BigNumber>;
}