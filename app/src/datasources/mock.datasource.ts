import BigNumber from "bignumber.js";
import { TypeNames } from "../common/constants";
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
      const stakingToken = await this.getTokenAsync(p.stakingTokenId);
      const rewardToken = await this.getTokenAsync(p.rewardTokenId);
      this._pools.push({
        __typename: TypeNames.Pool,
        id: index,
        stakingToken,
        rewardToken,
        apr: this.getApr(index),
        totalStaked: new BigNumber(p.totalStakingBalance),
        totalRewards: new BigNumber(p.totalRewardBalance),
        startBlock: new BigNumber(p.startBlock),
        endBlock: new BigNumber(p.endBlock),
        endTimestamp: await this.getEndTimestampAsync(new BigNumber(p.endBlock)),
        latestRewardBlock: new BigNumber(p.latestRewardBlock),
        rewardPerPeriod: new BigNumber(p.rewardPerPeriod),
        rewardPerToken: new BigNumber(p.rewardPerToken),
        paidOut: new BigNumber(p.paidOut)
      })
    }
  }

  private getApr(poolId: number): BigNumber {
    switch (poolId) {
      case 0:
        return new BigNumber(2.12345678)
      case 1:
        return new BigNumber(3.55555555)
      default:
        return new BigNumber(0)
    }
  }

  private async initPoolUsersAsync(): Promise<void> {
    let users = await this._fileUtil.readFileAsync("./assets/data/mock_user_info.json");
    users = JSON.parse(users);
    this._users = [];
    for (let index = 0; index < users.length; index++) {
      const u: ContractPoolUserInfo = users[index];
      this._users.push({
        __typename: TypeNames.PoolUserInfo,
        poolId: u.poolId,
        address: u.address,
        stakingBalance: new BigNumber(u.stakingBalance),
        rewardDebt: new BigNumber(u.rewardDebt)
      })
    }
  }

  protected async initAsyncProtected(): Promise<void> {
    this.initNetworkBlockHeight();
    await this.initPoolsAsync();
    await this.initPoolUsersAsync();
  }

  protected disposeProtected(): void {
    if (this._networkBlockHeightInterval) {
      clearInterval(this._networkBlockHeightInterval);
    }
  }

  getBalanceAsync(_address: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getNetworkBlockHeightAsync(): Promise<BigNumber> {
    return this._networkBlockHeight;
  }

  async getPoolAsync(id: number): Promise<Pool> {
    await CommonUtil.timeout(CommonUtil.random(100, 500));
    return this._pools[id];
  }

  async getPoolsAsync(): Promise<Pool[]> {
    return this._pools;
  }

  async getPoolUserInfoAsync(poolId: number, address?: string): Promise<Maybe<PoolUserInfo>> {
    if (CommonUtil.isNullOrWhitespace(address)) {
      return undefined;
    }
    return this._users.find(e => e.poolId === poolId && e.address.toLowerCase() === address?.toLowerCase());
  }

  async getTotalPoolsAsync(): Promise<number> {
    return this._pools.length;
  }
}

const ds = new MockDataSource();

export const getMockDataSource = () => {
  return ds;
}