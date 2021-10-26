import { Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { getNetworkManager } from "../../../../common/network";
import { getMomentFactory } from "../../../../factories";
import { Pool } from "../../../../util/types";

interface Props {
  pool: Maybe<Pool>
}

export const PoolCountdown: React.FC<Props> = (props: Props) => {
  const [remainingBlocks, setRemainingBlocks] = useState<BigNumber>(new BigNumber(0));
  const [countdown, setCountdown] = useState<string>("");
  const moment = useMemo(() => getMomentFactory().create(), []);
  const networkManager = getNetworkManager();

  useEffect(() => {
    let interval = setInterval(async () => {
      const height = networkManager.networkHeight;
      if (props.pool?.endBlock && height.gte(props.pool.startBlock)) {
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
    }, 1000)
    return () => {
      clearInterval(interval);
    }
  }, [props.pool, moment, networkManager]);

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