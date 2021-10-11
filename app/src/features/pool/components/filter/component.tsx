import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Switch, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { DefaultPoolFilterValues, PoolSortTypes } from "../../../../common/constants";
import { getEmitter } from "../../../../util/emitter.util";
import { PoolFilterValues } from "../../../../util/types";

export const PoolFilter: React.FC = () => {
  const [values, setValues] = useState<PoolFilterValues>(DefaultPoolFilterValues);
  const emitter = getEmitter();

  const emitEvent = (oldValues: PoolFilterValues, newValues: PoolFilterValues) => {
    emitter.emitPoolFilterValuesChanged(oldValues, newValues);
  }

  const handleSortByChange = (event: SelectChangeEvent) => {
    const newValues = { ...values, sortBy: event.target.value };
    setValues(newValues);
    emitEvent(values, newValues);
  };

  const handleChange = (prop: keyof PoolFilterValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = { ...values, [prop]: event.target.value };
    setValues(newValues);
    emitEvent(values, newValues);
  };

  const handleCheckedChange = (prop: keyof PoolFilterValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = { ...values, [prop]: event.target.checked };
    setValues(newValues);
    emitEvent(values, newValues);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={12} md={10}>
        <Grid container>
          <Grid item xs sx={{ mr: 2 }}>
            <FormGroup>
              <Stack direction="row" alignItems="center" spacing={2}>
                <FormControlLabel control={<Checkbox
                  checked={values.stakedOnly}
                  onChange={handleCheckedChange('stakedOnly')} />} label="Staked only" />
                <Stack direction="row" alignItems="center" >
                  <Typography>Ended</Typography>
                  <Switch checked={values.showLive} onChange={handleCheckedChange('showLive')} />
                  <Typography>Live</Typography>
                </Stack>
              </Stack>
            </FormGroup>
          </Grid>
          <Grid item>
            <FormGroup>
              <Stack direction="row" alignItems="center" spacing={2}>
                <FormControl size="small" sx={{ minWidth: "120px" }}>
                  <InputLabel id="sortby-select-label">Sort by</InputLabel>
                  <Select
                    labelId="sortby-select-label"
                    id="sortby-select"
                    value={values.sortBy}
                    label="Sort by"
                    onChange={handleSortByChange}
                  >
                    {PoolSortTypes.map(e => (
                      <MenuItem key={e.type} value={e.type}>{e.name}&nbsp;</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  id="search"
                  value={values.search}
                  label="Search"
                  variant="outlined"
                  size="small"
                  autoComplete="off"
                  onChange={handleChange('search')}
                />
              </Stack>
            </FormGroup>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
