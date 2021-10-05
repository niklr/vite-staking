import { styled, Typography } from '@mui/material';

const Root = styled('div')(
  ({ theme }) => `
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 24px;
  padding-right: 24px;
  text-align: right;
`,
);

export const Footer = () => {
  return (
    <>
      <Root>
        <Typography>v{process.env.REACT_APP_VERSION}</Typography>
      </Root>
    </>
  )
}
