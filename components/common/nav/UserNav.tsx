import Link from "next/link";
import React, { FC } from "react";
import Logo from "../Logo";
import { APP_NAME } from "../AppHead";
import { HiLightBulb } from "react-icons/Hi";
import { GitHubButton } from "@components/buttons";
import ProfileHead from "../ProfileHead";
import DropdownOptions, { Options } from "../DropdownOptions";

interface UserNavProps {}

const UserNav: FC<UserNavProps> = ({}) => {
  const dropDownOptions: Options = [
    { label: "Dashboard", onClick() {} },
    { label: "Logout", onClick() {} },
  ];
  return (
    <div className="flex items-center justify-between bg-primary-dark p-3 mb-20 fixed w-full z-10">
      <Link href={"/"}>
        <div className="flex space-x-2 text-highlight-dark">
          <Logo className="fill-highlight-dark" />
          <span className="text-xl font-semibold">{APP_NAME}</span>
        </div>
      </Link>
      <div className="flex items-center space-x-5">
        <button className="dark:text-secondary-dark text-secondary-light">
          <HiLightBulb size={34} className="" />
        </button>
        {/* <GitHubButton lightOnly onClick={() => console.log("click")} /> */}
        <DropdownOptions
          options={dropDownOptions}
          head={<ProfileHead nameInitial="N" lightOnly />}
        />
      </div>
    </div>
  );
};

export default UserNav;
