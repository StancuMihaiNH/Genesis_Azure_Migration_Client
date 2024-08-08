"use client";
import Conversation from "@/components/Conversation/Conversation";
import { NextPage } from "next";
import { IPageProps } from "./page.types";

const Page: NextPage<IPageProps> = ({ params }) => {
  const { id } = params;

  return <Conversation id={id} />;
};

export default Page;