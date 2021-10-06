import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, styled } from '@mui/material';
import React, { useState } from 'react';
import { getNetworkManager } from '../../../../common/network';
import { Network } from '../../../../util/types';

const NetworksFormControl = styled(FormControl)(
  ({ theme }) => ({
    margin: theme.spacing(1),
    '& .MuiSelect-root': {
      color: theme.palette.common.white
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.common.white
    }
  }));

export const NetworkList: React.FC = () => {
  const networkManager = getNetworkManager()
  const networks = networkManager.getNetworks()
  const [network, setNetwork] = useState<Maybe<Network>>(networkManager.getNetwork())

  const handleChange = (event: SelectChangeEvent) => {
    const selectedNetwork = networks.find(e => e.id.toString() === event.target.value)
    if (selectedNetwork) {
      setNetwork(selectedNetwork)
      networkManager.setNetwork(selectedNetwork)
    }
  }

  return (
    networks.length > 0 ? (
      <NetworksFormControl variant="outlined" size="small">
        <InputLabel id="select-network-label"></InputLabel>
        <Select
          labelId="select-network-label"
          id="select-network-label"
          value={network?.id.toString()}
          onChange={handleChange}
        >
          {networks.map(e => {
            return (
              <MenuItem key={e.id.toString()} value={e.id.toString()}>{e.name}</MenuItem>
            )
          })}
        </Select>
      </NetworksFormControl>
    ) : (
      <></>
    )
  );
}