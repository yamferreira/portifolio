import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import Background from "@/components/Background";
import FontToggle from "@/components/FontToggle";
import SideNav from "@/components/SideNav";
import { site } from "@/data/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
  keywords: [
    "Yam Ferreira",
    "back-end",
    "Java",
    "Spring Boot",
    "AWS",
    "arquitetura orientada a eventos",
  ],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.tagline,
  },
};

/**
 * Aplica a fonte salva antes da primeira pintura, para o toggle não
 * causar um flash de fonte errada no carregamento.
 */
const fontBootScript = `
try {
  var f = localStorage.getItem("yf-font");
  if (f === "mono") document.documentElement.dataset.font = "mono";
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: fontBootScript }} />
      </head>
      <body className="min-h-full">
        <Background />
        <SideNav />
        <FontToggle />
        <main>{children}</main>
      </body>
    </html>
  );
}
