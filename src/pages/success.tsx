import { GetServerSideProps } from 'next'
import { clsx } from 'clsx'

import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'

import Stripe from 'stripe'
import { stripe } from '../lib/stripe'

type SuccessProps = {
  costumerName: string
  totalItemsPurchased: number
  products: Array<{
    id: string
    name: string
    imageUrl: string
  }>
}

export default function Success({
  totalItemsPurchased,
  costumerName,
  products
}: SuccessProps) {
  return (
    <>
      <Head>
        <title>Compra efetuada | Ignite Shop</title>

        <meta name="robots" content="noindex" />
      </Head>

      <section className="flex flex-col justify-center items-center mx-auto  min-h-[calc(100vh-180px)]">
        <div className="flex mb-6">
          {products.map((product, index) => (
            <picture
              key={product.id}
              className={clsx(
                'flex justify-center items-center w-32 h-32 p-1 rounded-full bg-gradient-to-r from-green-400 to-purple-500',
                {
                  '-ml-10': index > 0
                }
              )}
            >
              <Image
                alt=""
                src={product.imageUrl}
                width={120}
                height={110}
                className="object-cover"
              />
            </picture>
          ))}
        </div>

        <h1 className="font-bold text-4xl text-gray-100">Compra efetuada</h1>

        <p className="max-w-xs md:max-w-lg lg:max-w-xl mt-8 text-xl text-center text-gray-300">
          Uhuul <strong>{costumerName}</strong>, sua compra de {''}
          <strong>{totalItemsPurchased}</strong> camisetas já está a caminho da
          sua casa.
        </p>

        <Link
          href="/"
          className="block max-w-xl mt-20 text-lg text-green-500 font-bold hover:text-green-300"
        >
          Voltar ao catálogo
        </Link>
      </section>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (!query.session_id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product']
  })

  const costumerName = session.customer_details?.name
  const lineItems = session.line_items?.data || []

  const totalItemsPurchased = lineItems.length

  const products = lineItems
    .map((item) => item.price?.product as Stripe.Product)
    .map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.images[0]
    }))

  return {
    props: {
      totalItemsPurchased,
      costumerName,
      products
    }
  }
}
