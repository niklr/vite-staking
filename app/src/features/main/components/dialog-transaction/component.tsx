import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React, { useEffect, useState } from 'react';
import { getEmitter } from '../../../../util/emitter.util';
import { GlobalEvent } from '../../../../util/types';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const ConfirmTransactionDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const emitter = getEmitter();

  useEffect(() => {
    const handleEvent = (open: boolean) => {
      setOpen(open)
    }
    emitter.on(GlobalEvent.ConfirmTransactionDialog, handleEvent)
    return () => {
      emitter.off(GlobalEvent.ConfirmTransactionDialog, handleEvent)
    };
  }, [emitter, setOpen])

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      style={{ zIndex: 9999 }}
    >
      <DialogTitle>ViteConnect</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please confirm transaction on VITE Wallet App
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
