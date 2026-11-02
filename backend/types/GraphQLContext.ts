import type { UserJWT } from "./auths.ts";

export interface GraphQLContext {
  userJWT?: UserJWT;
}