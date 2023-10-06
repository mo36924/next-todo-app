import "@/assets/globals.css";
import { PropsWithChildren } from "react";
import Body from "@/components/Body";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="ja">
      <Body>{children}</Body>
    </html>
  );
}
