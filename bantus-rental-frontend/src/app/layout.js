import { Inter } from "next/font/google";
import "./globals.css"; // This is essential for Tailwind CSS

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bantus Rental",
  description: "Rental Property Management, Simplified for you.",
};

// This is the one and only RootLayout for the entire application.
// It should be simple and not contain providers that are layout-specific.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
