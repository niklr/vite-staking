import { useQuery } from '@apollo/client';
import { Box, Chip, Grid, Typography } from '@mui/material';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { GET_NETWORK_BLOCK_HEIGHT_QUERY } from '../../../../queries';
import { GetNetworkBlockHeight } from '../../../../queries/__generated__/GetNetworkBlockHeight';
import { BootstrapTooltip } from '../../../common/components/tooltip';

export const Footer: React.FC = () => {
  const [networkBlockHeight, setNetworkBlockHeight] = useState(new BigNumber(0))
  const [networkBlockHeightToggle, setNetworkBlockHeightToggle] = useState(false)
  const query = useQuery<GetNetworkBlockHeight>(GET_NETWORK_BLOCK_HEIGHT_QUERY, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    let interval = setInterval(async () => {
      await query.refetch();
      if (query.data?.networkBlockHeight) {
        setNetworkBlockHeight(query.data.networkBlockHeight);
        setNetworkBlockHeightToggle(!networkBlockHeightToggle);
      }
    }, 1000)
    return () => {
      clearInterval(interval);
    }
  })

  return (
    <Box sx={{ py: "10px", px: "24px" }}>
      <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
        <Grid item>
          <BootstrapTooltip title="Network block height" placement="top" arrow>
            <Typography variant="caption" sx={{ verticalAlign: "middle", display: "inline-flex" }}>
              <CropSquareIcon sx={{
                color: "gray",
                mr: "2px",
                transform: networkBlockHeightToggle ? "rotate(45deg)" : "rotate(0deg)",
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
