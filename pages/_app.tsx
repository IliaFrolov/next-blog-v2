import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface MyAppProps {
  session?: Session | null;
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<MyAppProps>) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
