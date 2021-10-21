import { orderBy, partition } from "lodash";
import { PoolSortTypes } from "../common/constants";
import { getMomentFactory } from "../factories/moment.factory";
import { Pool, PoolFilterValues, PoolSortType } from "./types";

export abstract class FilterUtil {
  static filterPools(filter: PoolFilterValues, pools?: Maybe<Pool[]>): Maybe<Pool[]> {
    if (!pools) {
      return pools;
    }
    const moment = getMomentFactory().create();
    const [closedPools, openPools] = partition(pools, (pool) => pool.endTimestamp >= 0 && moment.get().unix() >= pool.endTimestamp);
    let filtered: Pool[] = openPools;
    if (filter.showLive) {
      if (filter.stakedOnly) {
        filtered = openPools.filter(e => !!e.userInfo && e.userInfo.stakingBalance.gt(0));
      } else {
        filtered = openPools;
      }
    } else {
      if (filter.stakedOnly) {
        filtered = closedPools.filter(e => !!e.userInfo && e.userInfo.stakingBalance.gt(0));
      } else {
        filtered = closedPools;
      }
    }
    const sorted = FilterUtil.sortPools(filter.sortBy, filtered);
    return FilterUtil.searchPools(filter.search, sorted);
  }

  static sortPools(sortBy: string, pools?: Maybe<Pool[]>): Maybe<Pool[]> {
    if (!pools || !sortBy) {
      return pools;
    }
    switch (sortBy) {
      case PoolSortTypes[PoolSortType.APR].type:
        return orderBy(
          pools,
          (pool: Pool) => pool.apr?.toNumber() ?? 0,
          'desc',
        )
      case PoolSortTypes[PoolSortType.TOTAL_STAKED].type:
        return orderBy(
          pools,
          (pool: Pool) => pool.totalStaked.toNumber(),
          'desc',
        )
      case PoolSortTypes[PoolSortType.DEFAULT].type:
      default:
        return pools;
    }
  }

  static searchPools(term: string, pools?: Maybe<Pool[]>): Maybe<Pool[]> {
    if (!pools || !term) {
      return pools;
    }
    const lowerCaseTerm = term.toLowerCase();
    return pools.filter((pool: Pool) =>
      pool.rewardToken.originalSymbol.toLowerCase().includes(lowerCaseTerm) || pool.stakingToken.originalSymbol.toLowerCase().includes(lowerCaseTerm)
    );
  }
}