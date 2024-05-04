import { Inter as FontSans } from "next/font/google"
import localFont from "next/font/local"

import "@/styles/globals.css"
import type { Metadata } from 'next'
import { cn } from "@/lib/utils"
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexClientProvider } from "@/components/providers/convex-provider"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/config/site"


// Improve code readability by using descriptive variable names for fonts
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans-regular", // Change variable name to reflect font weight
})


const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI journey",
    "Message with your group",
    "Keep your journals",
    "Set goals and tasks",
    "Live sessions",
  ],
  authors: [
    {
      name: "DataTech",
      url: "https://shibahumanity.ai/",
    },
  ],
  creator: "DataTech",

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
        fontHeading.variable
      )}>
        <ConvexClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SonnerToaster position="bottom-center" />
            {children}
            <Toaster />
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
