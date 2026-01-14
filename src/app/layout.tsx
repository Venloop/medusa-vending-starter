import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Toaster } from "@medusajs/ui"
import "styles/globals.css"
import { Jost, Poppins } from "next/font/google"
import Script from "next/script"
import { headers } from "next/headers"

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  appleWebApp: {
    capable: true,
    title: "POS Store",
    statusBarStyle: "default",
  },
}

interface Props {
  children: React.ReactNode
}

export default async function RootLayout({ children }: Props) {
  const headersList = await headers()
  const countryCode = headersList.get("x-country-code") || "en"

  return (
    <html lang={countryCode} data-mode="light">
      <head>
        {process.env.NEXT_PUBLIC_CLARITY_ID ? (
          <Script
            id="clarity-script"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window,document,"clarity","script","${process.env.NEXT_PUBLIC_CLARITY_ID}");
              `,
            }}
          />
        ) : null}
      </head>
      <body>
        {children}
        <Toaster />
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              id="ga4-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ? (
          <Script id="crisp-chat" strategy="afterInteractive">
            {`
              window.$crisp=[];
              window.CRISP_WEBSITE_ID="${process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID}";
              (function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
            `}
          </Script>
        ) : null}
      </body>
    </html>
  )
}
