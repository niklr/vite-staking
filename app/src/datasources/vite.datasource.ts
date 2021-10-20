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
  }

  async getBalanceAsync(_account: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getNetworkBlockHeightAsync(): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getPoolAsync(_id: number, _account?: string): Promise<Pool> {
    throw new Error("Method not implemented.");
  }

  async getPoolsAsync(_account?: string): Promise<Pool[]> {
    throw new Error("Method not implemented.");
  }

  async getPoolUserInfoAsync(_poolId: number, _account?: string): Promise<Maybe<PoolUserInfo>> {
    throw new Error("Method not implemented.");
  }

  async getTotalPoolsAsync(): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async depositAsync(_id: number, _amount: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async withdrawAsync(_id: number, _amount: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

const ds = new ViteDataSource();

export const getViteDataSource = () => {
  return ds;
}