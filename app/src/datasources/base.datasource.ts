import BigNumber from "bignumber.js";
import { CoingeckoClient, getCoingeckoClient } from "../clients/coingecko.client";
import { getVitexClient, VitexClient } from "../clients/vitex.client";
import { TypeNames, UnknownToken } from "../common/constants";
import { CoinUtil, getCoinUtil } from "../util/coin.util";
import { getEmitter, IGlobalEmitter } from "../util/emitter.util";
import { Ensure } from "../util/ensure";
import { getLogger } from "../util/logger";
import { MomentUtil } from "../util/moment.util";
import { ContractPool, ContractPoolUserInfo, Pool, PoolUserInfo, Token } from "../util/types";
import { getWalletManager, WalletAccount, WalletManager } from "../wallet";

const logger = getLogger();

export interface IDataSource {
  initAsync(): Promise<void>;
  dispose(): void;
  getAccountBalanceAsync(_account: string): Promise<BigNumber>;
  getNetworkBlockHeightAsync(): Promise<BigNumber>;
  getPoolAsync(_id: number, _account?: Maybe<string>): Promise<Pool>;
  getPoolsAsync(_account?: Maybe<string>): Promise<Pool[]>;
  getPoolUserInfoAsync(_poolId: number, _account?: Maybe<string>): Promise<Maybe<PoolUserInfo>>;
  getTokenAsync(_id: string): Promise<Token>;
  getTotalPoolsAsync(): Promise<number>;
  depositAsync(_id: number, _tokenId: string, _amount: string): Promise<boolean>;
  withdrawAsync(_id: number, _amount: string): Promise<boolean>;
}

export abstract class BaseDataSource implements IDataSource {
  protected readonly _emitter: IGlobalEmitter;
  private readonly _walletManager: WalletManager;
  private readonly _coingeckoClient: CoingeckoClient;
  private readonly _vitexClient: VitexClient;
  private readonly _coinUtil: CoinUtil;
  private readonly _tokens: Map<string, Token>;
  private _moment: MomentUtil = new MomentUtil();

  constructor() {
    this._emitter = getEmitter();
    this._walletManager = getWalletManager();
    this._coingeckoClient = getCoingeckoClient();
    this._vitexClient = getVitexClient();
    this._coinUtil = getCoinUtil();
    this._tokens = new Map<string, Token>();
  }

  async initAsync(): Promise<void> {
    logger.info("Init BaseDataSource")();
    this._moment = new MomentUtil();
    await this.initAsyncProtected();
  }

  dispose(): void {
    logger.info("Disposing BaseDataSource")();
    this._tokens.clear();
    this.disposeProtected();
  }

  getAccount(): WalletAccount {
    const account = this._walletManager.getActiveAccount();
    Ensure.notNull(account, "account", "Please connect your wallet first.");
    return account as WalletAccount;
  }

  async getAprAsync(pool: Pool): Promise<Maybe<BigNumber>> {
    try {
      if (pool.endTimestamp >= 0 && (this._moment.isExpired(pool.endTimestamp) || pool.latestRewardBlock === pool.endBlock)) {
        // pool is closed, should not display numeric APR.
        return undefined;
      }
      const stakingTokenPrice = await this._coingeckoClient.getTokenPriceUSDAsync(pool.stakingToken.name);
      const rewardTokenPrice = await this._coingeckoClient.getTokenPriceUSDAsync(pool.rewardToken.name);
      const totalTime = pool.endBlock.minus(pool.startBlock);
      const secondsInYear = new BigNumber(365 * 24 * 60 * 60);
      const toPercent = new BigNumber(100);
      const apr = rewardTokenPrice.times(pool.totalRewards).dividedBy(stakingTokenPrice.times(pool.totalStaked).times(totalTime)).times(secondsInYear).times(toPercent);
      return !apr.isFinite() || apr.isNaN() ? undefined : apr;
    } catch (error) {
      logger.error(error)();
      return undefined;
    }
  }

  async getEndTimestampAsync(endBlock: BigNumber): Promise<number> {
    try {
      if (!endBlock || endBlock.lte(0)) {
        return -1;
      }
      const networkBlockHeight = await this.getNetworkBlockHeightAsync();
      const remainingSeconds = endBlock.minus(networkBlockHeight);
      if (remainingSeconds.lte(0)) {
        return 0;
      }
      return this._moment.get().add(remainingSeconds.toNumber(), "seconds").unix();
    } catch (error) {
      logger.error(error)();
    }
    return 0;
  }

  async getTokenAsync(id: string): Promise<Token> {
    try {
      const existing = this._tokens.get(id);
      if (existing) {
        return existing;
      }
      const result = await this._vitexClient.getTokenDetailAsync(id);
      if (result) {
        const token = {
          __typename: "Token",
          id,
          name: result.name,
          symbol: result.symbol,
          originalSymbol: result.originalSymbol,
          decimals: result.tokenDecimals,
          iconUrl: result.urlIcon,
          url: "https://coinmarketcap.com/currencies/" + this._coinUtil.mapCoinMarketCapName(result.name)
        }
        this._tokens.set(id, token);
        return token;
      }
    } catch (error) {
      logger.error(error)();
    }
    const unknownToken = {
      ...UnknownToken,
      id
    }
    this._tokens.set(id, unknownToken);
    return unknownToken;
  }

  protected async toPoolAsync(id: number, p: ContractPool): Promise<Pool> {
    const stakingToken = await this.getTokenAsync(p.stakingTokenId);
    const rewardToken = await this.getTokenAsync(p.rewardTokenId);
    const endTimestamp = await this.getEndTimestampAsync(new BigNumber(p.endBlock));
    const pool: Pool = {
      __typename: TypeNames.Pool,
      id,
      stakingToken,
      rewardToken,
      totalStaked: new BigNumber(p.totalStakingBalance),
      totalRewards: new BigNumber(p.totalRewardBalance),
      startBlock: new BigNumber(p.startBlock),
      endBlock: new BigNumber(p.endBlock),
      endTimestamp,
      latestRewardBlock: new BigNumber(p.latestRewardBlock),
      rewardPerPeriod: new BigNumber(p.rewardPerPeriod),
      rewardPerToken: new BigNumber(p.rewardPerToken),
      paidOut: new BigNumber(p.paidOut),
      fetchTimestamp: this._moment.get().unix()
    };
    return pool;
  }

  protected async toPoolUserInfoAsync(u: ContractPoolUserInfo): Promise<PoolUserInfo> {
    return {
      __typename: TypeNames.PoolUserInfo,
      id: `${u.address}_${u.poolId}`,
      poolId: u.poolId,
      account: u.address,
      stakingBalance: new BigNumber(u.stakingBalance),
      rewardDebt: new BigNumber(u.rewardDebt)
    }
  }

  protected abstract initAsyncProtected(): Promise<void>;

  protected abstract disposeProtected(): void;

  abstract getAccountBalanceAsync(_account: string): Promise<BigNumber>;

  abstract getNetworkBlockHeightAsync(): Promise<BigNumber>;

  abstract getPoolAsync(_id: number, _account?: Maybe<string>): Promise<Pool>;

  abstract getPoolsAsync(_account?: Maybe<string>): Promise<Pool[]>;

  abstract getPoolUserInfoAsync(_poolId: number, _account?: Maybe<string>): Promise<Maybe<PoolUserInfo>>;

  abstract getTotalPoolsAsync(): Promise<number>;

  abstract depositAsync(_id: number, _tokenId: string, _amount: string): Promise<boolean>;

  abstract withdrawAsync(_id: number, _amount: string): Promise<boolean>;
}