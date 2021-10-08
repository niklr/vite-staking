import { Grid, Paper, Typography } from "@mui/material";
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import React from "react";
import { Tokens } from "../tokens";

interface Props {
  index: number;
}

export const PoolListItem: React.FC<Props> = (props: Props) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Tokens></Tokens>
        </Grid>
        <Grid item xs container alignItems="center">
          <Grid item xs container justifyContent="space-evenly" direction="row" spacing={2}>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                APR
              </Typography>
              <Typography variant="subtitle1">
                20%
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Total staked
              </Typography>
              <Typography variant="subtitle1">
                22123123
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                Ends in
              </Typography>
              <Typography variant="subtitle1">
                1000 Blocks
                <Typography variant="body2" color="text.secondary" display="inline" sx={{ ml: 1 }}>
                  10 days 5 hours
                </Typography>
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              <ArrowDropDownCircleOutlinedIcon></ArrowDropDownCircleOutlinedIcon>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}