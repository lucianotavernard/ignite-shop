import 'keen-slider/keen-slider.min.css'

import { useContext } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { GetStaticProps } from 'next'

import { useKeenSlider } from 'keen-slider/react'

import { Stripe } from 'stripe'

import { stripe } from '../lib/stripe'
import { CartContext } from '../contexts/CartContext'

type HomeProps = {
  products: Array<{
    id: string
    name: string
    price: string
    imageUrl: string
  }>
}

export default function Home({ products = [] }: HomeProps) {
  const router = useRouter()

  const { changeCartVisibility } = useContext(CartContext)

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2,
      spacing: 48
    }
  })

  function handleNavigateToProductDetail(productId: string) {
    changeCartVisibility(false)
    router.push(`product/${productId}`)
  }

  return (
    <>
      <Head>
        <title>Ignite Shop</title>
      </Head>

      <section className="relative flex w-full max-w-[calc(100vw-((100vw-1180px)/2))] min-h-[calc(100vh-180px)] ml-auto">
        <div ref={sliderRef} className="z-10 keen-slider">
          {products.length > 0 &&
            products.map((product) => (
              <article
                key={product.id}
                onClick={() => handleNavigateToProductDetail(product.id)}
                className="keen-slider__slide group relative overflow-hidden flex justify-center items-center h-full rounded-lg cursor-pointer bg-gradient-to-r from-green-400 to-purple-500"
              >
                <Image
                  alt=""
                  src={product.imageUrl}
                  width={520}
                  height={480}
                  className="object-cover"
                />

                <footer className="transition-all absolute bottom-1 left-1 right-1 flex justify-between items-center p-8 rounded-md bg-black/60 translate-y-[110%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                  <strong className="text-lg text-gray-100">
                    {product.name}
                  </strong>
                  <span className="text-xl font-bold text-green-300">
                    {product.price}
                  </span>
                </footer>
              </article>
            ))}
        </div>
      </section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format((price.unit_amount || 0) / 100)
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 // 2 hours,
  }
}
