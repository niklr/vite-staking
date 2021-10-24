import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import BigNumber from 'bignumber.js';
import { GraphQLScalarType } from 'graphql';
import { getCommonContext } from '../contexts/common';
import { IDataSource } from '../datasources';
import { PoolMutations } from '../mutations';
import { NetworkQueries, PoolQueries, TokenQueries } from '../queries';
import { AccountQueries } from '../queries/account';

export type ApolloContext = {
  cache: InMemoryCache,
  client: ApolloClientWrapper,
  clientAwareness: any,
  getCacheKey: (obj: any) => string | undefined
}

export class ApolloClientWrapper extends ApolloClient<NormalizedCacheObject> {
  get datasource(): IDataSource {
    return getCommonContext().datasource;
  }
}

const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
      }
    }
  }
});

const bigNumberScalar = new GraphQLScalarType({
  name: 'BigNumber',
  description: 'BigNumber custom scalar type',
  serialize(value: BigNumber) {
    return value.toString();
  },
  parseValue(value: string) {
    return new BigNumber(value);
  }
});

const resolvers: any = {
  BigNumber: bigNumberScalar,
  Query: {
    ...AccountQueries,
    ...NetworkQueries,
    ...PoolQueries,
    ...TokenQueries
  },
  Mutation: {
    ...PoolMutations
  }
};

// https://www.apollographql.com/docs/react/networking/authentication/#header
const client = new ApolloClientWrapper({
  // link: authLink.concat(httpLink),
  cache: cache,
  resolvers,
  headers: {
    'client-name': process.env.REACT_APP_NAME || 'client',
    'client-version': process.env.REACT_APP_VERSION || '0',
  },
})

export const getApolloClient = () => {
  return client;
}