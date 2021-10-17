import BigNumber from "bignumber.js";
import { getViteClient, ViteClient } from "../clients/vite.client";
import { getLogger } from "../util/logger";
import { Pool, PoolUserInfo } from "../util/types";
import { BaseDataSource } from "./base.datasource";

const logger = getLogger();

export class ViteDataSource extends BaseDataSource {
  private readonly _client: ViteClient;

  constructor() {
    super();
    this._client = getViteClient();
    logger.info("ViteDataSource loaded")();
  }

  protected async initAsyncProtected(): Promise<void> {
    await Promise.resolve();
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