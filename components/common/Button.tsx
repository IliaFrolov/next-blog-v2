import Link from "next/link";
import React, { FC } from "react";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?(): void;
}

const Button: FC<ButtonProps> = ({ children, href, ...props }) => {
  const style =
    "font-semibold text-secondary-dark bg-transparent dark:text-secondary-light opacity-75 hover:opacity-100 p-1 rounded-sm";
  if (href)
    return (
      <Link href={href} className={style} {...props}>
        {children}
      </Link>
    );
  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
};

export default Button;
