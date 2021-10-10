import { useQuery } from '@apollo/client';
import { Container, Grid } from '@mui/material';
import React from 'react';
import { GET_TOTAL_POOLS_QUERY } from '../../../../queries/pool';
import { GetTotalPools } from '../../../../queries/__generated__/GetTotalPools';
import { FormatUtil } from '../../../../util/format.util';
import { Alert } from '../../../common/components/alert';
import { PoolFilter } from '../filter';
import { PoolList } from '../list';

export const Pools: React.FC = () => {
  const totalPoolsQuery = useQuery<GetTotalPools>(GET_TOTAL_POOLS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
  });

  const error = totalPoolsQuery.error;
  const loading = totalPoolsQuery.loading;

  return (
    <Container sx={{ pt: 6, pb: 6 }} maxWidth="lg">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {loading || error ? (
          <Grid item key='1' xs={12} md={6}>
            {loading ? (
              <Alert message="Loading..." type="default" ></Alert>
            ) : (
              <Alert message={FormatUtil.formatMessage(error)} type="warning"></Alert>
            )}
          </Grid>
        ) : (
          <>
            <PoolFilter></PoolFilter>
            <PoolList total={totalPoolsQuery.data?.totalPools ?? 0}></PoolList>
          </>
        )}
      </Grid>
    </Container>
  );
}