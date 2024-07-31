"use client";
import Conversation from "@/components/Conversation";
import { AppContext } from "@/context";
import { useTopicsQuery } from "@/graphql/__generated__/schema";
import { Constants } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(Constants.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <Conversation id={topics?.length ? topics[0]?.id || "1" : "1"} />;
}