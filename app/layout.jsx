import "./globals.css";
import Providers from "@/components/provider";
import { Toaster } from "sonner";
import { helveticaNowDisplay } from "@/public/Assets/Fonts/fontTypeWeight";

export const metadata = {
  title: "Bridge Workspace",
  description: "Workspace to cater employees' work",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={helveticaNowDisplay.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
