import { memo } from "react";
import { css } from "styled-system/css";

export default memo(function Header() {
  return (
    <header>
      <h1
        className={css({ color: "rgba(175, 47, 47, 0.15)", fontSize: "100px", fontWeight: 100, textAlign: "center" })}
      >
        todos
      </h1>
    </header>
  );
});
