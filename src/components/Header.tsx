import { useContext } from 'react'
import { clsx } from 'clsx'

import Image from 'next/image'
import Link from 'next/link'

import { Handbag } from 'phosphor-react'

import logoImg from '../assets/logo.svg'

import { CartContext } from '../contexts/CartContext'

type HeaderProps = {
  cartButtonVisible: boolean
}

export function Header({ cartButtonVisible }: HeaderProps) {
  const { changeCartVisibility, cartVisibility, totalItemsInCart } =
    useContext(CartContext)

  return (
    <header
      className={clsx('flex  w-full max-w-6xl py-8 mx-auto', {
        'justify-between': cartButtonVisible,
        'justify-center': !cartButtonVisible
      })}
    >
      <Link href="/">
        <Image src={logoImg} alt="" />
      </Link>

      {cartButtonVisible && (
        <button
          type="button"
          className="relative p-3 rounded-md bg-gray-800 hover:bg-opacity-80"
          onClick={() => changeCartVisibility(!cartVisibility)}
        >
          <Handbag size={24} />

          <span className="absolute -top-3 -right-3 flex justify-center items-center w-8 h-8 border-4 border-gray-900 rounded-full bg-green-500 font-bold text-sm text-white">
            {totalItemsInCart}
          </span>
        </button>
      )}
    </header>
  )
}
