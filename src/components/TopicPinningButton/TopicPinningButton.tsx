import {
  TopicFragmentFragment,
  TopicFragmentFragmentDoc,
} from "@/graphql/__generated__/schema";
import usePinTopic from "@/hooks/usePinTopic";
import { useFragment } from "@apollo/client";
import classNames from "classnames";
import { BsPin } from "react-icons/bs";
import { ITopicPinningButtonProps } from "./TopicPinningButton.types";

const TopicPinningButton = (props: ITopicPinningButtonProps): JSX.Element => {
  const { pin, unpin } = usePinTopic();
  const { data } = useFragment<TopicFragmentFragment>({
    fragment: TopicFragmentFragmentDoc,
    fragmentName: "TopicFragment",
    from: {
      __typename: "Topic",
      id: props.topicId
    },
  });

  const pinned: boolean = data?.pinned ?? false;
  const handleClick = (): void => {
    if (pinned) {
      unpin(props.topicId);
      return;
    }

    pin(props.topicId);
  };

  return (
    <button title={pinned ? "Unpin" : "Pin"}
      onClick={handleClick}
      className={classNames(
        "flex items-center py-2 px-4 rounded-full cursor-pointer text-[#525252]",
        {
          "text-[#525252] bg-gray-200": !pinned,
          "text-[#1a1a1a] bg-gray-400": pinned,
        }
      )}>
      <BsPin /> <span className={"ml-2"}>{pinned ? "Unpin" : "Pin"}</span>
    </button>
  );
};

export default TopicPinningButton;