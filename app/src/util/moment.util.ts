import moment from 'moment';

export class MomentUtil {
  private readonly _locale: string;

  constructor(locale?: Maybe<string>) {
    if (locale) {
      this._locale = locale;
    } else {
      this._locale = navigator.language;
    }
    moment.locale(this._locale);
  }

  public getLocale(): string {
    return this._locale;
  }

  public get(): moment.Moment {
    return moment();
  }

  public getDuration(seconds: number): moment.Duration {
    return moment.duration(seconds, 'seconds');
  }

  public getFromUnix(date: number) {
    return moment.unix(date);
  }

  public getFromMilliseconds(date: number) {
    return moment(date, 'x');
  }

  public getLocal(date: any): moment.Moment {
    return moment.utc(date).local();
  }

  public getLocalTime(date: any): string {
    return this.getLocal(date).format('LTS');
  }

  public getLocalDate(date: any): string {
    return this.getLocal(date).format('L');
  }

  public getLocalFormatted(date: any): string {
    return this.getLocalTime(date) + ' ' + this.getLocalDate(date);
  }

  public getLocalReverseFormatted(date: any): string {
    return this.getLocalDate(date) + ' ' + this.getLocalTime(date);
  }

  public isExpired(timestamp: number): boolean {
    try {
      if (timestamp >= 0) {
        return moment.utc().unix() >= timestamp;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}