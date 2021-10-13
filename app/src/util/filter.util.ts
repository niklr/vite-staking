import { partition } from "lodash";
import { MomentUtil } from "./moment.util";
import { Pool, PoolFilterValues } from "./types";

export abstract class FilterUtil {
  static filterPools(filter: PoolFilterValues, pools?: Maybe<Pool[]>): Maybe<Pool[]> {
    if (!pools) {
      return pools;
    }
    // TODO: refactor
    const moment = new MomentUtil();
    const [closedPools, openPools] = partition(pools, (pool) => pool.endTimestamp > 0 && moment.get().unix() >= pool.endTimestamp);
    let refPools: Pool[] = openPools;
    if (filter.showLive) {
      if (filter.stakedOnly) {
        refPools = openPools.filter(e => !!e.userInfo);
      } else {
        refPools = openPools;
      }
    } else {
      if (filter.stakedOnly) {
        refPools = closedPools.filter(e => !!e.userInfo);
      } else {
        refPools = closedPools;
      }
    }
    return refPools;
  }
}