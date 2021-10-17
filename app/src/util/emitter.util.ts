import BigNumber from 'bignumber.js';
import EventEmitter from 'events';
import { GlobalEvent, PoolFilterValues } from './types';

export interface IGlobalEmitter {
  emitNetworkBlockHeightChanged(height: BigNumber): void
  emitPoolFilterValuesChanged(oldValues: PoolFilterValues, newValues: PoolFilterValues): void
  emitPoolDeposit(id: number, amount: BigNumber, account: string): void
  emitPoolWithdraw(id: number, amount: BigNumber, account: string): void
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class GlobalEmitter extends EventEmitter implements IGlobalEmitter {
  emitNetworkBlockHeightChanged(height: BigNumber): void {
    this.emit(GlobalEvent.NetworkBlockHeightChanged, height)
  }
  emitPoolFilterValuesChanged(oldValues: PoolFilterValues, newValues: PoolFilterValues): void {
    this.emit(GlobalEvent.PoolFilterValuesChanged, oldValues, newValues)
  }
  emitPoolDeposit(id: number, amount: BigNumber, account: string): void {
    this.emit(GlobalEvent.PoolDeposit, id, amount)
  }
  emitPoolWithdraw(id: number, amount: BigNumber, account: string): void {
    this.emit(GlobalEvent.PoolWithdraw, id, amount)
  }
}

const emitter = new GlobalEmitter();

export const getEmitter = (): IGlobalEmitter => {
  return emitter;
}
