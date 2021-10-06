import React from 'react';
import { Box, Button, Container, Stack, styled, Typography } from '@mui/material';
import { CommonConstants } from '../../../../common/constants';

const HeroContent = styled('div')(
  ({ theme }) => `
  background-color: ${theme.palette.background.paper};
  padding: ${theme.spacing(1, 0, 0)};
`,
);

export const Hero = () => {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <img src={"./icon.png"} alt="logo" width="100px" />
      </Box>
      <HeroContent>
        <Container maxWidth="sm">
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            {CommonConstants.APP_NAME}
          </Typography>
        </Container>
      </HeroContent>
      <Stack spacing={2} sx={{ mt: 6 }} direction="row">
        <Button variant="contained" color="primary">
          Create pool
        </Button>
      </Stack>
    </>
  );
}
