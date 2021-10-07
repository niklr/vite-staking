import { useQuery } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import { GET_TOKEN_QUERY } from '../../../../queries';
import { GetToken, GetTokenVariables } from '../../../../queries/__generated__/GetToken';
import { SnackbarUtil } from '../../../../util/snackbar.util';
import { Footer } from '../../../layout/components/footer';
import { Header } from '../../../layout/components/header';
import { MainScroll } from '../../../layout/components/main-scroll';
import { MainWrapper } from '../../../layout/components/main-wrapper';
import { Pools } from '../../../pool/components/main';

export const Main: React.FC = (props: any) => {
  SnackbarUtil.snackbar = useSnackbar();

  const contributionQuery = useQuery<GetToken, GetTokenVariables>(GET_TOKEN_QUERY, {
    variables: {
      id: "tti_5649544520544f4b454e6e40"
    }
  });
  console.log(contributionQuery.data?.token)

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
