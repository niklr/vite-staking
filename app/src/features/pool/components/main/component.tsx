import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_TOKEN_QUERY } from '../../../../queries';
import { GetToken, GetTokenVariables } from '../../../../queries/__generated__/GetToken';
import { PoolList } from '../list';

export const Pools: React.FC = () => {
  const contributionQuery = useQuery<GetToken, GetTokenVariables>(GET_TOKEN_QUERY, {
    variables: {
      id: "tti_5649544520544f4b454e6e40"
    }
  });
  console.log(contributionQuery.data?.token)
  return (
    <>
      <PoolList></PoolList>
    </>
  );
}