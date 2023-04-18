import "shared/fonts/Trap.css";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import NextProgress from "next-progress";
import type { AppProps } from "next/app";

import { globalStyles } from "../shared/styles";
import Logo from "components/Logo";
import Head from "next/head";
import { title } from "./_document";

const cache = createCache({ key: "next" });

const App = ({ Component, pageProps, router }: AppProps) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <CacheProvider value={cache}>
      {globalStyles}
      <NextProgress delay={300} options={{ showSpinner: false }} color="#00c8f8" />
      <Logo logoType="large" heightInPx={32} right={["/", "/api-docs"].includes(router.pathname)} />
      <Component {...pageProps} />
    </CacheProvider>
  </>
);

export default App;
