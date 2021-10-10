import { ViteClient } from "../clients/vite.client";
import { getMockDataSource, getViteDataSource, IDataSource } from "../datasources";
import { getLogger } from "../util/logger";
import { Network } from "../util/types";

const logger = getLogger();

export class CommonContext {
  private readonly _vite: ViteClient;
  private _datasource: IDataSource;

  constructor() {
    this._vite = new ViteClient();
    this._datasource = getMockDataSource();
  }

  async initAsync(network: Network): Promise<void> {
    switch (network.id) {
      case 3:
        this._datasource = getMockDataSource();
        break;
      default:
        this._datasource = getViteDataSource();
        break;
    }
    await this._datasource.initAsync();
    await this._vite.initAsync(network);
  }

  dispose(): void {
    logger.info("Disposing CommonContext")();
    this._datasource.dispose();
    this._vite.dispose();
  }

  get vite(): ViteClient {
    return this._vite;
  }

  get datasource(): IDataSource {
    return this._datasource;
  }
}

const context = new CommonContext();

export const getCommonContext = () => {
  return context;
}