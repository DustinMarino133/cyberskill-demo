import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CyberSkill.AI - Cybersecurity Education Platform",
  description: "Learn cybersecurity with AI-powered tools. From students to enterprises, master cyber defense skills through gamified learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1E293B',
              color: '#F1F5F9',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#536DE2',
                secondary: '#F1F5F9',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#F1F5F9',
              },
            },
          }}
        />
        </ThemeProvider>
      </body>
    </html>
  );
}
