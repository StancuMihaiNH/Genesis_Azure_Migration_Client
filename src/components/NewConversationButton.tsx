import { TopicsDocument, useCreateTopicMutation } from "@/graphql/__generated__/schema";
import { ApolloClient, useApolloClient } from "@apollo/client";
import classNames from "classnames";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const NewConversationButton = (): JSX.Element => {
  const [create, { loading }] = useCreateTopicMutation();
  const router: AppRouterInstance = useRouter();
  const client: ApolloClient<object> = useApolloClient();

  const handleNewTopic = async (): Promise<void> => {
    try {
      const { data } = await create({
        variables: {
          input: {
            name: "",
            description: "",
            tagIds: []
          }
        }
      });
      client.refetchQueries({
        include: [TopicsDocument],
      });
      router.push(`/conversation/${data?.createTopic?.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button disabled={loading}
      className={classNames(
        "bg-[#039fb8] text-white rounded p-2 w-full cursor-pointer",
        { "animate-pulse": loading },
      )}
      onClick={handleNewTopic}>
      New Conversation
    </button>
  );
};

export default NewConversationButton;