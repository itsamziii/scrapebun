import "../styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "~/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "./_components/navbar";
import { dark } from "@clerk/themes";

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geist.variable} scroll-smooth`}
      >
        <body className="overflow-x-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
