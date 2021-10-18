import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import { Pool, PoolDialogState } from '../../../../util/types';
import { ClickOnceButton } from '../../../common/components/click-once-button';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { getPoolService } from '../../../../services/pool.service';
import { ViteUtil } from '../../../../util/vite.util';

interface Props {
  pool: Pool
  state: PoolDialogState
  setState: React.Dispatch<React.SetStateAction<PoolDialogState>>
}

export const PoolWithdrawDialog: React.FC<Props> = (props: Props) => {
  const getStakedAmount = useCallback(() => {
    if (props.pool.userInfo?.stakingBalance.gt(0)) {
      return ViteUtil.formatBigNumber(props.pool.userInfo.stakingBalance, props.pool.stakingToken.decimals, 18)
    }
    return ""
  }, [props.pool])

  const [amount, setAmount] = useState<string>(getStakedAmount());
  const poolService = getPoolService();

  useEffect(() => {
    if (props.state.open) {
      setAmount(getStakedAmount())
    }
  }, [props.state, getStakedAmount])

  const handleClose = () => {
    props.setState({
      ...props.state,
      open: false
    })
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleConfirmAsync = async () => {
    try {
      await poolService.withdrawAsync(props.pool.id, amount);
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
        <ClickOnceButton size="medium" color="primary" callbackFn={handleConfirmAsync}>
          Confirm
        </ClickOnceButton>
      </DialogActions>
    </Dialog>
  )
}
