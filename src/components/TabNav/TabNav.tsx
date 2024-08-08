import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ITabNavProps, TabNavLink } from "./TabNav.types";


const TabNav = (props: ITabNavProps) => {
  const pathname: string = usePathname();
  return (
    <div className={"flex gap-2"}>
      {props.links.map((link: TabNavLink, index: number) => (
        <Link
          key={index}
          href={link.href}
          className={classNames("px-4 py-2 cursor-pointer", {
            "border-b-2 border-[#132e53]": pathname === link.href,
          })}
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};

export default TabNav;