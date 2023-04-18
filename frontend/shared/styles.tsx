import { css, Global } from "@emotion/react";
import { NextFont } from "next/dist/compiled/@next/font";

export const globalStyles = (font: NextFont) => (
  <Global
    styles={css`
      html,
      body {
        padding: 0;
        margin: 0;
        min-height: 100%;
        background: black;

        font-family: ${font.style.fontFamily};
        font-weight: 400;
        color: white;
      }

      * {
        font-family: ${font.style.fontFamily};
      }
    `}
  />
);
