/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next'

import { Stripe } from 'stripe'

import { stripe } from '../../lib/stripe'
import { CartContext } from '../../contexts/CartContext'

type ProductProps = {
  product: {
    id: string
    name: string
    price: string
    amount: number
    imageUrl: string
    description: string
    defaultPriceId: string
  }
}

export default function Product({ product }: ProductProps) {
  const { addProductToCart } = useContext(CartContext)

  function handleAddToCart() {
    addProductToCart(product, 1)
  }

  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>

      <section className="grid grid-cols-2 items-stretch gap-16 max-w-[1180px] mx-auto">
        <picture className="flex justify-center items-center w-full max-w-xl min-h-[calc(100vh-180px)] rounded-lg bg-gradient-to-r from-green-400 to-purple-500">
          <Image alt="" src={product.imageUrl} width={520} height={480} />
        </picture>

        <div className="flex flex-col">
          <h1 className="text-2xl text-gray-300">{product.name}</h1>
          <span className="block mt-4 text-2xl text-green-300">
            {product.price}
          </span>

          <p className="mt-10 text-lg text-gray-300">{product.description}</p>

          <button
            type="button"
            className="mt-auto p-5 rounded-lg text-lg font-bold bg-green-500 text-white hover:bg-green-300 disabled:opacity-60 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
          >
            Colocar na sacola
          </button>
        </div>
      </section>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: 'prod_MLH5Wy0Y97hDAC' } }],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params
}) => {
  const productId = params!.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        amount: price.unit_amount || 0,
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format((price.unit_amount || 0) / 100),
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1 // 1 hours
  }
}
