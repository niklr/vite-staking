import { Avatar, Badge, Grid, styled, Typography } from "@mui/material";
import React from "react";
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
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <SmallCoin alt="VITE" src={props.pool?.rewardToken.iconUrl ?? ""} />
          }
        >
          <BigCoin alt="BAN" src={props.pool?.stakingToken.iconUrl ?? ""} />
        </Badge>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">
          Earn {props.pool?.rewardToken.originalSymbol}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stake {props.pool?.stakingToken.originalSymbol}
        </Typography>
      </Grid>
    </Grid>
  );
}