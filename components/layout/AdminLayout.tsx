import Link from "next/link";
import { FC, ReactNode } from "react";
import {
  AiOutlineDashboard,
  AiOutlineContainer,
  AiOutlineTeam,
  AiOutlineMail,
  AiOutlineContacts,
  AiOutlineFileAdd,
} from "react-icons/ai";

import AdminNav from "@components/common/nav/AdminNav";
import AppHead from "@components/common/AppHead";
import cn from "classnames";

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
}

const navItems = [
  { href: "/admin", icon: AiOutlineDashboard, label: "Dashboard" },
  { href: "/admin/posts", icon: AiOutlineContainer, label: "Posts" },
  { href: "/admin/users", icon: AiOutlineTeam, label: "Users" },
  { href: "/admin/comments", icon: AiOutlineMail, label: "Comments" },
  { href: "/admin/contact", icon: AiOutlineContacts, label: "Contact" },
];

const AdminLayout: FC<Props> = ({
  title,
  children,
  className,
}): JSX.Element => {
  return (
    <>
      <AppHead title={title} />
      <div className="flex ">
        <AdminNav navItems={navItems} />
        <div className="flex-1 p-4">
          <div className={cn("max-w-4xl mx-auto", className)}>{children}</div>
        </div>
        {/* create button */}
        <Link
          href="/admin/posts/create"
          className="bg-secondary-dark dark:bg-secondary-light text-primary dark:text-primary-dark fixed z-10 right-10 bottom-10 p-3 rounded-full hover:scale-90 shadow-sm transition"
        >
          <AiOutlineFileAdd size={24} />
        </Link>
      </div>
    </>
  );
};

export default AdminLayout;
