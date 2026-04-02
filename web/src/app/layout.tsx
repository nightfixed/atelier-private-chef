import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://atelierprivatedining.ro"),
  title: {
    default: "Atelier Private Dining · Cluj-Napoca",
    template: "%s · Atelier Private Dining",
  },
  description:
    "Experiențe culinare private, gândite și executate de la zero — pentru cei care știu diferența. Chef Răzvan & Roland · 18+ ani fine dining · Cluj-Napoca, România.",
  keywords: [
    "private dining Cluj",
    "chef privat Cluj-Napoca",
    "fine dining la domiciliu",
    "meniu degustare personalizat",
    "corporate dining Cluj",
    "chef Razvan",
    "experienta culinara privata",
    "atelier private dining",
  ],
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://atelierprivatedining.ro",
    siteName: "Atelier Private Dining",
    title: "Atelier Private Dining · Cluj-Napoca",
    description:
      "Experiențe culinare private cu Chef Răzvan & Roland. Meniuri de degustare personalizate, ingrediente carpatice, 18+ ani fine dining. Cluj-Napoca, România.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atelier Private Dining · Cluj-Napoca",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atelier Private Dining · Cluj-Napoca",
    description:
      "Experiențe culinare private cu Chef Răzvan & Roland. Meniuri de degustare personalizate · Cluj-Napoca.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  authors: [{ name: "Răzvan", url: "https://atelierprivatedining.ro" }],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

const LOCK_SCRIPT = `(function(){
  var KEY='Rx7@mK9!vQ3z',STORE='ap_preview';
  var p=new URLSearchParams(window.location.search).get('p');
  if(p===KEY){
    try{localStorage.setItem(STORE,KEY);}catch(e){}
    var u=window.location.pathname+window.location.hash;
    window.history.replaceState({},'',u);
    return;
  }
  var ok=false;try{ok=localStorage.getItem(STORE)===KEY;}catch(e){}
  if(ok)return;
  document.documentElement.style.visibility='hidden';
  document.addEventListener('DOMContentLoaded',function(){
    document.documentElement.style.visibility='';
    document.body.style.cssText='margin:0;background:#0e0e0e;';
    document.body.innerHTML='<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;background:#0e0e0e;font-family:Georgia,serif;">'
      +'<div style="font-size:0.55rem;letter-spacing:0.5em;color:#c9a96e;text-transform:uppercase;margin-bottom:2rem;opacity:0.7;">Atelier Private Dining \u2014 Cluj-Napoca</div>'
      +'<h1 style="font-size:clamp(2rem,6vw,3.5rem);font-weight:300;color:#c9a96e;letter-spacing:0.1em;margin:0 0 1.5rem;">\u00cen cur\u00e2nd</h1>'
      +'<p style="font-size:1rem;font-weight:300;font-style:italic;color:rgba(245,240,234,0.5);max-width:380px;line-height:2;margin:0;">Site-ul este \u00een construc\u021bie.<br>Revenim cur\u00e2nd.</p>'
      +'</div>';
  });
})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOCK_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
