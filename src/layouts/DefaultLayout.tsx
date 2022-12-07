import { ReactNode } from 'react'
import { useRouter } from 'next/router'

import { Header } from '../components/Header'
import { Checkout } from '../components/Checkout'

type DefaultLayoutProps = {
  children: ReactNode
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const router = useRouter()

  const isSuccessRoute = router.pathname === '/success'

  return (
    <>
      <main className="flex flex-col justify-center items-start min-h-screen">
        <Header cartButtonVisible={!isSuccessRoute} />

        {children}
      </main>

      {!isSuccessRoute && <Checkout />}
    </>
  )
}
