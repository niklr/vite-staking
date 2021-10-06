import { ViteClient } from "../clients/vite.client";
import { IDataSource, ViteDataSource } from "../datasources";
import { MockDataSource } from "../datasources/mock.datasource";
import { getLogger } from "../util/logger";
import { Network } from "../util/types";

const logger = getLogger();

export class CommonContext {
  private readonly _vite: ViteClient;
  private _datasource: IDataSource;

  constructor() {
    this._vite = new ViteClient();
    this._datasource = new MockDataSource();
  }

  async initAsync(network: Network): Promise<void> {
    switch (network.id) {
      case 3:
        this._datasource = new MockDataSource();
        break;
      default:
        this._datasource = new ViteDataSource();
        break;
    }
    await this._vite.initAsync(network);
  }

  dispose(): void {
    logger.info("Disposing CommonContext")();
    this._vite.dispose();
  }

  get vite(): ViteClient {
    return this._vite;
  }
}

const context = new CommonContext();

export const getCommonContext = () => {
  return context;
}