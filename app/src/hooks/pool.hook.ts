import { useQuery, WatchQueryFetchPolicy } from "@apollo/client";
import { GET_POOL_QUERY, GET_POOL_USER_INFO_QUERY } from "../queries/pool";
import { GetPool, GetPoolVariables } from "../queries/__generated__/GetPool";
import { GetPoolUserInfo, GetPoolUserInfoVariables } from "../queries/__generated__/GetPoolUserInfo";
import { Pool, PoolUserInfo } from "../util/types";

export const usePoolHook = (id: number, account?: Maybe<string>, fetchPolicy: WatchQueryFetchPolicy = "network-only") => {
  const poolQuery = useQuery<GetPool, GetPoolVariables>(GET_POOL_QUERY, {
    variables: {
      id: id.toString()
    },
    fetchPolicy
  });
  const userInfoQuery = useQuery<GetPoolUserInfo, GetPoolUserInfoVariables>(GET_POOL_USER_INFO_QUERY, {
    variables: {
      poolId: id,
      account
    },
    fetchPolicy
  });

  const error = poolQuery.error || userInfoQuery.error;
  const loading = poolQuery.loading || userInfoQuery.loading;

  return {
    poolQuery,
    userInfoQuery,
    pool: poolQuery.data?.pool as Maybe<Pool>,
    userInfo: userInfoQuery.data?.poolUserInfo as Maybe<PoolUserInfo>,
    error,
    loading
  }
}