
import { Typography } from '@mui/material';
import { Footer } from '../../../layout/components/footer';
import { HeaderLoading } from '../../../layout/components/header-loading';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';

export const MainLoading = () => {

  return (
    <MainWrapper>
      <HeaderLoading />
      <MainScroll>
        <Typography>Loading...</Typography>
      </MainScroll>
      <Footer />
    </MainWrapper>
  )
}
