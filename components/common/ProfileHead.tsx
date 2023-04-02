import cn from "classnames";
import Image from "next/image";
import React, { FC, useMemo } from "react";
import { AiFillCaretDown } from "react-icons/ai";

interface ProfileHeadProps {
  lightOnly?: boolean;
  avatar?: string;
  nameInitial?: string;
}

const ProfileHead: FC<ProfileHeadProps> = ({
  lightOnly,
  avatar,
  nameInitial,
}) => {
  const style = useMemo(() => {
    if (lightOnly) return " text-primary-dark bg-primary";
    return "bg-primary-dark text-primary dark:bg-primary dark:text-primary-dark";
  }, [lightOnly]);

  return (
    // I would like to have button instead of div, but it leads to error
    <div className="flex items-center">
      <div
        className={cn(
          "flex items-center relative overflow-hidden justify-center rounded-full w-12 h-12 select-none",
          style
        )}
      >
        <span className="">
          {avatar ? <Image alt="avatar" src={avatar} fill /> : nameInitial}
        </span>
      </div>
      <AiFillCaretDown
        className={
          lightOnly ? "text-primary" : "dark:text-primary text-primary-dark"
        }
      />
    </div>
  );
};

export default ProfileHead;
