"use client";
import Conversation from "@/components/Conversation";
import { AppContext } from "@/context";
import { useTopicsQuery } from "@/graphql/__generated__/schema";
import { useContext } from "react";

export default function Home() {
  const { topicFilterPin, topicFilterSortAsc, search: searchContext } = useContext(AppContext);

  const { data } = useTopicsQuery({
    variables: {
      search: "",
      asc: topicFilterSortAsc,
      pinned: topicFilterPin,
    }
  });

  const topics = data?.topics || [];

  return <Conversation id={topics?.length ? topics[0]?.id || "1" : "1"} />;
}