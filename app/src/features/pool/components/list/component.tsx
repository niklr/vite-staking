import { Grid } from "@mui/material";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { DefaultPoolFilterValues } from "../../../../common/constants";
import { getCommonContext } from "../../../../contexts/common";
import { getEmitter } from "../../../../util/emitter.util";
import { FilterUtil } from "../../../../util/filter.util";
import { getLogger } from "../../../../util/logger";
import { GlobalEvent, Pool, PoolFilterValues } from "../../../../util/types";
import { Alert } from "../../../common/components/alert";
import { PoolListItem } from "../list-item";

const logger = getLogger()

interface Props {
  account?: Maybe<string>
  pools?: Maybe<Pool[]>
}

export const PoolList: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [allPools, setAllPools] = useState<Maybe<Pool[]>>(props.pools)
  const [pools, setPools] = useState<Maybe<Pool[]>>(props.pools)
  const [filter, setFilter] = useState<PoolFilterValues>(DefaultPoolFilterValues)
  const emitter = getEmitter()
  const commonContext = getCommonContext()

  useEffect(() => {
    if (props.pools) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
    setAllPools(props.pools)
  }, [props.pools])

  useEffect(() => {
    setPools(FilterUtil.filterPools(filter, allPools))
  }, [allPools, filter])

  useEffect(() => {
    const handleEvent = (oldValues: PoolFilterValues, newValues: PoolFilterValues) => {
      setFilter(newValues)
    }
    emitter.on(GlobalEvent.PoolFilterValuesChanged, handleEvent)
    return () => {
      logger.info('emitter.off', GlobalEvent.PoolFilterValuesChanged)()
      emitter.off(GlobalEvent.PoolFilterValuesChanged, handleEvent)
    };
  }, [emitter])

  useEffect(() => {
    const replacePool = (pool: Pool) => {
      if (allPools && pool) {
        const index = allPools.findIndex(e => e.id === pool.id)
        if (index >= 0) {
          // Replace existing
          const updatedPools = [...allPools]
          updatedPools[index] = {
            ...pool
          }
          setAllPools(updatedPools)
        } else {
          // Prepend to existing pools
          setAllPools([pool, ...allPools])
        }
      }
    }
    const handlePoolEvent = async (id: number, amount: BigNumber, account: string) => {
      const pool = await commonContext.datasource.getPoolAsync(id, props.account)
      replacePool(pool)
    }
    emitter.on(GlobalEvent.PoolDeposit, handlePoolEvent)
    emitter.on(GlobalEvent.PoolWithdraw, handlePoolEvent)
    return () => {
      logger.info('emitter.off', GlobalEvent.PoolDeposit)()
      emitter.off(GlobalEvent.PoolDeposit, handlePoolEvent)
      emitter.off(GlobalEvent.PoolWithdraw, handlePoolEvent)
    };
  }, [emitter, allPools, commonContext, props.account])

  if (!isLoading && pools && pools.length <= 0) {
    return (
      <Grid item key="1" xs={12} md={6}>
        <Alert message="No pools found." type="default"></Alert>
      </Grid>
    );
  }

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
      {isLoading ? (
        <>
          {[0, 1, 2].map((index: number) => (
            <Grid item key={index} xs={12} md={10}>
              <PoolListItem></PoolListItem>
            </Grid>
          ))}
        </>
      ) : (
        <>
          {pools?.map((p: Pool) => (
            <Grid item key={p.id} xs={12} md={10}>
              <PoolListItem account={props.account} pool={p}></PoolListItem>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
