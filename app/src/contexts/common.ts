import { ViteClient } from "../clients/vite.client";
import { getLogger } from "../util/logger";
import { Network } from "../util/types";

const logger = getLogger()

export class CommonContext {
  private readonly _vite: ViteClient

  constructor() {
    this._vite = new ViteClient()
  }

  async initAsync(network: Network): Promise<void> {
    await this._vite.initAsync(network)
  }

  dispose(): void {
    logger.info("Disposing CommonContext")()
    this._vite.dispose()
  }

  get vite(): ViteClient {
    return this._vite;
  }
}

const context = new CommonContext();

export const getCommonContext = () => {
  return context
}