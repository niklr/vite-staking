import { CommonUtil } from './common.util';

export abstract class FormatUtil {
  static formatMessage(data: any): string {
    const defaultMessage = "Something went wrong."
    if (data) {
      console.log(data)
      let message: string
      if (!CommonUtil.isString(data)) {
        if (data.message) {
          message = data.message
        }
        else if (data.error?.message) {
          message = data.error.message
        } else if (data.graphQLErrors) {
          if (data.graphQLErrors.length > 0) {
            message = data.graphQLErrors[0].message
          } else {
            message = defaultMessage
          }
        } else {
          message = JSON.stringify(data)
          if (message === "{}") {
            message = defaultMessage
          }
        }
      } else {
        message = data
      }
      if (message.length > 128) {
        return message.substr(0, 128) + "..."
      }
      return message
    }
    return defaultMessage
  }
}