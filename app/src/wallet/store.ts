import { SessionWallet, Wallet, WebWallet } from '.';
import { CommonConstants } from '../common/constants';
import { getLogger } from '../util/logger';
import { WalletType } from './types';

const logger = getLogger()

export class WalletStore {

  private readonly _webWalletKey = CommonConstants.WEB_WALLET_STORAGE_SPACE;
  private readonly _sessionWalletKey = CommonConstants.SESSION_WALLET_STORAGE_SPACE

  clear(): void {
    localStorage.removeItem(this._webWalletKey);
    sessionStorage.removeItem(this._sessionWalletKey);
  }

  getItem(): Maybe<WebWallet | SessionWallet> {
    let data;

    try {
      data = localStorage.getItem(this._webWalletKey);
      if (!data) {
        data = sessionStorage.getItem(this._sessionWalletKey);
      }
    } catch (err) {
      logger.error(err)();
      return undefined;
    }

    if (!data) {
      return undefined;
    }

    try {
      return Wallet.fromJS(JSON.parse(data));
    } catch (err) {
      logger.error(err)();
      return undefined;
    }
  }

  setItem(data: WebWallet | SessionWallet): void {
    const saveData = JSON.stringify(data);

    try {
      switch (data.type) {
        case WalletType.Web:
          localStorage.setItem(this._webWalletKey, saveData);
          break;
        case WalletType.Session:
          sessionStorage.setItem(this._sessionWalletKey, saveData);
          break;
        default:
          throw new Error(`Wallet type '${data.type}' is not supported.`)
      }
    } catch (err) {
      logger.error(err)();
    }
  }
}