import { useSnackbar } from 'notistack';
import React from 'react';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';
import { Pools } from '../../../pool/components/main';

export const Main: React.FC = (props: any) => {
  SnackbarUtil.snackbar = useSnackbar();
  return (
    <MainWrapper>
      <Header />
      <MainScroll>
        <Pools></Pools>
      </MainScroll>
      <Footer />
    </MainWrapper>
  )
}
