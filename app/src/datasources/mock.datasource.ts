import BigNumber from "bignumber.js";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { getLogger } from "../util/logger";
import { ContractPool, Pool } from "../util/types";
import { BaseDataSource } from "./base.datasource";

const logger = getLogger();

export class MockDataSource extends BaseDataSource {
  private readonly _fileUtil: FileUtil;
  private _pools: Pool[];

  constructor(fileUtil: FileUtil = new BrowserFileUtil()) {
    super();
    this._fileUtil = fileUtil;
    this._pools = [];
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

  protected async initAsyncProtected(): Promise<void> {
    await this.initPoolsAsync();
  }

  getBalanceAsync(_address: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }

  async getTotalPoolsAsync(): Promise<number> {
    return this._pools.length;
  }
}

const ds = new MockDataSource();

export const getMockDataSource = () => {
  return ds;
}