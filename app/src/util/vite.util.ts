import BigNumber from "bignumber.js";
import { Pool, PoolUserInfo } from "./types";

export abstract class ViteUtil {
  static calculateRewardTokens(pool: Maybe<Pool>, userInfo: Maybe<PoolUserInfo>): BigNumber {
    if (!pool || !userInfo) {
      return new BigNumber(0);
    }
    const stakingBalance = userInfo.stakingBalance.div(new BigNumber(10).pow(pool.stakingToken.decimals));
    const rewardPerToken = pool.rewardPerToken.div(new BigNumber(10).pow(pool.rewardToken.decimals));
    const rewardDebt = userInfo.rewardDebt.div(new BigNumber(10).pow(pool.rewardToken.decimals));
    // console.log('pool.id', pool.id, 'stakingBalance', stakingBalance.toString(), 'rewardPerToken', rewardPerToken.toString(), 'rewardDebt', rewardDebt.toString());
    return (stakingBalance.times(rewardPerToken).minus(rewardDebt)).times(new BigNumber(10).pow(pool.rewardToken.decimals));
  }

  static formatBigNumber(bn: BigNumber, tokenDecimals: number, decimals: number): string {
    return bn.div(new BigNumber(10).pow(tokenDecimals)).decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFormat();
  }
}