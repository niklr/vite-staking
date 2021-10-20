import CropSquareIcon from '@mui/icons-material/CropSquare';
import { Box, Chip, Grid, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { getEmitter } from '../../../../util/emitter.util';
import { GlobalEvent } from '../../../../util/types';
import { BootstrapTooltip } from '../../../common/components/tooltip';

export const Footer: React.FC = () => {
  const [networkBlockHeight, setNetworkBlockHeight] = useState(new BigNumber(0))
  const [rotated, setRotated] = useState(false)
  const emitter = getEmitter();

  useEffect(() => {
    const handleEvent = (height: BigNumber) => {
      const heightString = height.toString();
      let heightRef = height;
      if (heightString.length > 1) {
        heightRef = new BigNumber(heightString.substr(heightString.length - 1, heightString.length))
      }
      setRotated(heightRef.mod(2).eq(0));
      setNetworkBlockHeight(height);
    }
    emitter.on(GlobalEvent.NetworkBlockHeightChanged, handleEvent)
    return () => {
      emitter.off(GlobalEvent.NetworkBlockHeightChanged, handleEvent)
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
                transform: rotated ? "rotate(45deg)" : "rotate(0deg)",
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
