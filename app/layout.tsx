import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // <-- import Poppins
import "./globals.css";

// Configure Poppins
const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"], // choose the weights you need
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cough2Care",
  description: "Early detection of pneumonia and tuberculosis using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
