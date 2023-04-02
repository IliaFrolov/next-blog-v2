import cn from "classnames";
import React, { FC, useCallback } from "react";
import { AiFillGithub } from "react-icons/ai";

interface GitHubButtonProps {
  lightOnly?: boolean;
  onClick?(): void;
}

export const GitHubButton: FC<GitHubButtonProps> = ({ lightOnly, onClick }) => {
  const style = useCallback(() => {
    if (lightOnly) return " text-primary-dark bg-primary";
    return " bg-primary-dark text-primary dark:bg-primary dark:text-primary-dark";
  }, [lightOnly]);
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center space-x-1 px-3 py-2 rounded transition hover:scale-[0.97] duration-100",
        style()
      )}
    >
      <span>Continue with</span>
      <AiFillGithub size={24} />
    </button>
  );
};
