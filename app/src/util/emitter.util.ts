import BigNumber from 'bignumber.js';
import EventEmitter from 'events';
import { GlobalEvent, PoolFilterValues } from './types';

export interface IGlobalEmitter {
  emitNetworkBlockHeightChanged(height: BigNumber): void
  emitPoolFilterValuesChanged(oldValues: PoolFilterValues, newValues: PoolFilterValues): void
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
}

const emitter = new GlobalEmitter();

export const getEmitter = (): IGlobalEmitter => {
  return emitter;
}
