import { Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { getMomentFactory } from "../../../../factories";
import { getEmitter } from "../../../../util/emitter.util";
import { GlobalEvent, Pool } from "../../../../util/types";

interface Props {
  pool: Maybe<Pool>
}

export const PoolCountdown: React.FC<Props> = (props: Props) => {
  const [remainingBlocks, setRemainingBlocks] = useState<BigNumber>(new BigNumber(0));
  const [countdown, setCountdown] = useState<string>("");
  const emitter = getEmitter();
  const moment = useMemo(() => getMomentFactory().create(), [])

  useEffect(() => {
    const handleEvent = (height: BigNumber) => {
      if (props.pool?.endBlock) {
        const remainingBlocks = props.pool.endBlock.minus(height);
        if (remainingBlocks.gte(0)) {
          setRemainingBlocks(remainingBlocks);
          const duration = moment.getDuration(remainingBlocks.toNumber());
          if (duration.days() > 0) {
            setCountdown(duration.days() + " days " + duration.hours() + " hours")
          } else if (duration.hours() > 0) {
            setCountdown(duration.hours() + " hours " + duration.minutes() + " minutes")
          } else if (duration.minutes() > 0) {
            setCountdown(duration.minutes() + " minutes " + duration.seconds() + " seconds")
          } else {
            setCountdown(duration.seconds() + " seconds")
          }
        } else {
          setRemainingBlocks(new BigNumber(0));
          setCountdown("");
        }
      }
    }
    emitter.on(GlobalEvent.NetworkBlockHeightChanged, handleEvent)
    return () => {
      emitter.off(GlobalEvent.NetworkBlockHeightChanged, handleEvent)
    };
  }, [emitter, moment, props.pool]);

  return (
    <>
      {remainingBlocks.gt(0) ? (
        <Typography variant="subtitle1">
          {remainingBlocks.toString()} Blocks
          <Typography variant="body2" color="text.secondary" display="inline" sx={{ ml: 1 }}>
            {countdown}
          </Typography>
        </Typography>
      ) : (
        <Typography variant="subtitle1">-</Typography>
      )}
    </>
  );
}