import "shared/fonts/Trap.css";
import "shared/fonts/MakeSans.css";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import NextProgress from "next-progress";

import { globalStyles } from "../shared/styles";

const cache = createCache({ key: "next" });

const App = ({ Component, pageProps }) => (
  <CacheProvider value={cache}>
    {globalStyles}
    <NextProgress delay={300} options={{ showSpinner: false }} color="#00c8f8" />
    <Component {...pageProps} />
  </CacheProvider>
);

export default App;
