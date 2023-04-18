export const title = "TTR Guide - Tools and Technologies Research guide",
  shortTitle = "TTR Guide",
  keywords = "TTR, Tools, Technologies, Research, guide, TTR.Guide",
  name = "TTR Guide",
  description =
    "An all in one platform empowering users with powerful visualisations and analytics for better, informed choice of tools and technologies. Whether you're considering what to learn, teach or just use, here, you will be able to find answers based on data coming straight from job posts, from what the industry needs and uses.";

import Document, {
  DocumentContext,
  DocumentInitialProps,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          {/* <!--  Basic Tags --> */}
          <link rel="icon" href="/icons/favicon.ico" />
          <meta charSet="UTF-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />

          {/* <!--  Essential META Tags --> */}
          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://ttr.guide/icons/miniature.png" />
          <meta property="og:url" content="https://ttr.guide/" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* <!--  Non-Essential, But Recommended --> */}
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content={name} />
          <meta name="twitter:image:alt" content="-" />

          {/* <!--  Favicons --> */}
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
          <link rel="manifest" href="/icons/site.webmanifest" />
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#00c8f8" />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-config" content="/icons/browserconfig.xml" />
          <meta name="theme-color" content="#00c8f8" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
