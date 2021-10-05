import BigNumber from "bignumber.js";
import { getViteClient, ViteClient } from "../clients/vite.client";
import { BaseDataSource } from "./base.datasource";

export class ViteDataSource extends BaseDataSource {
  private readonly _client: ViteClient;

  constructor() {
    super();
    this._client = getViteClient();
  }

  getBalanceAsync(_address: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }
}