import { createYoga } from "graphql-yoga";

import { schema } from "./schema.ts";
import { AuthService } from "../../services/auths.service.ts";
import type { GraphQLContext } from "../../types/GraphQLContext.ts";

function graphQLContextFromRequest(request: Request): GraphQLContext {
  // Retrieve the Authorization header
  const authHeader = request.headers.get("authorization") || "";

  // Extract the token after "Bearer "
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : "";

  // No token: anonymous request
  if (!token) {
    return {};
  }

  try {
    const jwt = AuthService.verifyToken(token);

    return { userJWT: jwt };
  } catch {
    // Invalid or expired token: anonymous request
    return {};
  }
}

export const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  cors: false,
  maskedErrors: process.env.NODE_ENV === "production",
  context: ({ request }): GraphQLContext =>
    graphQLContextFromRequest(request),
});