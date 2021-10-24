import BigNumber from "bignumber.js";
import { getViteClient, ViteClient } from "../clients/vite.client";
import { CommonConstants } from "../common/constants";
import { CachedFunctionCall } from "../util/cache";
import { CommonUtil } from "../util/common.util";
import { BrowserFileUtil, FileUtil } from "../util/file.util";
import { getLogger } from "../util/logger";
import { Contract, ContractPool, ContractPoolUserInfo, Pool, PoolUserInfo, VmLog, VmLogEvent } from "../util/types";
import { BaseDataSource } from "./base.datasource";

const logger = getLogger();

export class ViteDataSource extends BaseDataSource {
  private readonly _fileUtil: FileUtil;
  private readonly _client: ViteClient;
  private readonly _offchainMethods: Map<string, string> = new Map<string, string>();
  private readonly _cachedNetworkBlockHeight: CachedFunctionCall<number>;
  private _contract?: Contract;
  private _listener: any;

  constructor(fileUtil: FileUtil = new BrowserFileUtil()) {
    super();
    this._fileUtil = fileUtil;
    this._client = getViteClient();
    this._cachedNetworkBlockHeight = new CachedFunctionCall(500, async () => {
      // prevent function from being called more than once every 500 milliseconds
      return await this._client.requestAsync("ledger_getSnapshotChainHeight")
    });
    logger.info("ViteDataSource loaded")();
  }

  protected async initAsyncProtected(): Promise<void> {
    const contract = await this._fileUtil.readFileAsync('./assets/contracts/vite_staking_pools.json');
    this._contract = JSON.parse(contract) as Contract;
    this._contract.address = CommonConstants.POOLS_CONTRACT_ADDRESS;
    logger.info(`Contract ${this._contract?.contractName} loaded`)();
    this._listener = await this._client.createAddressListenerAsync(this._contract.address);
    this._listener.on((results: any[]) => {
      if (!this._contract?.abi) {
        logger.info('Could not decode vmlog because contract abi is not defined.')();
      } else {
        for (let index = 0; index < results.length; index++) {
          const result = results[index];
          const vmLog = this._client.decodeVmLog(result.vmlog, this._contract.abi);
          logger.info(vmLog ?? result)();
          if (vmLog) {
            this.handleVmLogAsync(vmLog);
          }
        }
      }
    });
  }

  protected disposeProtected(): void {
    this.removeAddressListener();
    this._offchainMethods.clear();
  }

  private removeAddressListener(): void {
    if (this._listener) {
      this._client.removeListener(this._listener);
    }
  }

  private get contract(): Contract {
    if (this._contract?.address === undefined) {
      throw new Error("Contract is not defined.");
    } else {
      return this._contract;
    }
  }

  async getAccountBalanceAsync(_account: string): Promise<BigNumber> {
    try {
      if (CommonUtil.isNullOrWhitespace(_account)) {
        return new BigNumber(0);
      }
      const result = await this._client.requestAsync("ledger_getAccountInfoByAddress", _account);
      if (!result?.balanceInfoMap) {
        return new BigNumber(0);
      }
      return new BigNumber(result.balanceInfoMap[CommonConstants.VITE_TOKEN_ID].balance).div(new BigNumber(10).pow(18));
    } catch (error) {
      logger.error(error)();
      return new BigNumber(0);
    }
  }

  async getNetworkBlockHeightAsync(): Promise<BigNumber> {
    try {
      const result = await this._cachedNetworkBlockHeight.getAsync();
      return new BigNumber(result);
    } catch (error) {
      logger.error(error)();
      return new BigNumber(0);
    }
  }

  async getPoolAsync(_id: number, _account?: Maybe<string>): Promise<Pool> {
    const result = await this._client.callOffChainMethodAsync(this.contract.address, this.getOffchainMethodAbi("getPoolInfo"), this.contract.offChain, [_id]);
    const p = this.objectFromEntries(result) as ContractPool;
    const pool = await this.toPoolAsync(_id, p);
    pool.apr = await this.getAprAsync(pool);
    pool.userInfo = await this.getPoolUserInfoAsync(_id, _account);
    return pool;
  }

  async getPoolsAsync(_account?: Maybe<string>): Promise<Pool[]> {
    const amount = await this.getTotalPoolsAsync();
    const pools = [];
    for (let index = 0; index < amount; index++) {
      try {
        const pool = await this.getPoolAsync(index, _account);
        pools.push(pool)
      } catch (error) {
        logger.error(error)();
      }
    }
    return pools;
  }

  async getPoolUserInfoAsync(_poolId: number, _account?: Maybe<string>): Promise<Maybe<PoolUserInfo>> {
    if (!_account || CommonUtil.isNullOrWhitespace(_account)) {
      return undefined;
    }
    const result = await this._client.callOffChainMethodAsync(this.contract.address, this.getOffchainMethodAbi("getUserInfo"), this.contract.offChain, [_poolId, _account]);
    const u = this.objectFromEntries(result) as ContractPoolUserInfo;
    const info = await this.toPoolUserInfoAsync(u);
    return info;
  }

  async getTotalPoolsAsync(): Promise<number> {
    const result = await this._client.callOffChainMethodAsync(this.contract.address, this.getOffchainMethodAbi("getPoolCount"), this.contract.offChain, []);
    return Number(result[0].value);
  }

  async depositAsync(_id: number, _tokenId: string, _amount: string): Promise<boolean> {
    const account = this.getAccount();
    const result = await this._client.callContractAsync(account, "deposit", this.contract.abi, [_id], _tokenId, _amount, this.contract.address);
    await this.handleResponseAsync(account.address, result.height);
    return true;
  }

  async withdrawAsync(_id: number, _amount: string): Promise<boolean> {
    const account = this.getAccount();
    const result = await this._client.callContractAsync(account, "withdraw", this.contract.abi, [_id, _amount], undefined, "0", this.contract.address);
    await this.handleResponseAsync(account.address, result.height);
    return true;
  }

  private getOffchainMethodAbi(name: string): any {
    let result: Maybe<any>
    if (this._offchainMethods.has(name)) {
      result = this._offchainMethods.get(name)
    } else {
      result = this.contract.abi.find(e => e.type === "offchain" && e.name === name)
      if (result) {
        this._offchainMethods.set(name, result)
      }
    }
    if (result) {
      return result
    } else {
      throw new Error(`The offchain method '${name}' does not exist.'`)
    }
  }

  private handleResponseAsync = async (address: string, height: string) => new Promise<void>((resolve, reject) => {
    this._client.waitForAccountBlockAsync(address, height).then((result: any) => {
      if (result?.status === 0) {
        resolve()
      } else {
        reject(result?.statusTxt ?? "Something went wrong.")
      }
    })
  })

  private async handleVmLogAsync(vmlog: VmLog): Promise<void> {
    try {
      if (vmlog.event === VmLogEvent.Deposit && vmlog.args.addr && vmlog.args.pid && vmlog.args.amount) {
        this._emitter.emitPoolDeposit(Number(vmlog.args.pid), new BigNumber(vmlog.args.amount), vmlog.args.addr);
      } else if (vmlog.event === VmLogEvent.Withdraw && vmlog.args.addr && vmlog.args.pid && vmlog.args.amount) {
        this._emitter.emitPoolWithdraw(Number(vmlog.args.pid), new BigNumber(vmlog.args.amount), vmlog.args.addr);
      } else {
        logger.info('Unknown vmlog event.', vmlog)();
      }
    } catch (error) {
      logger.error(error)();
    }
  }

  private objectFromEntries = (entries: any) => {
    return Object.fromEntries(
      entries.map((entry: any) => {
        return [entry.name, entry.value];
      })
    );
  }
}

const ds = new ViteDataSource();

export const getViteDataSource = () => {
  return ds;
}