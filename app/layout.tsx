import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";
export const metadata: Metadata = {
  title: "Advanced Store Navigation System",
  description:
    "Smart store navigation with pathfinding and zone-based directions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3371FF",
          fontSize: "16px",
        },
      }}
    >
      <html lang="en">
        <body className="bg-gray-50">
          <NextTopLoader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
