import BigNumber from "bignumber.js";
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

  constructor(fileUtil: FileUtil = new BrowserFileUtil()) {
    super();
    this._fileUtil = fileUtil;
    this._pools = [];
    this._users = [];
    logger.info("MockDataSource loaded")();
  }

  private async initPoolsAsync(): Promise<void> {
    let pools = await this._fileUtil.readFileAsync("./assets/data/mock_pool_info.json");
    pools = JSON.parse(pools);
    this._pools = [];
    for (let index = 0; index < pools.length; index++) {
      const p: ContractPool = pools[index];
      const stakingToken = await this.getTokenAsync(p.stakingTokenId);
      const rewardToken = await this.getTokenAsync(p.rewardTokenId);
      this._pools.push({
        id: index,
        stakingToken,
        rewardToken,
        apr: new BigNumber(20.126),
        totalStaked: new BigNumber(p.totalStakingBalance),
        totalRewards: new BigNumber(p.totalRewardBalance),
        startBlock: new BigNumber(p.startBlock),
        endBlock: new BigNumber(p.endBlock),
        endTimestamp: 0,
        latestRewardBlock: new BigNumber(p.latestRewardBlock),
        rewardPerPeriod: new BigNumber(p.rewardPerPeriod),
        rewardPerToken: new BigNumber(p.rewardPerToken),
        paidOut: new BigNumber(p.paidOut)
      })
    }
  }

  private async initPoolUsersAsync(): Promise<void> {
    let users = await this._fileUtil.readFileAsync("./assets/data/mock_user_info.json");
    users = JSON.parse(users);
    this._users = [];
    for (let index = 0; index < users.length; index++) {
      const u: ContractPoolUserInfo = users[index];
      this._users.push({
        poolId: u.poolId,
        address: u.address,
        stakingBalance: new BigNumber(u.stakingBalance),
        rewardDebt: new BigNumber(u.rewardDebt)
      })
    }
  }

  protected async initAsyncProtected(): Promise<void> {
    await this.initPoolsAsync();
    await this.initPoolUsersAsync();
  }

  getBalanceAsync(_address: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getPoolAsync(id: number): Promise<Pool> {
    await CommonUtil.timeout(CommonUtil.random(1000, 5000));
    return this._pools[id];
  }

  async getPoolUserInfoAsync(poolId: number, address: string): Promise<PoolUserInfo> {
    const existing = this._users.find(e => e.poolId === poolId && e.address.toLowerCase() === address.toLowerCase());
    if (existing) {
      return existing;
    }
    return {
      poolId,
      address,
      stakingBalance: new BigNumber(0),
      rewardDebt: new BigNumber(0)
    }
  }

  async getTotalPoolsAsync(): Promise<number> {
    return this._pools.length;
  }
}

const ds = new MockDataSource();

export const getMockDataSource = () => {
  return ds;
}