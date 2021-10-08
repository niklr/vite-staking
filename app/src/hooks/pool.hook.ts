import { useQuery } from "@apollo/client";
import { GET_POOL_QUERY } from "../queries/pool";
import { GetPool, GetPoolVariables } from "../queries/__generated__/GetPool";
import { Pool } from "../util/types";

export const usePoolHook = (id: number) => {
  const poolQuery = useQuery<GetPool, GetPoolVariables>(GET_POOL_QUERY, {
    variables: {
      id: id.toString()
    },
    fetchPolicy: 'network-only'
  });

  const error = poolQuery.error;
  const loading = poolQuery.loading;

  return {
    poolQuery,
    pool: poolQuery.data?.pool as Maybe<Pool>,
    error,
    loading
  }
}