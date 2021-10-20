import BigNumber from "bignumber.js";
import { getViteClient, ViteClient } from "../clients/vite.client";
import { CommonConstants } from "../common/constants";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { getLogger } from "../util/logger";
import { Contract, Pool, PoolUserInfo } from "../util/types";
import { BaseDataSource } from "./base.datasource";

const logger = getLogger();

export class ViteDataSource extends BaseDataSource {
  private readonly _fileUtil: FileUtil;
  private readonly _client: ViteClient;
  private readonly _offchainMethods: Map<string, string> = new Map<string, string>();
  private _contract?: Contract;

  constructor(fileUtil: FileUtil = new BrowserFileUtil()) {
    super();
    this._fileUtil = fileUtil;
    this._client = getViteClient();
    logger.info("ViteDataSource loaded")();
  }

  protected async initAsyncProtected(): Promise<void> {
    const contract = await this._fileUtil.readFileAsync('./assets/contracts/vite_staking_pools.json');
    this._contract = JSON.parse(contract) as Contract;
    this._contract.address = CommonConstants.POOLS_CONTRACT_ADDRESS
    logger.info(`Contract ${this._contract?.contractName} loaded`)();
  }

  protected disposeProtected(): void {
    this._offchainMethods.clear();
  }

  private get contract(): Contract {
    if (this._contract?.address === undefined) {
      throw new Error("Contract is not defined.")
    } else {
      return this._contract
    }
  }

  async getBalanceAsync(_account: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getNetworkBlockHeightAsync(): Promise<BigNumber> {
    return this._client.requestAsync("ledger_getSnapshotChainHeight");
  }

  async getPoolAsync(_id: number, _account?: string): Promise<Pool> {
    const poolInfo = await this._client.callOffChainMethodAsync(this.contract.address, this.getOffchainMethodAbi("getPoolInfo"), this.contract.offChain, [_id]);
    throw new Error("Method not implemented.");
  }

  async getPoolsAsync(_account?: string): Promise<Pool[]> {
    const amount = await this.getTotalPoolsAsync();
    console.log('pool count:', amount);
    return [];
  }

  async getPoolUserInfoAsync(_poolId: number, _account?: string): Promise<Maybe<PoolUserInfo>> {
    return undefined;
  }

  async getTotalPoolsAsync(): Promise<number> {
    const result = await this._client.callOffChainMethodAsync(this.contract.address, this.getOffchainMethodAbi("getPoolCount"), this.contract.offChain, []);
    return Number(result[0].value);
  }

  async depositAsync(_id: number, _amount: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async withdrawAsync(_id: number, _amount: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  private getOffchainMethodAbi(name: string): any {
    let result: Maybe<any>
    if (this._offchainMethods.has(name)) {
      result = this._offchainMethods.get(name)
    } else {
      result = this.contract.abi.find(e => e.type === "offchain" && e.name === name)
      if (result) {
        this._offchainMethods.set(name, result)
      }
    }
    if (result) {
      return result
    } else {
      throw new Error(`The offchain method '${name}' does not exist.'`)
    }
  }
}

const ds = new ViteDataSource();

export const getViteDataSource = () => {
  return ds;
}