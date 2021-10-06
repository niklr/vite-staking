import BigNumber from "bignumber.js";
import { getLogger } from "../util/logger";
import { BaseDataSource } from "./base.datasource";

const logger = getLogger();

export class MockDataSource extends BaseDataSource {
  constructor() {
    super();
    logger.info("MockDataSource loaded")();
  }

  getBalanceAsync(_address: string): Promise<BigNumber> {
    throw new Error("Method not implemented.");
  }
}