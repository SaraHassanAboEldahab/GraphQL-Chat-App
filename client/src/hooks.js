import {
  messagesQuery,
  addMessageMutation,
  messageAddedSubscription,
} from "./graphql/queries";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";

export const useChatMessages = () => {
  //after we write new msg this component will rerender and useQuery returns the updated messages
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  //when we use useSubscription hook we don't need to make unsubscribe, it's done automatically
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      //here we write data to the cache directly , to write data to the cache we make sure the data has the same structure as in the query we used to retrieve that data
      client.writeData({
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded),
        },
      });
    },
  });
  const [addMessage] = useMutation(addMessageMutation);
  return {
    messages,
    addMessage: (text) => addMessage({ variables: { input: { text } } }),
  };
};
