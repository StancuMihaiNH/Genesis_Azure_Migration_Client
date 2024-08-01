"use client";
import Conversation from "@/components/Conversation";
import { NextPage } from "next";

const Page: NextPage<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;

  return <Conversation id={id} />;
};

export default Page;
