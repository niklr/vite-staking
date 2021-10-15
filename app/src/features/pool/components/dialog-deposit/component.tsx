import * as React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Pool, PoolDialogState } from '../../../../util/types';

interface Props {
  pool?: Maybe<Pool>
  state: PoolDialogState
  setState: React.Dispatch<React.SetStateAction<PoolDialogState>>
}

export const PoolDepositDialog: React.FC<Props> = (props: Props) => {
  const handleClose = () => {
    props.setState({
      ...props.state,
      open: false
    })
  };

  return (
    <Dialog onClose={handleClose} open={props.state.open}>
      <DialogTitle>Deposit</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.pool?.id}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
