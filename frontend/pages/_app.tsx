// import "shared../shared/fonts/Trap.css";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import NextProgress from "next-progress";
import type { AppProps } from "next/app";

import { globalStyles } from "../shared/styles";
import Logo from "components/Logo";
import Head from "next/head";
import { title } from "./_document";
import localFont from "next/font/local";

const cache = createCache({ key: "next" });

const trap = localFont({
  src: [
    {
      path: "../shared/fonts/Trap/Trap-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../shared/fonts/Trap/Trap-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../shared/fonts/Trap/Trap-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../shared/fonts/Trap/Trap-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../shared/fonts/Trap/Trap-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../shared/fonts/Trap/Trap-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../shared/fonts/Trap/Trap-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
  ],
});

const App = ({ Component, pageProps, router }: AppProps) => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <CacheProvider value={cache}>
      {globalStyles(trap)}
      <NextProgress delay={300} options={{ showSpinner: false }} color="#00c8f8" />
      <Logo logoType="large" heightInPx={32} right={["/", "/api-docs"].includes(router.pathname)} />
      <Component {...pageProps} />
    </CacheProvider>
  </>
);

export default App;
