import * as React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { getCommonContext } from '../../../../contexts/common';
import { QrCode } from '../qrcode';
import { Box } from '@mui/system';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog: React.FC<Props> = (props: Props) => {
  const { onClose, open } = props;
  const commonContext = getCommonContext();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="xs">
      <DialogTitle>Connect Wallet</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Scan the QR code via Vite Wallet App
        </DialogContentText>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <QrCode text={commonContext.vite.connector?.uri}></QrCode>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
