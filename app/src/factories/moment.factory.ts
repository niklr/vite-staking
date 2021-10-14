import { MomentUtil } from "../util/moment.util";

export class MomentFactory {
  private readonly _map: Map<string, MomentUtil>

  constructor() {
    this._map = new Map<string, MomentUtil>();
  }

  create(locale?: Maybe<string>): MomentUtil {
    const _locale = locale ?? navigator.language;
    let util = this._map.get(_locale);
    if (!util) {
      util = new MomentUtil(_locale);
      this._map.set(_locale, util);
    }
    return util;
  }
}

const factory = new MomentFactory();

export const getMomentFactory = (): MomentFactory => {
  return factory;
}