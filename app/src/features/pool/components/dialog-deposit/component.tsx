import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Input, InputAdornment, InputLabel } from '@mui/material';
import { Pool, PoolDialogState } from '../../../../util/types';
import { ClickOnceButton } from '../../../common/components/click-once-button';
import { SnackbarUtil } from '../../../../util/snackbar.util';

interface Props {
  pool: Pool
  state: PoolDialogState
  setState: React.Dispatch<React.SetStateAction<PoolDialogState>>
}

export const PoolDepositDialog: React.FC<Props> = (props: Props) => {
  const [amount, setAmount] = useState<string>("");
  const handleClose = () => {
    setAmount("");
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
      throw new Error("Not implemented yet.");
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
        <ClickOnceButton size="medium" color="primary" callbackFn={handleConfirmAsync}>
          Confirm
        </ClickOnceButton>
      </DialogActions>
    </Dialog>
  )
}
