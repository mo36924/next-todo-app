import { memo } from "react";
import { css } from "styled-system/css";

export default memo(function Loader() {
  return (
    <div className={css({ display: "flex", alignItems: "center", justifyContent: "center" })}>
      <div
        className={css({
          width: "100px",
          height: "100px",
          border: "5px solid rgba(175, 47, 47, 0.15)",
          borderBottomColor: "transparent",
          borderRadius: "50%",
          animation: "rotate 1s linear infinite",
        })}
      />
    </div>
  );
});
