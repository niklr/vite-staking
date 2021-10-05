import React from 'react';
import { Hero } from '../../../common/components/hero';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';

export const Main: React.FC = (props: any) => {
  return (
    <MainWrapper>
      <Header />
      <MainScroll>
        <Hero></Hero>
      </MainScroll>
      <Footer />
    </MainWrapper>
  )
}
