import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { DefaultPoolFilterValues } from "../../../../common/constants";
import { CommonUtil } from "../../../../util/common.util";
import { getEmitter } from "../../../../util/emitter.util";
import { GlobalEvent, Pool, PoolFilterValues } from "../../../../util/types";
import { Alert } from "../../../common/components/alert";
import { PoolListItem } from "../list-item";

interface Props {
  pools?: Maybe<Pool[]>
}

export const PoolList: React.FC<Props> = (props: Props) => {
  const [pools, setPools] = useState<Maybe<Pool[]>>(props.pools)
  const emitter = getEmitter();

  useEffect(() => {
    setPools(props.pools)
  }, [props.pools])

  useEffect(() => {
    const handleEvent = (oldValues: PoolFilterValues, newValues: PoolFilterValues) => {
      console.log(newValues)
      if (CommonUtil.equals(DefaultPoolFilterValues, newValues)) {
        setPools(props.pools)
      } else {
        setPools(props.pools?.filter(e => !!e.userInfo))
      }
    }
    emitter.on(GlobalEvent.PoolFilterValuesChanged, handleEvent)
    return () => {
      emitter.off(GlobalEvent.PoolFilterValuesChanged, handleEvent)
    };
  }, [emitter, props.pools])

  if (pools && pools.length <= 0) {
    return (
      <Grid item key="1" xs={12} md={6}>
        <Alert message="No pools found." type="default"></Alert>
      </Grid>
    );
  }

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3}>
      {!pools ? (
        <>
          {[0, 1, 2].map((index: number) => (
            <Grid item key={index} xs={12} md={10}>
              <PoolListItem></PoolListItem>
            </Grid>
          ))}
        </>
      ) : (
        <>
          {pools.map((p: Pool) => (
            <Grid item key={p.id} xs={12} md={10}>
              <PoolListItem pool={p}></PoolListItem>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
}
