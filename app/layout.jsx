import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/provider";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bridge Workspace",
  description: "Workspace to cater employees' work",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
