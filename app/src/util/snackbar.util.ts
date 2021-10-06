import { ProviderContext } from "notistack";
import { FormatUtil } from "./format.util";

export abstract class SnackbarUtil {
  static snackbar: ProviderContext;
  static enqueueError(error: any): void {
    SnackbarUtil.snackbar.enqueueSnackbar(FormatUtil.formatMessage(error));
  }
  static enqueueMessage(message: string): void {
    SnackbarUtil.snackbar.enqueueSnackbar(message);
  }
}