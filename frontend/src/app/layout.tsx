import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'JapJaryq Academy - Онлайн-школа электриков | Курсы с нуля',
  description: 'Станьте профессиональным электриком! Практические онлайн-курсы, HD видеоуроки, реальные кейсы. Помощь в трудоустройстве. Сертификат. Первый урок бесплатно!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

