import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "NSW Test Prep",
  description:
    "Interactive preparation for NSW OC and Selective school tests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        {/* Navigation */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-indigo-700 hover:text-indigo-900 transition-colors text-lg"
              >
                NSW Test Prep
              </Link>
              <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                <Link
                  href="/oc"
                  className="hover:text-indigo-700 transition-colors"
                >
                  OC Prep
                </Link>
                <Link
                  href="/selective"
                  className="hover:text-indigo-700 transition-colors"
                >
                  Selective Prep
                </Link>
              </div>
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
          NSW Test Prep &mdash; OC &amp; Selective School Practice
        </footer>
      </body>
    </html>
  );
}
