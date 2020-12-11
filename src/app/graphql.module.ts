import { NgModule} from '@angular/core';
import { APOLLO_OPTIONS} from 'apollo-angular';
import { ApolloLink, InMemoryCache, split} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from '@env';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from "@apollo/client/link/error";

const httpsUri = 'https' + environment.API_URL + 'graphql' // URL TO ENDPOINT FOR HTTPS REQUESTS

const wsUri = new WebSocketLink({
  uri: `wss${environment.API_URL}graphql`,
  options: {
    reconnect: false, //TO DO CHANGE TO TRUE
  },
});

export function createApollo(httpLink: HttpLink) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('flavorToken')}`
    },
  }));

  const errorHandler = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
  
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpsLink = ApolloLink.from(
    [
      basic, 
      auth,
      errorHandler,
      httpLink.create({
        uri: httpsUri,
        // withCredentials: true
      }),
    ]);

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({query}) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      );
    },
    wsUri,
    httpsLink,
  );

  const cache = new InMemoryCache({ addTypename: false });

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  };

  return {
    link,
    cache,
    defaultOptions
  }
}

@NgModule({
  exports: [
    HttpClientModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule {}
