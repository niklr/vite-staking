import { Container, styled } from '@mui/material';
import * as React from 'react';

const MainScrollStyled = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  padding-bottom: 15px;
  padding-top: 30px;
  overflow: auto;
  overflow-x: hidden;
`,
);

const MainScrollInner = styled('div')(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
`,
);

export const MainScroll: React.FC = props => {
  const { children, ...restProps } = props

  return (
    <MainScrollStyled {...restProps}>
      <Container maxWidth="lg">
        <MainScrollInner>{children}</MainScrollInner>
      </Container>
    </MainScrollStyled>
  )
}
