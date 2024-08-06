import { Constants } from "@/utils/constants";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React from "react";

const httpLink = createHttpLink({
  uri: Constants.NEXT_PUBLIC_GRAPHQL_URL
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