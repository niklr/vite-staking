import BigNumber from "bignumber.js";
import CoinGecko from "coingecko-api";
import { CoinUtil, getCoinUtil } from "../util/coin.util";
import { getLogger } from "../util/logger";

const logger = getLogger();

export class CoingeckoClient {
  private readonly _client: any;
  private readonly _coinUtil: CoinUtil;

  constructor() {
    this._client = new CoinGecko();
    this._coinUtil = getCoinUtil();
  }

  async getTokenPriceUSDAsync(name: string): Promise<BigNumber> {
    try {
      const mappedName = this._coinUtil.mapCoingeckoName(name);
      const params = { ids: mappedName };
      const result = await this._client.simple.price(params);
      return new BigNumber(result.data[mappedName].usd);
    } catch (error) {
      logger.error(error)();
      return new BigNumber(0);
    }
  }
}

const client = new CoingeckoClient();

export const getCoingeckoClient = () => {
  return client;
}