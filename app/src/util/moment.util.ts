import moment from 'moment';

export class MomentUtil {
  constructor() {
    moment.locale(navigator.language);
  }

  public setLocale(language: string): void {
    moment.locale(language);
  }

  public get(): moment.Moment {
    return moment()
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

  public isExpired(timestamp: any): boolean {
    try {
      if (timestamp) {
        return moment.utc().unix() >= Number(timestamp);
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}