export class CoinUtil {
  private readonly _iconUrlMap: Map<string, string>;
  private readonly _coinMarketCapMap: Map<string, string>;
  private readonly _coingeckoMap: Map<string, string>;

  constructor() {
    this._iconUrlMap = new Map<string, string>([
      ["https://static.vite.net/token-profile-1257137467/icon/e6dec7dfe46cb7f1c65342f511f0197c.png", "./assets/coins/vite.png"],
      ["https://static.vite.net/token-profile-1257137467/icon/5faa1fa2b952137081e36c51af2b493c.png", "./assets/coins/usdc.png"],
      ["https://static.vite.net/token-profile-1257137467/icon/3c231a8309999ad226afa097488a6158.png", "./assets/coins/dai.png"]
    ]);
    this._coinMarketCapMap = new Map<string, string>();
    this._coingeckoMap = new Map<string, string>();
  }

  mapIconUrl(iconUrl?: Maybe<string>): string {
    if (!iconUrl) {
      return "";
    }
    const existing = this._iconUrlMap.get(iconUrl);
    return existing ?? iconUrl;
  }

  mapCoinMarketCapName(name: string): string {
    const existing = this._coinMarketCapMap.get(name);
    return existing ?? name.replace(" ", "-").toLowerCase();
  }

  mapCoingeckoName(name: string): string {
    const existing = this._coingeckoMap.get(name);
    return existing ?? name.replace(" ", "-").toLowerCase();
  }
}

const util = new CoinUtil();

export const getCoinUtil = (): CoinUtil => {
  return util;
}