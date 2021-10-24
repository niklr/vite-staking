import BigNumber from "bignumber.js";
import { CommonConstants } from "../common/constants";
import { Pool } from "./types";

export abstract class ViteUtil {
  static calculateRewardTokens(pool: Maybe<Pool>): BigNumber {
    if (!pool?.userInfo) {
      return new BigNumber(0);
    }
    return (pool.userInfo.stakingBalance.times(pool.rewardPerToken).div(CommonConstants.REWARD_FACTOR).minus(pool.userInfo.rewardDebt));
  }

  static formatBigNumber(bn: BigNumber, tokenDecimals: number, decimals: number): string {
    return bn.div(new BigNumber(10).pow(tokenDecimals)).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFormat();
  }
}