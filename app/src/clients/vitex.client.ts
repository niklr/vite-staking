import axios from 'axios';

type BaseResult<T> = {
  code: number,
  data: T
}

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
    const result = await axios.get<BaseResult<TokenDetailResult>>(this._baseUrl + "/api/v1/token/detail?tokenId=" + tokenId);
    return result.data.data;
  }
}

const client = new VitexClient();

export const getVitexClient = () => {
  return client;
}
