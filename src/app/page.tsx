import { Metadata } from "next";
import Link from "next/link";
import { css } from "styled-system/css";

export const metadata: Metadata = {
  title: "Todo一覧",
  description: "Todo一覧",
};

export default function Index() {
  return (
    <div className={css({ fontSize: "64px" })}>
      <h1>Todo一覧</h1>
      <div className={css({ margin: "12px" })}>
        <Link className={css({ color: "rgb(41, 82, 194)", textDecoration: "underline" })} href="/pages-router">
          Pages Router
        </Link>
      </div>
      <div className={css({ margin: "12px" })}>
        <Link className={css({ color: "rgb(41, 82, 194)", textDecoration: "underline" })} href="/app-router">
          App Router
        </Link>
      </div>
    </div>
  );
}
