import { styled } from '@mui/material';
import React from 'react';

const MainWrapperStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  height: 100vh;
`,
);

export const MainWrapper: React.FC = props => {
  const { children, ...restProps } = props

  return <MainWrapperStyled {...restProps}>{children}</MainWrapperStyled>
}
