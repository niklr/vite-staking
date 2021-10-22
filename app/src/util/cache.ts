export class CachedFunctionCall<T> {
  private readonly _duration: number;
  private readonly _callbackFn: () => Promise<T>;
  private _currentValue?: Maybe<T>;
  private _lastExecution: number;

  constructor(duration: number, callbackFn: () => Promise<T>) {
    this._duration = duration;
    this._callbackFn = callbackFn;
    this._lastExecution = new Date(0).getTime();
  }

  private isExpired(): boolean {
    return new Date().getTime() >= this._lastExecution + this._duration;
  }

  async getAsync(): Promise<T> {
    if (!this._currentValue || this.isExpired()) {
      this._currentValue = await this._callbackFn();
      this._lastExecution = new Date().getTime();
    }
    return this._currentValue;
  }
}