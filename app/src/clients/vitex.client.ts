import axios from 'axios';
import { getLogger } from '../util/logger';

const logger = getLogger();

export type TokenDetailResult = {
  name: string
  symbol: string
  originalSymbol: string
  tokenDecimals: number
  urlIcon: string
}

export class VitexClient {
  private readonly _baseUrl: string;

  constructor() {
    this._baseUrl = "https://vitex.vite.net"
  }

  async getTokenDetailAsync(tokenId: string): Promise<Maybe<TokenDetailResult>> {
    try {
      const result = await axios.get<TokenDetailResult>(this._baseUrl + "/api/v1/token/detail?tokenId=" + tokenId);
      return result.data;
      // return {
      //   name: result.data.name,
      //   symbol: result.data.symbol,
      //   originalSymbol: result.data.originalSymbol,
      //   tokenDecimals: result.data.tokenDecimals,
      //   urlIcon: result.data.urlIcon
      // }
    } catch (error) {
      logger.error(error)
    }
    return undefined;
  }
}

const client = new VitexClient();

export const getVitexClient = () => {
  return client;
}
