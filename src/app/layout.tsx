import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Providers } from './providers'
import { getServerMessages } from '@/shared/i18n/server'
import { Sidebar } from '@/widgets/sidebar/Sidebar'
import { getServerSession } from '@/entities/auth/model/server'

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ibm-plex-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: 'Hackathon Platform',
  description: 'Платформа для проведения хакатонов',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { locale, messages } = await getServerMessages()
  const session = await getServerSession()

  return (
    <html lang={locale}>
      <body className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('hackathon-platform-theme') || 
                  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
                document.documentElement.setAttribute('data-theme', theme);
              })();
            `,
          }}
        />
        <Providers locale={locale} messages={messages}>
          <div className="flex min-h-screen bg-bg-surface">
            <Sidebar initialSession={session} />
            <main className="flex-1 bg-bg-surface">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
