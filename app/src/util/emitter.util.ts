import BigNumber from 'bignumber.js';
import EventEmitter from 'events';
import { GlobalEvent } from './types';

export interface IGlobalEmitter {
  emitNetworkBlockHeight(height: BigNumber): void
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class GlobalEmitter extends EventEmitter implements IGlobalEmitter {
  emitNetworkBlockHeight(height: BigNumber): void {
    this.emit(GlobalEvent.NetworkBlockHeight, height)
  }
}

const emitter = new GlobalEmitter();

export const getEmitter = () => {
  return emitter;
}
