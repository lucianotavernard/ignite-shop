import { createContext, ReactNode, useReducer, useState } from 'react'

import {
  ActionTypes,
  CartItem,
  cartReducer,
  initialState,
  Product
} from '../reducers/cart'

type CartContextType = {
  items: CartItem[]
  cartVisibility: boolean
  totalItemsInCart: number
  totalPriceInCart: number
  addProductToCart: (product: Product, quantity: number) => void
  removeProductFromCart: (productId: string) => void
  changeCartVisibility: (visibility: boolean) => void
}

export const CartContext = createContext({} as CartContextType)

type CartContextProviderProps = {
  children: ReactNode
}

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartVisibility, setCartVisibility] = useState(false)

  const [cartState, dispatch] = useReducer(cartReducer, initialState)

  const { items } = cartState

  const totalItemsInCart = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const totalPriceInCart = items.reduce(
    (total, item) => total + item.product.amount * item.quantity,
    0
  )

  function addProductToCart(product: Product, quantity = 1) {
    dispatch({
      type: ActionTypes.ADD_ITEM_TO_CART,
      payload: {
        product,
        quantity
      }
    })
  }

  function removeProductFromCart(productId: string) {
    dispatch({
      type: ActionTypes.REMOVE_ITEM_FROM_CART,
      payload: {
        productId
      }
    })
  }

  function changeCartVisibility(visibility: boolean) {
    setCartVisibility(visibility)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsInCart,
        totalPriceInCart,
        addProductToCart,
        removeProductFromCart,
        cartVisibility,
        changeCartVisibility
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
