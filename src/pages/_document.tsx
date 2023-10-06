import { DocumentType } from "next/dist/shared/lib/utils";
import { Head, Html, Main, NextScript } from "next/document";
import Body from "@/components/Body";

const Document: DocumentType = () => (
  <Html lang="ja">
    <Head />
    <Body>
      <Main />
      <NextScript />
    </Body>
  </Html>
);

export default Document;
