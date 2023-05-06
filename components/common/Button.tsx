import { types } from "joi";
import Link from "next/link";
import React, { FC } from "react";
import { twMerge } from 'tailwind-merge'

type ButtonProps<T> = T & {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?(): void;
}

const Button = <T,>(props: ButtonProps<T>) => {
  const { children, href, className, onClick, ...restProps } = props;
  const style =
    `font-semibold text-secondary-dark bg-transparent dark:text-secondary-light opacity-75 hover:opacity-100 p-1 rounded 
    disabled:hover:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed`;
  if (href)
    return (
      <Link href={href} className={twMerge(style, className)} {...restProps}>
        {children}
      </Link>
    );
  return (
    <button className={twMerge(style, className)} onClick={onClick} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
