import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useState } from 'react';
import { getAccountService } from '../../../../services/account.service';
import { getPoolService } from '../../../../services/pool.service';
import { CommonUtil } from '../../../../util/common.util';
import { getLogger } from '../../../../util/logger';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { Pool, PoolDialogState } from '../../../../util/types';
import { ViteUtil } from '../../../../util/vite.util';
import { ClickOnceButton } from '../../../common/components/click-once-button';

const logger = getLogger();

interface Props {
  pool: Pool
  state: PoolDialogState
  setState: React.Dispatch<React.SetStateAction<PoolDialogState>>
}

export const PoolWithdrawDialog: React.FC<Props> = (props: Props) => {
  const getStakedAmount = useCallback(() => {
    if (props.pool.userInfo?.stakingBalance.gt(0)) {
      return ViteUtil.formatBigNumber(props.pool.userInfo.stakingBalance, props.pool.stakingToken.decimals, 18).replace(',', '')
    }
    return ""
  }, [props.pool])

  const [amount, setAmount] = useState<string>(getStakedAmount());
  const [disabled, setDisabled] = useState<boolean>(false);
  const accountService = getAccountService();
  const poolService = getPoolService();

  const changeAmount = (amount: string) => {
    setAmount(amount);
    setDisabled(CommonUtil.isNullOrWhitespace(amount) || new BigNumber(amount).lte(0));
  }

  useEffect(() => {
    if (props.state.open) {
      changeAmount(getStakedAmount())
    }
  }, [props.state, getStakedAmount])

  useEffect(() => {
    async function getBalanceAsync() {
      const balance = await accountService.getBalanceAsync();
      logger.info("Account balance:", balance.toString())();
    }
    if (props.state.open) {
      getBalanceAsync();
    }
  }, [props.state, accountService])

  const handleClose = () => {
    props.setState({
      ...props.state,
      open: false
    })
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeAmount(event.target.value);
  };

  const handleConfirmAsync = async () => {
    try {
      const _amount = new BigNumber(amount).times(new BigNumber(10).pow(props.pool.stakingToken.decimals));
      await poolService.withdrawAsync(props.pool.id, _amount.toString());
      handleClose();
    } catch (error) {
      SnackbarUtil.enqueueError(error);
    }
  }

  return (
    <Dialog onClose={handleClose} open={props.state.open} maxWidth="xs" fullWidth>
      <DialogTitle>Withdraw</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the {props.pool.stakingToken.originalSymbol} amount to withdraw.
        </DialogContentText>
        <FormControl fullWidth sx={{ mt: 2 }} variant="standard" >
          <InputLabel htmlFor="contribute-amount">Amount</InputLabel>
          <Input
            id="contribute-amount"
            value={amount}
            onChange={handleChange}
            type="number"
            autoFocus
            startAdornment={<InputAdornment position="start">${props.pool.stakingToken.symbol}</InputAdornment>}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <ClickOnceButton size="medium" color="primary" callbackFn={handleConfirmAsync} disabled={disabled}>
          Confirm
        </ClickOnceButton>
      </DialogActions>
    </Dialog>
  )
}
