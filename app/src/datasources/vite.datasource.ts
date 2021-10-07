import BigNumber from "bignumber.js";
import { getViteClient, ViteClient } from "../clients/vite.client";
import { getLogger } from "../util/logger";
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

  getBalanceAsync(_address: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  getTotalPoolsAsync(): Promise<number> {
    throw new Error("Method not implemented.");
  }
}

const ds = new ViteDataSource();

export const getViteDataSource = () => {
  return ds;
}