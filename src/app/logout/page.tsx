"use client";
import { Constants } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const navigate = useRouter();
  useEffect(() => {
    localStorage.removeItem(`${Constants.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`);
    navigate.push("/login");
  }, [navigate]);
  return (
    <div
      className={"flex flex-col items-center justify-center w-full h-screen"}
    >
      <p className={"text-2xl font-semibold text-gray-800"}>Logging out...</p>
    </div>
  );
};

export default Page;