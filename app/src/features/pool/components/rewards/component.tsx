import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { getPoolService } from "../../../../services/pool.service";
import { getEmitter } from "../../../../util/emitter.util";
import { GlobalEvent, Pool } from "../../../../util/types";
import { ViteUtil } from "../../../../util/vite.util";

interface Props {
  pool: Maybe<Pool>
  account?: Maybe<string>
  decimals: number
  setCanClaim?: React.Dispatch<React.SetStateAction<boolean>>
}

export const Rewards: React.FC<Props> = (props: Props) => {
  const [pool, setPool] = useState<Maybe<Pool>>(props.pool);
  const [rewardTokens, setRewardTokens] = useState<BigNumber>(new BigNumber(0));
  const emitter = getEmitter();
  const poolService = getPoolService();

  useEffect(() => {
    setPool(props.pool);
  }, [props.pool]);

  useEffect(() => {
    if (pool) {
      const newRewardTokens = ViteUtil.calculateRewardTokens(pool);
      setRewardTokens(newRewardTokens);
      if (props.setCanClaim) {
        props.setCanClaim(!!props.pool && !!props.account && newRewardTokens.gt(0));
      }
    } else {
      setRewardTokens(new BigNumber(0));
      if (props.setCanClaim) {
        props.setCanClaim(false);
      }
    }
  }, [pool, props]);

  useEffect(() => {
    if (pool) {
      const newRewardTokens = ViteUtil.calculateRewardTokens(pool);
      setRewardTokens(newRewardTokens);
      if (props.setCanClaim) {
        props.setCanClaim(!!props.pool && !!props.account && newRewardTokens.gt(0));
      }
    } else {
      setRewardTokens(new BigNumber(0));
      if (props.setCanClaim) {
        props.setCanClaim(false);
      }
    }
  }, [pool, props]);

  useEffect(() => {
    const handleEvent = (height: BigNumber) => {
      if (pool) {
        const updated = poolService.updateRewardPerToken(pool, height);
        if (updated) {
          const newPool: Pool = {
            ...pool
          }
          setPool(newPool);
        }
      }
    }
    emitter.on(GlobalEvent.NetworkBlockHeightChanged, handleEvent);
    return () => {
      emitter.off(GlobalEvent.NetworkBlockHeightChanged, handleEvent);
    };
  }, [emitter, pool, poolService]);

  const showRewardTokens = (decimals: number): string => {
    if (!pool) {
      return "0";
    }
    return ViteUtil.formatBigNumber(rewardTokens, pool.rewardToken.decimals, decimals);
  }

  return (
    <>
      {showRewardTokens(props.decimals)}
    </>
  );
}