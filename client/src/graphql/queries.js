import gql from "graphql-tag";
import client from "./client";

export const messagesQuery = gql`
  query MessagesQuery {
    messages {
      id
      from
      text
    }
  }
`;

export const addMessageMutation = gql`
  mutation AddMessageMutation($input: MessageInput!) {
    message: addMessage(input: $input) {
      id
      from
      text
    }
  }
`;

export const messageAddedSubscription = gql`
  subscription {
    messageAdded {
      id
      from
      text
    }
  }
`;

//////////////////////////////////// before using hooks //////////////////////////////////////
// export async function addMessage(text) {
//   const { data } = await client.mutate({
//     mutation: addMessageMutation,
//     variables: { input: { text } },
//   });
//   return data.message;
// }

// export async function getMessages() {
//   const { data } = await client.query({ query: messagesQuery });
//   return data.messages;
// }

// export function onMessageAdded(handleMessage) {
//   const observable = client.subscribe({ query: messageAddedSubscription }); //this initiate the graphql subscription with the server (which means the server will send messages to the client over websocket) , so it will receives data from the server and returns Observable
//   observable.subscribe(({ data }) => handleMessage(data.messageAdded)); //this is to dispatch messages to our component
// }
