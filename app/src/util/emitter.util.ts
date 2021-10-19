import BigNumber from 'bignumber.js';
import EventEmitter from 'events';
import { GlobalEvent, PoolFilterValues } from './types';

export interface IGlobalEmitter {
  emitConfirmTransactionDialog(open: boolean): void
  emitNetworkBlockHeightChanged(height: BigNumber): void
  emitPoolFilterValuesChanged(oldValues: PoolFilterValues, newValues: PoolFilterValues): void
  emitPoolDeposit(id: number, amount: BigNumber, account: string): void
  emitPoolWithdraw(id: number, amount: BigNumber, account: string): void
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class GlobalEmitter extends EventEmitter implements IGlobalEmitter {
  emitConfirmTransactionDialog(open: boolean): void {
    this.emit(GlobalEvent.ConfirmTransactionDialog, open)
  }
  emitNetworkBlockHeightChanged(height: BigNumber): void {
    this.emit(GlobalEvent.NetworkBlockHeightChanged, height)
  }
  emitPoolFilterValuesChanged(oldValues: PoolFilterValues, newValues: PoolFilterValues): void {
    this.emit(GlobalEvent.PoolFilterValuesChanged, oldValues, newValues)
  }
  emitPoolDeposit(id: number, amount: BigNumber, account: string): void {
    this.emit(GlobalEvent.PoolDeposit, id, amount, account)
  }
  emitPoolWithdraw(id: number, amount: BigNumber, account: string): void {
    this.emit(GlobalEvent.PoolWithdraw, id, amount, account)
  }
}

const emitter = new GlobalEmitter();

export const getEmitter = (): IGlobalEmitter => {
  return emitter;
}
