export class CoinUtil {
  private readonly _map: Map<string, string>

  constructor() {
    this._map = new Map<string, string>([
      ["https://static.vite.net/token-profile-1257137467/icon/e6dec7dfe46cb7f1c65342f511f0197c.png", "/assets/coins/vite.png"],
      ["https://static.vite.net/token-profile-1257137467/icon/5faa1fa2b952137081e36c51af2b493c.png", "/assets/coins/usdc.png"],
      ["https://static.vite.net/token-profile-1257137467/icon/3c231a8309999ad226afa097488a6158.png", "/assets/coins/dai.png"]
    ])
  }

  mapIconUrl(iconUrl?: Maybe<string>): string {
    if (!iconUrl) {
      return "";
    }
    const existing = this._map.get(iconUrl);
    return existing ?? iconUrl;
  }
}

const util = new CoinUtil();

export const getCoinUtil = (): CoinUtil => {
  return util;
}