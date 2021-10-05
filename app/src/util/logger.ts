import { CommonUtil } from './common.util';

export class LogEventModel {
  banner?: string;
  args?: any[];

  public constructor(init?: Partial<LogEventModel>) {
    Object.assign(this, init);
  }
}

export interface ILogger {
  // Make sure level is selected e.g. 'Verbose' in Chrome
  readonly debug: any;
  readonly info: any;
  readonly warn: any;
  readonly error: any;
}

const noop = (): any => undefined;

export class ConsoleLogger implements ILogger {

  private get isEnabled(): boolean {
    return Boolean(process.env.REACT_APP_IS_DEV);
  }

  get debug() {
    if (this.isEnabled) {
      return console.debug.bind(console);
    } else {
      return noop;
    }
  }

  get info() {
    if (this.isEnabled) {
      return console.info.bind(console);
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.isEnabled) {
      return console.warn.bind(console);
    } else {
      return noop;
    }
  }

  get error() {
    if (this.isEnabled) {
      return console.error.bind(console);
    } else {
      return noop;
    }
  }
}

export class ExtendedConsoleLogger implements ILogger {

  private get isEnabled(): boolean {
    return Boolean(process.env.REACT_APP_IS_DEV);
  }

  private timestamp(type: string): string {
    return `[${type} ${new Date().toLocaleTimeString()}]`;
  }

  private createLogEventModel(type: string, ...args: any[]): LogEventModel {
    const mapFn = (e: any) => {
      if (CommonUtil.isString(e)) {
        return e;
      } else if (e instanceof Error) {
        return e.message;
      }
      return CommonUtil.toJsonString(e);
    };
    const result = new LogEventModel({
      banner: this.timestamp(type),
      args: args?.map(e => Array.isArray(e) ? e.map(e1 => mapFn(e1)) : mapFn(e))
    });
    return result;
  }

  get debug() {
    if (this.isEnabled) {
      return (...args: any[]) => {
        const result = this.createLogEventModel('DEBUG', args);
        return Function.prototype.bind.call(console.debug, console, result.banner, ...args);
      };
    } else {
      return noop;
    }
  }

  get info() {
    if (this.isEnabled) {
      return (...args: any[]) => {
        const result = this.createLogEventModel('INFO', args);
        return Function.prototype.bind.call(console.info, console, result.banner, ...args);
      };
    } else {
      return noop;
    }
  }

  get warn() {
    if (this.isEnabled) {
      return (...args: any[]) => {
        const result = this.createLogEventModel('WARN', args);
        return Function.prototype.bind.call(console.warn, console, result.banner, ...args);
      };
    } else {
      return noop;
    }
  }

  get error() {
    if (this.isEnabled) {
      return (...args: any[]) => {
        if (args?.length > 0) {
          if (!CommonUtil.isString(args[0])) {
            args.push('(See console output for more information.)');
          }
        }
        const result = this.createLogEventModel('ERROR', args);
        return Function.prototype.bind.call(console.error, console, result.banner, ...args);
      };
    } else {
      return noop;
    }
  }
}

const logger = new ExtendedConsoleLogger();

export const getLogger = (): ILogger => {
  return logger;
}