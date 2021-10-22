import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { getViteClient } from '../../../../clients/vite.client';
import { getEmitter } from '../../../../util/emitter.util';
import { GlobalEvent } from '../../../../util/types';
import { QrCode } from '../qrcode';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export const LoginDialog: React.FC<Props> = (props: Props) => {
  const { onClose, open, setOpen } = props;
  const viteClient = getViteClient();
  const emitter = getEmitter();

  useEffect(() => {
    const handleEvent = (open: boolean) => {
      setOpen(open)
    }
    emitter.on(GlobalEvent.ConnectWalletDialog, handleEvent)
    return () => {
      emitter.off(GlobalEvent.ConnectWalletDialog, handleEvent)
    };
  }, [emitter, setOpen]);

  const handleClose = () => {
    onClose();
  };

  if (!viteClient.connector) {
    return (
      <>
      </>
    )
  }

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs">
      <DialogTitle>Connect Wallet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Scan the QR code via Vite Wallet App
        </DialogContentText>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <QrCode text={viteClient.connector?.uri}></QrCode>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
