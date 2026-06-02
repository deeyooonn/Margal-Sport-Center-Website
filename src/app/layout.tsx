import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Margal Sports Center — Court Booking',
  description:
    'Book covered courts at Margal Sports Center in Bulacan. Badminton, basketball, futsal & more. Instant online booking.',
  keywords: 'sports court booking, badminton, basketball, futsal, Bulacan, Margal Sports Center',
  openGraph: {
    title: 'Margal Sports Center',
    description: 'Book covered courts online — Your Game, Your Rules.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
