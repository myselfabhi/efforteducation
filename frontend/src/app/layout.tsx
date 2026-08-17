import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/mobile/BottomNav";
import ProgressBar from "./components/mobile/ProgressBar";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://efforteducation.in'),
  title: {
    default: "Effort Education - Empowering Tomorrow's Leaders",
    template: "%s | Effort Education"
  },
  description:
    "Online competitive exam coaching and Young Scholar Program for skill development. Expert guidance in Banking, SSC, Railway, CUET exams and essential life skills. Established since 1991.",
  keywords: ["competitive exams", "banking coaching", "SSC coaching", "CUET coaching", "entrance exams", "young scholar program", "skill development", "online classes", "live classes"],
  authors: [{ name: "Effort Education" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://efforteducation.in",
    siteName: "Effort Education",
    title: "Effort Education - Empowering Tomorrow's Leaders",
    description: "Online competitive exam coaching and Young Scholar Program for skill development. Expert guidance in Banking, SSC, Railway, CUET exams.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Effort Education"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Effort Education - Empowering Tomorrow's Leaders",
    description: "Online competitive exam coaching and Young Scholar Program for skill development.",
    images: ["/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Providers>
          {/* Scroll Progress Bar */}
          <ProgressBar />

          {/* Main Content */}
          {children}

          {/* Mobile Bottom Navigation */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
