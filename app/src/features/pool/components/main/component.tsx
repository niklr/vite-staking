import { useQuery } from '@apollo/client';
import { Container, Grid } from '@mui/material';
import React from 'react';
import { useConnectedWeb3Context } from '../../../../contexts/connectedWeb3';
import { GET_POOLS_QUERY } from '../../../../queries';
import { GetPools, GetPoolsVariables } from '../../../../queries/__generated__/GetPools';
import { Pool } from '../../../../util/types';
import { Alert } from '../../../common/components/alert';
import { PoolFilter } from '../filter';
import { PoolList } from '../list';

export const Pools: React.FC = () => {
  const context = useConnectedWeb3Context();
  const poolQuery = useQuery<GetPools, GetPoolsVariables>(GET_POOLS_QUERY, {
    variables: {
      account: context.account
    },
    fetchPolicy: 'network-only'
  });

  const error = poolQuery.error

  if (error) {
    return (
      <Grid item key="1" xs={12} md={6}>
        <Alert message={error.message} type="warning"></Alert>
      </Grid>
    );
  }

  return (
    <Container sx={{ pt: 6, pb: 6 }} maxWidth="lg">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <PoolFilter></PoolFilter>
        <PoolList account={context.account} pools={poolQuery.data?.pools as Maybe<Pool[]>}></PoolList>
      </Grid>
    </Container>
  );
}