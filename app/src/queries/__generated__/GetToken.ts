/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetToken
// ====================================================

export interface GetToken_token {
  __typename: "Token";
  id: string;
  name: string;
  symbol: string;
  originalSymbol: string;
  decimals: number;
  iconUrl: string;
  url: string;
}

export interface GetToken {
  token: GetToken_token;
}

export interface GetTokenVariables {
  id: string;
}
