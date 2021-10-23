import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { getPoolService } from '../../../../services/pool.service';
import { CommonUtil } from '../../../../util/common.util';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { Pool, PoolDialogState } from '../../../../util/types';
import { ClickOnceButton } from '../../../common/components/click-once-button';

interface Props {
  pool: Pool
  state: PoolDialogState
  setState: React.Dispatch<React.SetStateAction<PoolDialogState>>
}

export const PoolDepositDialog: React.FC<Props> = (props: Props) => {
  const [amount, setAmount] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const poolService = getPoolService();

  const changeAmount = (amount: string) => {
    setAmount(amount);
    setDisabled(CommonUtil.isNullOrWhitespace(amount) || new BigNumber(amount).lte(0));
  }

  useEffect(() => {
    if (props.state.open) {
      changeAmount("")
    }
  }, [props.state])

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
      await poolService.depositAsync(props.pool.id, props.pool.stakingToken.id, _amount.toString());
      handleClose();
    } catch (error) {
      SnackbarUtil.enqueueError(error);
    }
  }

  return (
    <Dialog onClose={handleClose} open={props.state.open} maxWidth="xs" fullWidth>
      <DialogTitle>Stake</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Earn {props.pool.rewardToken.originalSymbol} by staking {props.pool.stakingToken.originalSymbol}
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
