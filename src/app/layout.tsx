import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { ToastContainer } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Cheezious | Delivering Cheezy Khushiyan - Online Ordering & Menu",
  description:
    "Official Cheezious online ordering demo application with Crown Crust pizza, Bazinga burgers, and WhatsApp checkout. Built as a high-speed agency showcase by Helpex Solutions.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('cheezious_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FA] dark:bg-[#111317] text-neutral-900 dark:text-white antialiased transition-colors duration-200">
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
