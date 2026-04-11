import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Open Graph meta tags (Facebook, iMessage, text messages, etc.) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://147.182.248.128" />
        <meta property="og:title" content="Guess The Pothole! – Daily Guessing Game" />
        <meta property="og:description" content="How well do you know your city's roads? Play the daily pothole guessing game – Better Roads, Safe Streets." />
        <meta property="og:image" content="http://147.182.248.128/brand/twitter-card.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter / X card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Guess The Pothole! – Daily Guessing Game" />
        <meta name="twitter:description" content="How well do you know your city's roads? Play the daily pothole guessing game – Better Roads, Safe Streets." />
        <meta name="twitter:image" content="http://147.182.248.128/brand/twitter-card.jpg" />

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
          integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bree+Serif&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
