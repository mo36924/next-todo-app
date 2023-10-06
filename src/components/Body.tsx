import { PropsWithChildren } from "react";
import { css } from "styled-system/css";

export default function Body({ children }: PropsWithChildren) {
  return (
    <body
      className={css({
        minWidth: "230px",
        maxWidth: "550px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        font: "14px 'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSmoothing: "antialiased",
      })}
    >
      {children}
    </body>
  );
}
