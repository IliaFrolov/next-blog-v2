import Link from "next/link";
import React, { FC } from "react";
import Logo from "../Logo";
import { APP_NAME } from "../AppHead";
import { HiLightBulb } from "react-icons/Hi";
import { GitHubButton } from "@components/buttons";
import ProfileHead from "../ProfileHead";
import DropdownOptions, { Options } from "../DropdownOptions";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { UserProfile } from "utils/types";

interface UserNavProps {}
const defaultOptions: Options = [
  {
    label: "Logout",
    async onClick() {
      await signOut();
    },
  },
];
const UserNav: FC<UserNavProps> = ({}) => {
  const router = useRouter();
  const { data, status } = useSession();
  const isAuth = status === "authenticated" && !!data;
  const profile = data?.user as UserProfile | undefined;
  const isAdmin = profile?.role === "admin";
  if (isAdmin) {
    defaultOptions.push();
  }
  const dropDownOptions = isAdmin
    ? [
        {
          label: "Dashboard",
          onClick() {
            router.push("/admin");
          },
        },
        ...defaultOptions,
      ]
    : defaultOptions;

  const handleLoginWithGitHub = async () => {
    await signIn("github");
  };
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
        {isAuth ? (
          <DropdownOptions
            options={dropDownOptions}
            head={
              <ProfileHead
                nameInitial={data.user?.name?.split("")[0].toUpperCase()}
                lightOnly
                avatar={data.user?.image as string}
              />
            }
          />
        ) : (
          <GitHubButton lightOnly onClick={handleLoginWithGitHub} />
        )}
      </div>
    </div>
  );
};

export default UserNav;
