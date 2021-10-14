import { partition } from "lodash";
import { getMomentFactory } from "../factories/moment.factory";
import { Pool, PoolFilterValues } from "./types";

export abstract class FilterUtil {
  static filterPools(filter: PoolFilterValues, pools?: Maybe<Pool[]>): Maybe<Pool[]> {
    if (!pools) {
      return pools;
    }
    const moment = getMomentFactory().create();
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