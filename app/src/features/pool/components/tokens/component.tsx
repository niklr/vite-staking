import { Avatar, Badge, Grid, styled, Typography } from '@mui/material';
import React from 'react';

export const Tokens: React.FC = () => {
  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 30,
    height: 30,
    border: `2px solid ${theme.palette.background.paper}`,
  }));
  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <SmallAvatar alt="VITE" src="/static/images/avatar/1.jpg" />
          }
        >
          <Avatar alt="BAN" src="/static/images/avatar/2.jpg" sx={{ width: 50, height: 50 }} />
        </Badge>
      </Grid>
      <Grid item>
        <Typography variant="subtitle1">
          Earn BAN
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Stake VITE
        </Typography>
      </Grid>
    </Grid>
  );
}