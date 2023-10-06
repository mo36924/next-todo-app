import "@/assets/globals.css";
import { AppType } from "next/app";
import { trpc } from "@/trpc";

const App: AppType = ({ Component, pageProps }) => <Component {...pageProps} />;

export default trpc.withTRPC(App);
