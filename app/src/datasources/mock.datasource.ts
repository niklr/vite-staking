import BigNumber from "bignumber.js";
import { CommonConstants } from "../common/constants";
import { CommonUtil } from "../util/common.util";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { getLogger } from "../util/logger";
import { ContractPool, ContractPoolUserInfo, Pool, PoolUserInfo } from "../util/types";
import { BaseDataSource } from "./base.datasource";

const logger = getLogger();

export class MockDataSource extends BaseDataSource {
  private readonly _fileUtil: FileUtil;
  private _pools: Pool[];
  private _users: PoolUserInfo[];
  private _networkBlockHeight: BigNumber;
  private _networkBlockHeightInterval?: NodeJS.Timeout;

  constructor(fileUtil: FileUtil = new BrowserFileUtil()) {
    super();
    this._fileUtil = fileUtil;
    this._pools = [];
    this._users = [];
    this._networkBlockHeight = new BigNumber(0);
    logger.info("MockDataSource loaded")();
  }

  private initNetworkBlockHeight() {
    this._networkBlockHeight = new BigNumber(0);
    this._networkBlockHeightInterval = setInterval(() => {
      this._networkBlockHeight = this._networkBlockHeight.plus(1);
      // console.log(this._networkBlockHeight.toString())
    }, 1000);
  }

  private async initPoolsAsync(): Promise<void> {
    let pools = await this._fileUtil.readFileAsync("./assets/data/mock_pool_info.json");
    pools = JSON.parse(pools);
    this._pools = [];
    for (let index = 0; index < pools.length; index++) {
      const p: ContractPool = pools[index];
      const pool = await this.toPoolAsync(index, p);
      pool.apr = await this.getAprAsync(pool);
      this._pools.push(pool);
    }
  }

  async getAprAsync(pool: Pool): Promise<Maybe<BigNumber>> {
    switch (pool.id) {
      case 0:
        return new BigNumber(2.12345678)
      case 1:
        return new BigNumber(3.55555555)
      default:
        return super.getAprAsync(pool)
    };
  }

  private async initPoolUsersAsync(): Promise<void> {
    let users = await this._fileUtil.readFileAsync("./assets/data/mock_user_info.json");
    users = JSON.parse(users);
    this._users = [];
    for (let index = 0; index < users.length; index++) {
      const u: ContractPoolUserInfo = users[index];
      const info = await this.toPoolUserInfoAsync(u);
      this._users.push(info);
    }
  }

  protected async initAsyncProtected(): Promise<void> {
    logger.info("MockDataSource initAsyncProtected")();
    this.initNetworkBlockHeight();
    await this.initPoolsAsync();
    await this.initPoolUsersAsync();
  }

  protected disposeProtected(): void {
    if (this._networkBlockHeightInterval) {
      clearInterval(this._networkBlockHeightInterval);
    }
  }

  async getAccountBalanceAsync(_account: string): Promise<BigNumber> {
    return new BigNumber(0);
  }

  async getNetworkBlockHeightAsync(): Promise<BigNumber> {
    return this._networkBlockHeight;
  }

  async getPoolAsync(_id: number, _account?: Maybe<string>): Promise<Pool> {
    await CommonUtil.timeout(CommonUtil.random(100, 500));
    const pool = this._pools[_id];
    if (!_account) {
      return pool;
    }
    return {
      ...pool,
      userInfo: await this.getPoolUserInfoAsync(_id, _account)
    }
  }

  async getPoolsAsync(_account?: Maybe<string>): Promise<Pool[]> {
    await CommonUtil.timeout(1000);
    if (!_account) {
      return this._pools;
    }
    const pools = [];
    for (const p of this._pools) {
      pools.push(await this.getPoolAsync(p.id, _account))
    }
    return pools;
  }

  async getPoolUserInfoAsync(_poolId: number, _account?: Maybe<string>): Promise<Maybe<PoolUserInfo>> {
    if (CommonUtil.isNullOrWhitespace(_account)) {
      return undefined;
    }
    return this._users.find(e => e.poolId === _poolId && e.account.toLowerCase() === _account?.toLowerCase());
  }

  async getTotalPoolsAsync(): Promise<number> {
    return this._pools.length;
  }

  private async _updatePoolAsync(pool: Pool): Promise<void> {
    const blockNumber = await this.getNetworkBlockHeightAsync();
    const latestBlock = blockNumber < pool.endBlock ? blockNumber : pool.endBlock;

    // rewardPerToken is global, so we only want to update once per timestamp/block.
    // latestRewardBlock initially set to startBlock, so no updates before that.
    if (latestBlock <= pool.latestRewardBlock) {
      return;
    }

    // if staking balance is 0 over a period, the rewardPerToken should not increase.
    if (pool.totalStaked.eq(0)) {
      pool.latestRewardBlock = latestBlock;
      return;
    }

    // increase rewardPerToken by reward amount over period since previous reward block.
    const period = latestBlock.minus(pool.latestRewardBlock);
    const latestReward = pool.rewardPerPeriod.times(period).times(CommonConstants.REWARD_FACTOR).div(pool.totalStaked);
    pool.rewardPerToken = pool.rewardPerToken.plus(latestReward);

    pool.latestRewardBlock = latestBlock;
  }

  async depositAsync(_id: number, _tokenId: string, _amount: string): Promise<boolean> {
    await CommonUtil.timeout(1000);
    const pool = this._pools[_id];
    await this._updatePoolAsync(pool);

    const amount = new BigNumber(_amount);
    const account = this.getAccount().address;
    let userInfo = await this.getPoolUserInfoAsync(_id, account);
    if (userInfo) {
      // dispense rewards
      if (userInfo.stakingBalance.gt(0)) {
        const pendingAmount = userInfo.stakingBalance.times(pool.rewardPerToken).div(CommonConstants.REWARD_FACTOR).minus(userInfo.rewardDebt);
        pool.paidOut = pool.paidOut.plus(pendingAmount);
      }
      // update balances & recompute rewardDebt
      userInfo.stakingBalance = userInfo.stakingBalance.plus(amount);
      userInfo.rewardDebt = userInfo.stakingBalance.times(pool.rewardPerToken).div(CommonConstants.REWARD_FACTOR);
    } else {
      userInfo = await this.toPoolUserInfoAsync({
        poolId: _id,
        address: account,
        stakingBalance: amount.toString(),
        rewardDebt: "0"
      });
      this._users.push(userInfo);
    }
    pool.totalStaked = pool.totalStaked.plus(amount);
    this._emitter.emitPoolDeposit(_id, new BigNumber(_amount), account);
    return true;
  }

  async withdrawAsync(_id: number, _amount: string): Promise<boolean> {
    await CommonUtil.timeout(1000);
    const pool = this._pools[_id];
    await this._updatePoolAsync(pool);

    const amount = new BigNumber(_amount);
    const account = this.getAccount().address;
    const userInfo = await this.getPoolUserInfoAsync(_id, account);
    if (!userInfo) {
      throw new Error("Withdraw not possible")
    }
    if (userInfo.stakingBalance.lte(0) || amount.gt(userInfo.stakingBalance)) {
      throw new Error("Insufficient balance")
    }

    // dispense rewards
    const pendingAmount = userInfo.stakingBalance.times(pool.rewardPerToken).div(CommonConstants.REWARD_FACTOR).minus(userInfo.rewardDebt);
    pool.paidOut = pool.paidOut.plus(pendingAmount);

    // update balances & recompute rewardDebt
    userInfo.stakingBalance = userInfo.stakingBalance.minus(amount);
    pool.totalStaked = pool.totalStaked.minus(amount);
    userInfo.rewardDebt = userInfo.stakingBalance.times(pool.rewardPerToken).div(CommonConstants.REWARD_FACTOR);

    this._emitter.emitPoolWithdraw(_id, new BigNumber(_amount), account);
    return true;
  }
}

const ds = new MockDataSource();

export const getMockDataSource = () => {
  return ds;
}