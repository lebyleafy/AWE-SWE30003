import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/NavBar";

export const metadata = {
  title: "AWE Electronics Store",
  description: "Online electronics store powered by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
