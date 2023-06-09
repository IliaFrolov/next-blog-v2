import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import Router from 'next/router';
import nProgress from 'nprogress';

interface MyAppProps {
  session?: Session | null;
}
nProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => { nProgress.start() })
Router.events.on('routeChangeComplete', () => { nProgress.done() })
Router.events.on('routeChangeError', () => { nProgress.done() })


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
