import { GitHubButton } from "@components/buttons";
import { NextPage } from "next";

interface SigninProps {}

const Signin: NextPage<SigninProps> = ({}) => {
  return (
    <div className="h-screen flex items-center justify-center bg-primary dark:bg-primary-dark">
      <GitHubButton />
    </div>
  );
};

export default Signin;
