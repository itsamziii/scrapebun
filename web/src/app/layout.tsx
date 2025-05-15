import "../styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./_components/navbar";
import { dark } from "@clerk/themes";
import { CSPostHogProvider } from "./_analytics/provider";
export const metadata: Metadata = {
  title: "ScrapeBun",
  description: "ScrapeBun",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
    },
  ],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <CSPostHogProvider>
          <html lang="en" suppressHydrationWarning>
            <body
              className={`${geist.variable} overflow-x-hidden scroll-smooth`}
            >
              <ThemeProvider
                attribute="class"
                forcedTheme="dark"
              >
                <Navbar />
                {children}
              </ThemeProvider>
            </body>
          </html>
        </CSPostHogProvider>
      </ClerkProvider>
    </>
  );
}
