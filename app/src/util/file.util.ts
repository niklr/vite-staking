import fs from 'fs';

export abstract class FileUtil {
  abstract readFileAsync(path: string): Promise<any>;
}

export class BrowserFileUtil extends FileUtil {
  async readFileAsync(path: string): Promise<any> {
    const response = await fetch(path);
    return response.text();
  }
}

export class LocalFileUtil extends FileUtil {
  public async readFileAsync(path: string): Promise<any> {
    return Promise.resolve(fs.readFileSync(path, 'utf8'));
  }
}

export enum FileUtilType {
  Browser = 0,
  Local = 1
}

export const getFileUtil = (type: FileUtilType = FileUtilType.Browser) => {
  switch (type) {
    case FileUtilType.Local:
      return new LocalFileUtil();
    default:
      return new BrowserFileUtil();
  }
}