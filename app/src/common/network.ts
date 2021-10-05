import { Network } from "../util/types";

export class NetworkManager {
  private _network?: Maybe<Network>;
  private _setNetworkCallback?: (network?: Maybe<Network>) => void;

  set onSetNetworkCallback(cb: (network?: Maybe<Network>) => void) {
    this._setNetworkCallback = cb;
  }

  getNetwork(): Maybe<Network> {
    return this._network;
  }

  setNetwork(network?: Maybe<Network>): void {
    this._network = network;
    if (this._setNetworkCallback) {
      this._setNetworkCallback(this._network);
    }
  }
}

const manager = new NetworkManager();

export const getNetworkManager = () => {
  return manager;
}