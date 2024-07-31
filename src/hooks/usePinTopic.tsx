import { TopicFragmentFragment, TopicFragmentFragmentDoc, TopicsDocument, usePinTopicMutation, useUnpinTopicMutation } from "@/graphql/__generated__/schema";
import { ApolloClient, useApolloClient } from "@apollo/client";
import { getUnixTime } from "date-fns";

const UsePinTopic = () => {
  const client: ApolloClient<object> = useApolloClient();
  const [pin, { loading: pinLoading }] = usePinTopicMutation({});
  const [unpin, { loading: unpinLoading }] = useUnpinTopicMutation({});

  const handlePin = (id: string): void => {
    const topicFragment = client.readFragment<TopicFragmentFragment>({
      id: `Topic:${id}`,
      fragmentName: "TopicFragment",
      fragment: TopicFragmentFragmentDoc,
    });

    if (!topicFragment) {
      return;
    }

    pin(
      {
        variables: { pinTopicId: id },
        optimisticResponse: {
          pinTopic: {
            ...topicFragment,
            pinned: true,
            pinnedAt: getUnixTime(new Date()),
          },
        },
        onCompleted: () => {
          client.refetchQueries({
            include: [TopicsDocument],
          });
        },
      });
  };

  const handleUnpin = (id: string): void => {
    const topicFragment: TopicFragmentFragment | null = client.readFragment<TopicFragmentFragment>({
      id: `Topic:${id}`,
      fragmentName: "TopicFragment",
      fragment: TopicFragmentFragmentDoc,
    });

    if (!topicFragment) {
      return;
    }

    unpin({
      variables: { unpinTopicId: id },
      optimisticResponse: {
        unpinTopic: {
          ...topicFragment,
          pinned: false,
        },
      },
      onCompleted: () => {
        client.refetchQueries({
          include: [TopicsDocument],
        });
      },
    });
  };

  return {
    loading: pinLoading || unpinLoading,
    pin: handlePin,
    unpin: handleUnpin
  };
};

export default UsePinTopic;