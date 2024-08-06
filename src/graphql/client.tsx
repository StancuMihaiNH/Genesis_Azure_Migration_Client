import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";

const httpLink = createHttpLink({
  uri: process.env.APP_API_SERVICE_URL
});

export const authLink = (token: string) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  }));

const createClient = (token: string) =>
  new ApolloClient({
    cache: new InMemoryCache({}),
    link: authLink(token).concat(httpLink),
  });

const GraphQLProvider: React.FC<{ token: string; children: React.ReactNode }> = ({ token, children, }) => {
  const client = React.useMemo(() => createClient(token), [token]);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;