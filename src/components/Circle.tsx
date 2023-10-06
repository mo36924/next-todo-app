import { memo } from "react";

export default memo(function Circle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135">
      <circle cx="50" cy="50" r="50" fill="none" stroke="#ededed" strokeWidth="3" />
    </svg>
  );
});
