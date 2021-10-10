import { Box, Chip, Grid, Typography } from '@mui/material';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { BootstrapTooltip } from '../../../common/components/tooltip';
import { getEmitter } from '../../../../util/emitter.util';
import { GlobalEvent } from '../../../../util/types';

export const Footer: React.FC = () => {
  const [networkBlockHeight, setNetworkBlockHeight] = useState(new BigNumber(0))
  const emitter = getEmitter();

  useEffect(() => {
    const handleEvent = (height: BigNumber) => {
      setNetworkBlockHeight(height);
    }
    emitter.on(GlobalEvent.NetworkBlockHeight, handleEvent)
    return () => {
      emitter.off(GlobalEvent.NetworkBlockHeight, handleEvent)
    };
  }, [emitter]);

  return (
    <Box sx={{ py: "10px", px: "24px" }}>
      <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
        <Grid item>
          <BootstrapTooltip title="Network block height" placement="top" arrow>
            <Typography variant="caption" sx={{ verticalAlign: "middle", display: "inline-flex" }}>
              <CropSquareIcon sx={{
                color: "gray",
                mr: "2px",
                transform: networkBlockHeight.mod(2).eq(0) ? "rotate(45deg)" : "rotate(0deg)",
                fontSize: "17px"
              }} />
              {networkBlockHeight.toString()}
            </Typography>
          </BootstrapTooltip>
        </Grid>
        <Grid item>
          <BootstrapTooltip title="Version" placement="top" arrow>
            <Chip label={'v' + process.env.REACT_APP_VERSION} variant="outlined" size="small" />
          </BootstrapTooltip>
        </Grid>
      </Grid>
    </Box>
  )
}
