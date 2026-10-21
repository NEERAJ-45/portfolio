import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

const title =
  "Neeraj Surnis — Backend Engineer, Payments & Distributed Systems";
const description =
  "Backend engineer building payment rails, event-driven services, and systems that stay correct under load. Java, Spring Boot, Kafka, PostgreSQL, AWS.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Neeraj Surnis",
    "backend engineer",
    "payments",
    "distributed systems",
    "Java",
    "Spring Boot",
    "Kafka",
    "PostgreSQL",
    "AWS",
  ],
  authors: [{ name: "Neeraj Surnis" }],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
