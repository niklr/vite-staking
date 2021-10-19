import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Button, Chip, styled, Toolbar, tooltipClasses, Typography } from '@mui/material';
import React from 'react';
import { CommonConstants } from '../../../../common/constants';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { CommonUtil } from '../../../../util/common.util';
import { BootstrapTooltip } from '../../../common/components/tooltip';
import { LoginDialog } from '../../../main/components/login';
import { NetworkList } from '../../../main/components/network-list';

const Root = styled('div')(
  ({ theme }) => `
  flex-grow: 1;
`);

const TitleTypography = styled(Typography)(
  ({ theme }) => `
  flex-grow: 1;
  margin-left: 10px !important;
`);

export const Header: React.FC = (props: any) => {
  const context = useConnectedWeb3Context();
  const [loginOpen, setLoginOpen] = React.useState(false);

  const handleClickLogin = () => {
    setLoginOpen(true);
  };

  const handleClickLogout = () => {
    context.logout();
  };

  const handleLoginClose = () => {
    setLoginOpen(false);
  };

  const truncateAddress = (address?: string) => {
    return CommonUtil.truncateStringInTheMiddle(address, 10, 5)
  }

  return (
    <Root>
      <AppBar position="static" color="primary">
        <Toolbar>
          <img src={"./icon_white.png"} alt="logo" width="30" />
          <TitleTypography variant="h6">
            {CommonConstants.APP_NAME}
          </TitleTypography>
          <NetworkList></NetworkList>
          {context.account ? (
            <>
              <BootstrapTooltip sx={{ [`& .${tooltipClasses.tooltip}`]: { maxWidth: "none" } }} title={context.account} placement="bottom" arrow>
                <Chip sx={{ color: "white", '& .MuiChip-icon': { color: "white" } }} icon={<AccountCircleIcon />} label={truncateAddress(context.account)} variant="outlined" />
              </BootstrapTooltip >
              <Button color="inherit" onClick={handleClickLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleClickLogin}>
                Login
              </Button>
              <LoginDialog open={loginOpen} setOpen={setLoginOpen} onClose={handleLoginClose}></LoginDialog>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Root >
  )
}