export const title = "TTR Guide - Tools and Technologies Research guide",
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
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          {/* <!--  Basic Tags --> */}
          <title>{title}</title>
          <link rel="icon" href="/favicon.ico" />
          <meta charSet="UTF-8" />
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />

          {/* <!--  Essential META Tags --> */}
          <meta property="og:title" content={title} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://ttr.guide/metadata/miniature.png"
          />
          <meta property="og:url" content="https://ttr.guide/" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* <!--  Non-Essential, But Recommended --> */}
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content={name} />
          <meta name="twitter:image:alt" content="-" />
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
