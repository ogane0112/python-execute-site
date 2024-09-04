import type { Metadata } from "next";

import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { LayoutWithSidebar } from "@/components/Aichart/LayoutWithSidebar";
const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Python Web実行環境",
  description: "ブラウザ上でPythonコードを実行・学習できるオンライン環境",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <LayoutWithSidebar>{children}</LayoutWithSidebar>
      </body>
    </html>
  );
}
