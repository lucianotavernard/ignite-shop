import { useContext, useState } from 'react'
import { clsx } from 'clsx'

import axios from 'axios'

import { X } from 'phosphor-react'

import { CartContext } from '../contexts/CartContext'

export function Checkout() {
  const {
    items,
    cartVisibility,
    totalItemsInCart,
    totalPriceInCart,
    changeCartVisibility,
    removeProductFromCart
  } = useContext(CartContext)

  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false)

  async function handleBuyButton() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        items: items.map((item) => ({
          price: item.product.defaultPriceId,
          quantity: item.quantity
        }))
      })

      const { checkoutUrl } = response.data

      window.location.href = checkoutUrl
    } catch (err) {
      setIsCreatingCheckoutSession(false)

      alert('Falha ao redirecionar ao checkout!')
    }
  }

  const formattedTotalPriceInCart = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalPriceInCart / 100)

  return (
    <aside
      className={clsx(
        'transition-all duration-500 ease-in-out z-50 fixed top-0 bottom-0 flex flex-col justify-between min-w-[30rem] pt-6 pr-6 pb-12 pl-12 bg-gray-800',
        {
          '-right-full': !cartVisibility,
          'right-0': cartVisibility
        }
      )}
    >
      <header>
        <button
          type="button"
          className="block ml-auto"
          onClick={() => changeCartVisibility(!cartVisibility)}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl text-gray-100 font-bold">Sacola de compras</h2>
      </header>

      <section className="mt-8">
        <ul className="flex flex-col gap-6 h-80 overflow-y-auto">
          {items.length > 0 &&
            items.map((item) => (
              <li key={item.product.id} className="flex">
                <picture className="flex justify-center items-center w-24 h-24 rounded-lg bg-gradient-to-r from-green-400 to-purple-500">
                  <img src={item.product.imageUrl} alt="" />
                </picture>

                <div className="flex flex-col justify-between items-start ml-6">
                  <h5 className="text-lg">{item.product.name}</h5>
                  <p className="text-lg">{item.product.price}</p>
                  <button
                    type="button"
                    className="text-base text-green-500 font-bold hover:text-green-300"
                    onClick={() => removeProductFromCart(item.product.id)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <footer className="flex flex-col">
        <hgroup className="mb-14 text-gray-100">
          <h6 className="flex justify-between items-center">
            <span className="text-base">Quantidade</span>
            <span className="text-lg">{totalItemsInCart} itens</span>
          </h6>

          <h5 className="flex justify-between items-center">
            <strong className="text-lg font-bold">Valor total</strong>
            <strong className="text-2xl font-bold">
              {formattedTotalPriceInCart}
            </strong>
          </h5>
        </hgroup>

        <button
          type="button"
          className="mt-auto p-5 rounded-lg text-lg font-bold bg-green-500 text-white hover:bg-green-300 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isCreatingCheckoutSession || totalItemsInCart === 0}
          onClick={handleBuyButton}
        >
          Finalizar compra
        </button>
      </footer>
    </aside>
  )
}
