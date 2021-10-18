import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Grid, Link, Paper, Skeleton, styled, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useEffect, useState } from "react";
import { getLogger } from "../../../../util/logger";
import { Pool, PoolDialogState, PoolDialogType } from "../../../../util/types";
import { ViteUtil } from "../../../../util/vite.util";
import { PoolCountdown } from "../countdown";
import { PoolDialog } from "../dialog";
import { Tokens } from "../tokens";

const logger = getLogger()

const TransparentPaper = styled(Paper)(
  ({ theme }) => ({
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    backgroundColor: "transparent"
  }));

interface Props {
  account?: Maybe<string>
  pool?: Maybe<Pool>
}

export const PoolListItem: React.FC<Props> = (props: Props) => {
  const [dialogState, setDialogState] = useState<PoolDialogState>({
    type: PoolDialogType.DEPOSIT,
    open: false
  });
  const [rewardTokens, setRewardTokens] = useState<BigNumber>(new BigNumber(0));
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const [canWithdraw, setCanWithdraw] = useState<boolean>(false);

  useEffect(() => {
    if (props.pool) {
      logger.info(`Pool loaded: ${props.pool?.id}`)();
      const newRewardTokens = ViteUtil.calculateRewardTokens(props.pool);
      setRewardTokens(newRewardTokens);
      setCanClaim(!!props.pool && !!props.account && newRewardTokens.gt(0));
      setCanWithdraw(!!props.pool && !!props.account && (props.pool.userInfo?.stakingBalance.gt(0) ?? false))
    } else {
      setRewardTokens(new BigNumber(0));
      setCanClaim(false);
      setCanWithdraw(false);
    }
  }, [props.pool, props.account]);

  const showRewardTokens = (decimals: number): string => {
    if (!props.pool) {
      return "0";
    }
    return ViteUtil.formatBigNumber(rewardTokens, props.pool.rewardToken.decimals, decimals);
  }

  const showApr = (): Maybe<string> => {
    if (!props.pool || !props.pool.apr) {
      return "0";
    }
    return props.pool.apr.toFormat(2);
  }

  const showTotalStaked = (): string => {
    if (!props.pool) {
      return "0";
    }
    return ViteUtil.formatBigNumber(props.pool.totalStaked, props.pool.stakingToken.decimals, 2);
  }

  const showStaked = (decimals: number): string => {
    if (!props.pool?.userInfo) {
      return "0";
    }
    return ViteUtil.formatBigNumber(props.pool.userInfo.stakingBalance, props.pool.stakingToken.decimals, decimals);
  }

  const handleClickDeposit = () => {
    setDialogState({
      ...dialogState,
      type: PoolDialogType.DEPOSIT,
      open: true
    })
  }

  const handleClickWithdraw = () => {
    setDialogState({
      ...dialogState,
      type: PoolDialogType.WITHDRAW,
      open: true
    })
  }

  const handleClickClaim = () => {
    setDialogState({
      ...dialogState,
      type: PoolDialogType.CLAIM,
      open: true
    })
  }

  return (
    <>
      <Accordion defaultExpanded>
        <AccordionSummary sx={{ backgroundColor: "rgba(217, 217, 217, 0.1)" }} expandIcon={<ExpandMoreIcon />}>
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Tokens loading={!props.pool} pool={props.pool}></Tokens>
            </Grid>
            <Grid item xs container alignItems="center">
              <Grid item xs container justifyContent="space-evenly" direction="row" spacing={2}>
                <Grid item>
                  {!props.pool ? (
                    <>
                      <Skeleton animation="wave" height={25} width="90px" />
                      <Skeleton animation="wave" height={25} width="70px" />
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {props.pool?.rewardToken.originalSymbol} earned
                      </Typography>
                      <Typography variant="subtitle1">
                        {showRewardTokens(4)}
                      </Typography>
                    </>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    APR
                  </Typography>
                  {!props.pool ? (
                    <Skeleton animation="wave" height={25} width="60px" />
                  ) : (
                    <Typography variant="subtitle1">
                      {props.pool.apr ? (
                        <>
                          {showApr()}%
                        </>
                      ) : (
                        <>
                          -
                        </>
                      )}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Total staked
                  </Typography>
                  {!props.pool ? (
                    <Skeleton animation="wave" height={25} width="120px" />
                  ) : (
                    <Typography variant="subtitle1">
                      {showTotalStaked()}
                    </Typography>
                  )}
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    Ends in
                  </Typography>
                  {!props.pool ? (
                    <Skeleton animation="wave" height={25} width="90px" />
                  ) : (
                    <PoolCountdown pool={props.pool} />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: "rgba(217, 217, 217, 0.3)", pt: 2 }}>
          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item sx={{ mr: 4 }}>
              <Link underline="none" href={props.pool?.rewardToken.url ?? "#"} target="_blank" sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                View {props.pool?.rewardToken.originalSymbol}&nbsp;<OpenInNewIcon fontSize="small"></OpenInNewIcon>
              </Link>
              <Link underline="none" href={props.pool?.stakingToken.url ?? "#"} target="_blank" sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                View {props.pool?.stakingToken.originalSymbol}&nbsp;<OpenInNewIcon fontSize="small"></OpenInNewIcon>
              </Link>
            </Grid>
            <Grid item xs container alignItems="center">
              <Grid item container justifyContent="space-evenly" direction="row" spacing={2}>
                <Grid item xs={12} md={6} lg={5} zeroMinWidth>
                  <TransparentPaper variant="outlined">
                    <Typography variant="body2" color="text.secondary">
                      {props.pool?.rewardToken.originalSymbol} earned
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {!props.pool ? (
                        <Skeleton animation="wave" height={30} width="100%" />
                      ) : (
                        <Typography sx={{ width: "100%" }} noWrap>
                          {showRewardTokens(18)}
                        </Typography>
                      )}
                      <Button variant="contained" size="large" sx={{ ml: 2 }} onClick={handleClickClaim} disabled={!canClaim}>Claim</Button>
                    </Box>
                  </TransparentPaper>
                </Grid>
                {!props.account ? (
                  <Grid item xs={12} md={6} lg={5}>
                    <TransparentPaper variant="outlined">
                      <Typography variant="body2" color="text.secondary">
                        Start staking
                      </Typography>
                      <Button variant="contained" size="large" fullWidth disabled={!props.pool}>Connect wallet</Button>
                    </TransparentPaper>
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={12} md={6} lg={5} zeroMinWidth>
                      <TransparentPaper variant="outlined">
                        <Typography variant="body2" color="text.secondary">
                          Staked
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {!props.pool ? (
                            <Skeleton animation="wave" height={30} width="100%" />
                          ) : (
                            <Typography sx={{ width: "100%" }} noWrap>
                              {showStaked(18)}
                            </Typography>
                          )}
                          <Button variant="contained" size="large" sx={{ ml: 2 }} onClick={handleClickWithdraw} disabled={!canWithdraw}>
                            Withdraw
                          </Button>
                        </Box>
                      </TransparentPaper>
                    </Grid>
                    <Grid item xs={12} md sx={{ display: "flex", alignItems: "center" }}>
                      <Button variant="contained" size="large" fullWidth onClick={handleClickDeposit} disabled={!props.pool || !props.account}>
                        Stake
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      {props.pool && (
        <PoolDialog pool={props.pool} state={dialogState} setState={setDialogState}></PoolDialog>
      )}
    </>
  );
}