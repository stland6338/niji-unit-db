import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "にじユニットDB - にじさんじコラボデータベース",
  description: "にじさんじライバーのコラボユニット情報をまとめたデータベース。検索機能とクイズ機能付き。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="min-h-screen">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-bold text-blue-600">にじユニットDB</h1>
                <nav className="flex space-x-4">
                  <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    ユニット一覧
                  </Link>
                  <Link href="/quiz" className="text-gray-600 hover:text-blue-600 transition-colors">
                    クイズ
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
