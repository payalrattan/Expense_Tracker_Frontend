import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EXPENSES TRACKER",
  description: "How to track your expenses!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
