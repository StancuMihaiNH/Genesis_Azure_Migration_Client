"use client";
import Conversation from "@/components/Conversation";
import { Constants } from "@/utils/constants";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page: NextPage<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem(
      Constants.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "",
    );
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return <Conversation id={id} />;
};

export default Page;
