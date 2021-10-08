import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Link, Paper, Skeleton, styled, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { usePoolHook } from "../../../../hooks/pool.hook";
import { Tokens } from "../tokens";

const TransparentPaper = styled(Paper)(
  ({ theme }) => ({
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    backgroundColor: "transparent"
  }));

interface Props {
  index: number;
}

export const PoolListItem: React.FC<Props> = (props: Props) => {
  const poolHook = usePoolHook(props.index);

  return (
    <Accordion defaultExpanded>
      <AccordionSummary sx={{ backgroundColor: "rgba(217, 217, 217, 0.1)" }} expandIcon={<ExpandMoreIcon />}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Tokens loading={poolHook.loading} pool={poolHook.pool}></Tokens>
          </Grid>
          <Grid item xs container alignItems="center">
            <Grid item xs container justifyContent="space-evenly" direction="row" spacing={2}>
              <Grid item>
                {poolHook.loading ? (
                  <>
                    <Skeleton animation="wave" height={25} width="90px" />
                    <Skeleton animation="wave" height={25} width="70px" />
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {poolHook.pool?.rewardToken.originalSymbol} earned
                    </Typography>
                    <Typography variant="subtitle1">
                      0
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  APR
                </Typography>
                {poolHook.loading ? (
                  <Skeleton animation="wave" height={25} width="60px" />
                ) : (
                  <Typography variant="subtitle1">
                    20%
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Total staked
                </Typography>
                {poolHook.loading ? (
                  <Skeleton animation="wave" height={25} width="120px" />
                ) : (
                  <Typography variant="subtitle1">
                    22123123
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Ends in
                </Typography>
                {poolHook.loading ? (
                  <Skeleton animation="wave" height={25} width="90px" />
                ) : (
                  <Typography variant="subtitle1">
                    1000 Blocks
                    <Typography variant="body2" color="text.secondary" display="inline" sx={{ ml: 1 }}>
                      10 days 5 hours
                    </Typography>
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: "rgba(217, 217, 217, 0.3)", pt: 2 }}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item sx={{ mr: 4 }}>
            <Link underline="none" href={poolHook.pool?.rewardToken.url ?? "#"} target="_blank" sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              View {poolHook.pool?.rewardToken.originalSymbol}&nbsp;<OpenInNewIcon fontSize="small"></OpenInNewIcon>
            </Link>
            <Link underline="none" href={poolHook.pool?.stakingToken.url ?? "#"} target="_blank" sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              View {poolHook.pool?.stakingToken.originalSymbol}&nbsp;<OpenInNewIcon fontSize="small"></OpenInNewIcon>
            </Link>
          </Grid>
          <Grid item xs container alignItems="center">
            <Grid item container justifyContent="space-evenly" direction="row" spacing={2}>
              <Grid item xs={12} md={6} lg={5} zeroMinWidth>
                <TransparentPaper variant="outlined">
                  <Typography variant="body2" color="text.secondary">
                    {poolHook.pool?.rewardToken.originalSymbol} earned
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {poolHook.loading ? (
                      <Skeleton animation="wave" height={30} width="100%" />
                    ) : (
                      <Typography sx={{ width: "100%" }} noWrap>
                        221231232212312322123123
                      </Typography>
                    )}
                    <Button variant="contained" size="large" sx={{ ml: 2 }} disabled>Claim</Button>
                  </Box>
                </TransparentPaper>
              </Grid>
              <Grid item xs={12} md={6} lg={5} hidden>
                <TransparentPaper variant="outlined">
                  <Typography variant="body2" color="text.secondary">
                    Start staking
                  </Typography>
                  <Button variant="contained" size="large" fullWidth>Connect wallet</Button>
                </TransparentPaper>
              </Grid>
              <Grid item xs={12} md={6} lg={5} zeroMinWidth>
                <TransparentPaper variant="outlined">
                  <Typography variant="body2" color="text.secondary">
                    Staked
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {poolHook.loading ? (
                      <Skeleton animation="wave" height={30} width="100%" />
                    ) : (
                      <Typography sx={{ width: "100%" }} noWrap>
                        221231232212312322123123
                      </Typography>
                    )}
                    <Button variant="contained" size="large" sx={{ ml: 2 }}>Withdraw</Button>
                  </Box>
                </TransparentPaper>
              </Grid>
              <Grid item xs={12} md sx={{ display: "flex", alignItems: "center" }}>
                <Button variant="contained" size="large" fullWidth>Stake</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}