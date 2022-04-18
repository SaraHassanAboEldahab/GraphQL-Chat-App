import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split,
} from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { getAccessToken } from "../auth";

const httpUrl = "http://localhost:9000/graphql";
const wsUrl = "ws://localhost:9000/graphql";

//httpLink is for queries and mutations
const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
      operation.setContext({ headers: { authorization: `Bearer ${token}` } });
    }
    return forward(operation);
  }),
  new HttpLink({ uri: httpUrl }),
]);

//wsLink is for subscriptions
const wsLink = new WebSocketLink({
  uri: wsUrl,
  options: {
    //if we make it returns static object the accessToken will be null till the websocket connection starts
    // connectionParams: {
    //   accessToken: getAccessToken(),
    // },

    //so we will make it returns function , so the WebSocketLink instance will call this fun. before the websocket connection starts and gets the connectionParams object with the latest accessToken value
    connectionParams: () => ({
      accessToken: getAccessToken(),
    }),
    lazy: true, // when it's true that means it will only make websocket connection when it's needed that is the first time we request graphql subscription ,the default value is false which means apollo-client will start websocket connection as soon as the app is loaded.
    reconnect: true, //this means if the websocket connection is interrupted for any reason , the client will try to reconnect
  },
});

const isSubscription = (operation) => {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === "OperationDefinition" &&
    definition.operation === "subscription"
  );
};
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: split(isSubscription, wsLink, httpLink), //if the operation is subscription then use the wsLink , else use the httpLink
  defaultOptions: { query: { fetchPolicy: "no-cache" } },
});

export default client;
