import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { DefaultPoolFilterValues } from "../../../../common/constants";
import { getEmitter } from "../../../../util/emitter.util";
import { FilterUtil } from "../../../../util/filter.util";
import { getLogger } from "../../../../util/logger";
import { GlobalEvent, Pool, PoolFilterValues } from "../../../../util/types";
import { Alert } from "../../../common/components/alert";
import { PoolListItem } from "../list-item";

const logger = getLogger()

interface Props {
  pools?: Maybe<Pool[]>
}

export const PoolList: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pools, setPools] = useState<Maybe<Pool[]>>(props.pools)
  const emitter = getEmitter()

  useEffect(() => {
    if (props.pools) {
      setIsLoading(false)
    } else {
      setIsLoading(true)
    }
  }, [props.pools])

  useEffect(() => {
    setPools(FilterUtil.filterPools(DefaultPoolFilterValues, props.pools))
  }, [props.pools])

  useEffect(() => {
    const handleEvent = (oldValues: PoolFilterValues, newValues: PoolFilterValues) => {
      setPools(FilterUtil.filterPools(newValues, props.pools))
    }
    emitter.on(GlobalEvent.PoolFilterValuesChanged, handleEvent)
    return () => {
      logger.info('emitter.off', GlobalEvent.PoolFilterValuesChanged)()
      emitter.off(GlobalEvent.PoolFilterValuesChanged, handleEvent)
    };
  }, [emitter, props.pools])

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
              <PoolListItem pool={p}></PoolListItem>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
