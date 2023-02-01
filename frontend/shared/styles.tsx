import { css, Global } from "@emotion/react";

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        padding: 0;
        margin: 0;
        min-height: 100%;
        background: black;

        font-family: Trap;
        color: white;
      }
    `}
  />
);
