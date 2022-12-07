import '../styles/globals.css'

import type { AppProps } from 'next/app'

import { CartContextProvider } from '../contexts/CartContext'
import { DefaultLayout } from '../layouts/DefaultLayout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartContextProvider>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </CartContextProvider>
  )
}
