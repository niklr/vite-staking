import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { GET_NETWORK_BLOCK_HEIGHT_QUERY } from '../../../../queries';
import { GetNetworkBlockHeight } from '../../../../queries/__generated__/GetNetworkBlockHeight';
import { getEmitter } from '../../../../util/emitter.util';

export const Network: React.FC = () => {
  const emitter = getEmitter();
  const query = useQuery<GetNetworkBlockHeight>(GET_NETWORK_BLOCK_HEIGHT_QUERY, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    let interval = setInterval(async () => {
      await query.refetch();
      if (query.data?.networkBlockHeight) {
        emitter.emitNetworkBlockHeight(query.data.networkBlockHeight);
      }
    }, 1000)
    return () => {
      clearInterval(interval);
    }
  })

  return (
    <>
    </>
  )
}
