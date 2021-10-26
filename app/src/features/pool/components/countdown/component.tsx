import { Skeleton, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useState } from "react";
import { getNetworkManager } from "../../../../common/network";
import { getMomentFactory } from "../../../../factories";
import { Pool } from "../../../../util/types";

interface Props {
  pool: Maybe<Pool>
}

export const PoolCountdown: React.FC<Props> = (props: Props) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [remainingBlocks, setRemainingBlocks] = useState<BigNumber>(new BigNumber(0));
  const [countdown, setCountdown] = useState<string>("");
  const moment = useMemo(() => getMomentFactory().create(), []);
  const networkManager = getNetworkManager();

  useEffect(() => {
    let interval = setInterval(() => {
      const height = networkManager.networkHeight;
      if (props.pool?.endBlock) {
        let remainingBlocks = new BigNumber(0);
        if (height.lte(props.pool.startBlock)) {
          setHasStarted(false);
          remainingBlocks = props.pool.startBlock.minus(height);
        } else {
          setHasStarted(true);
          remainingBlocks = props.pool.endBlock.minus(height);
        }
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
    }, 500);
    return () => {
      clearInterval(interval);
    }
  }, [props.pool, moment, networkManager]);

  return (
    <>
      <Typography variant="body2" color="text.secondary">
        {hasStarted ? 'Ends in' : 'Starts in'}
      </Typography>
      {!props.pool ? (
        <Skeleton animation="wave" height={25} width="90px" />
      ) : (
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
      )}
    </>
  );
}