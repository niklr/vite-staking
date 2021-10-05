import React from 'react';
import { AppBar, styled, Toolbar, Typography } from '@mui/material';
import { CommonConstants } from '../../../../common/constants';

const Root = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
`,
);

const TitleTypography = styled(Typography)(
  ({ theme }) => `
  flex-grow: 1;
  margin-left: 10px !important;
`,
);

export const HeaderLoading: React.FC = (props: any) => {
  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          {/* <img src={"./logo_white.png"} alt="logo" width="30" /> */}
          <TitleTypography variant="h6">
            {CommonConstants.APP_NAME}
          </TitleTypography>
        </Toolbar>
      </AppBar>
    </Root>
  )
}