import { Avatar, Badge, Grid, Skeleton, styled, Typography } from "@mui/material";
import React from "react";
import { getCoinUtil } from "../../../../util/coin.util";
import { Pool } from "../../../../util/types";

interface Props {
  loading: boolean
  pool: Maybe<Pool>
}

export const Tokens: React.FC<Props> = (props: Props) => {
  const BigCoin = styled(Avatar)(({ theme }) => ({
    width: 50,
    height: 50,
    backgroundColor: "white",
    border: "1px solid black"
  }));
  const SmallCoin = styled(Avatar)(({ theme }) => ({
    width: 30,
    height: 30,
    backgroundColor: "white",
    border: `1px solid ${theme.palette.grey[600]}`
  }));
  const coinUtil = getCoinUtil();

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <SmallCoin alt={props.pool?.stakingToken.originalSymbol} src={coinUtil.mapIconUrl(props.pool?.stakingToken.iconUrl)} />
          }
        >
          <BigCoin alt={props.pool?.rewardToken.originalSymbol} src={coinUtil.mapIconUrl(props.pool?.rewardToken.iconUrl)} />
        </Badge>
      </Grid>
      <Grid item>
        {props.loading ? (
          <>
            <Skeleton animation="wave" height={25} width="70px" />
            <Skeleton animation="wave" height={25} width="90px" />
          </>
        ) : (
          <>
            <Typography variant="subtitle1">
              Earn {props.pool?.rewardToken.originalSymbol}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stake {props.pool?.stakingToken.originalSymbol}
            </Typography>
          </>
        )}
      </Grid>
    </Grid >
  );
}