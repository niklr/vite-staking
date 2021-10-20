import { abi as abiutils, accountBlock, ViteAPI } from "@vite/vitejs";
import { getEmitter, IGlobalEmitter } from "../util/emitter.util";
import { getLogger } from "../util/logger";
import { Network } from "../util/types";
import { getWalletManager, IWalletConnector, SessionWalletAccount, WalletAccount, WalletConnectorFactory, WalletManager, WebWalletAccount } from "../wallet";
const { WS_RPC } = require('@vite/vitejs-ws');

const logger = getLogger();

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export class ViteClient {
  private _isConnected: boolean;
  private _connector?: IWalletConnector;
  private _provider?: any;
  private _client?: any;
  private readonly _emitter: IGlobalEmitter;
  private readonly _walletManager: WalletManager;
  private readonly _connectorFactory: WalletConnectorFactory;

  constructor() {
    this._isConnected = false;
    this._emitter = getEmitter();
    this._walletManager = getWalletManager();
    this._connectorFactory = new WalletConnectorFactory(this._walletManager);
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get connector(): IWalletConnector {
    if (!this._connector) {
      throw new Error("Wallet connector is not defined.");
    }
    return this._connector;
  }

  initAsync = async (network: Network) => new Promise<void>((resolve, reject) => {
    this._connector = this._connectorFactory.create(network)
    this._provider = new WS_RPC(network.rpcUrl, providerTimeout, providerOptions);
    let isResolved = false;
    this._provider.on('error', (err: any) => {
      logger.error(err)();
      if (isResolved) return;
      reject(err);
      this._isConnected = false;
    });
    this._client = new ViteAPI(this._provider, () => {
      logger.info(`ViteAPI connected to ${this._provider.path}`)();
      isResolved = true;
      resolve();
      this._isConnected = true;
    });
  });

  dispose(): void {
    logger.info("Disposing ViteClient")();
    this._provider?.disconnect();
    this._isConnected = false;
  }

  async requestAsync(method: string, ...args: any[]): Promise<any> {
    if (this._isConnected && this._client) {
      return this._client.request(method, ...args);
    } else {
      return Promise.reject('Vite client is not ready to make requests.');
    }
  }

  async callContractAsync(account: WalletAccount, methodName: string, abi: any, params: any, amount: string, toAddress: string): Promise<any> {
    let block = accountBlock
      .createAccountBlock("callContract", {
        address: account.address,
        abi,
        methodName,
        amount,
        toAddress,
        params,
      })

    if (account instanceof WebWalletAccount) {
      block = block.setProvider(this._client).setPrivateKey(account.privateKey);
      await block.autoSetPreviousAccountBlock();
      const result = await block.sign().send();
      return result;
    } else if (account instanceof SessionWalletAccount) {
      if (this.connector) {
        this._emitter.emitConfirmTransactionDialog(true);
        try {
          const result = await this.connector.sendTransactionAsync({
            block: block.accountBlock
          });
          this._emitter.emitConfirmTransactionDialog(false);
          return result;
        } catch (error) {
          this._emitter.emitConfirmTransactionDialog(false);
          throw error
        }
      } else {
        throw new Error("Connector is not defined");
      }
    } else {
      throw new Error("Account not supported");
    }
  }

  async callOffChainMethodAsync(contractAddress: string, abi: any, offchaincode: string, params: any): Promise<any> {
    let data = abiutils.encodeFunctionCall(abi, params);
    let dataBase64 = Buffer.from(data, "hex").toString("base64");
    let result = await this.requestAsync("contract_callOffChainMethod", {
      selfAddr: contractAddress,
      offChainCode: offchaincode,
      data: dataBase64,
    });
    if (result) {
      let resultBytes = Buffer.from(result, "base64").toString("hex");
      let outputs = [];
      for (let i = 0; i < abi.outputs.length; i++) {
        outputs.push(abi.outputs[i].type);
      }
      let offchainDecodeResult = abiutils.decodeParameters(outputs, resultBytes);
      let resultList = [];
      if (offchainDecodeResult) {
        for (let i = 0; i < abi.outputs.length; i++) {
          if (abi.outputs[i].name) {
            resultList.push({
              name: abi.outputs[i].name,
              value: offchainDecodeResult[i],
            });
          } else {
            resultList.push({
              name: "",
              value: offchainDecodeResult[i],
            });
          }
        }
      }
      return resultList;
    }
    return "";
  }
}

const client = new ViteClient();

export const getViteClient = () => {
  return client;
}