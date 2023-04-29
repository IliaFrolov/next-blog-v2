import AppHead from "@components/common/AppHead";
import UserNav from "@components/common/nav/UserNav";
import cn from "classnames";
import React, { FC, ReactNode } from "react";

interface DefaultLayoutProps {
  title?: string;
  desc?: string;
  children: ReactNode;
  className?: string;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({
  title,
  desc,
  children,
  className,
}) => {
  return (
    <>
      <AppHead title={title} desc={desc} />
      <div
        className={cn(
          "min-h-screen bg-primary dark:bg-primary-dark transition",
          className
        )}
      >
        <UserNav />
        <div className="max-w-4xl mx-auto pt-20 pb-20">{children}</div>
      </div>
    </>
  );
};

export default DefaultLayout;
