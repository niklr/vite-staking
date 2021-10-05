import { ViteAPI } from "@vite/vitejs";
import { Network } from "../util/types";
import { getWalletManager, IWalletConnector, WalletConnectorFactory, WalletManager } from "../wallet";
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export class ViteClient {
  private _isConnected: boolean;
  private _connector?: IWalletConnector;
  private _provider?: any;
  private _client?: any;
  private readonly _walletManager: WalletManager;
  private readonly _connectorFactory: WalletConnectorFactory;

  constructor() {
    this._isConnected = false;
    this._walletManager = getWalletManager();
    this._connectorFactory = new WalletConnectorFactory(this._walletManager);
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get connector(): Maybe<IWalletConnector> {
    return this._connector;
  }

  initAsync = async (network: Network) => new Promise<void>((resolve, reject) => {
    this._connector = this._connectorFactory.create(network)
    this._provider = new WS_RPC(network.rpcUrl, providerTimeout, providerOptions);
    let isResolved = false;
    this._provider.on('error', (err: any) => {
      console.log(err);
      if (isResolved) return;
      reject(err);
      this._isConnected = false;
    });
    this._client = new ViteAPI(this._provider, () => {
      console.log(`ViteAPI connected to ${this._provider.path}`);
      isResolved = true;
      resolve();
      this._isConnected = true;
    });
  });

  dispose(): void {
    console.log("Disposing ViteClient");
    this._provider?.disconnect();
    this._isConnected = false;
  }
}

const client = new ViteClient();

export const getViteClient = () => {
  return client;
}