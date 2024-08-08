import { Maybe } from "@/graphql/__generated__/schema";
import Image from "next/image";
import { IAvatarProps } from "./Avatar.types";


const Avatar = (props: IAvatarProps): JSX.Element => {
  if (props.role === "assistant") {
    return (
      <div className="flex w-10 h-10 rounded-full items-center justify-center bg-[#039fb8]">
        <Image src="/logo-nh.png" alt="NH" width={20} height={20} />
      </div>
    );
  }

  const avatarUrl: Maybe<string> | undefined = props.user?.avatarUrl;
  const firstCharOfName: string = props.user?.name ? props.user.name[0].toUpperCase() : "U";

  return (
    <div className="flex w-10 h-10 rounded-full bg-[#dee22a] items-center justify-center font-bold">
      {avatarUrl
        ? <img
          className="w-full h-full object-cover rounded-full"
          alt={props.user?.name ?? ""}
          src={avatarUrl}
        />
        : firstCharOfName
      }
    </div>
  );
};

export default Avatar;