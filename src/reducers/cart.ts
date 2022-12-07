export type Product = {
  id: string
  name: string
  price: string
  amount: number
  imageUrl: string
  description: string
  defaultPriceId: string
}

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
}

export enum ActionTypes {
  ADD_ITEM_TO_CART = 'ADD_ITEM_TO_CART',
  REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART'
}

type AddItemToCartParams = {
  product: Product
  quantity: number
}

type RemoveItemFromCartParams = {
  productId: string
}

export type ActionParams = {
  type: ActionTypes
  payload: AddItemToCartParams | RemoveItemFromCartParams
}

export const initialState: CartState = {
  items: []
}

export function cartReducer(state: CartState, action: ActionParams): CartState {
  switch (action.type) {
    case ActionTypes.ADD_ITEM_TO_CART: {
      const { product, quantity = 1 } = action.payload as AddItemToCartParams

      const productInCartIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      )

      if (productInCartIndex > -1) {
        return state
      }

      return {
        ...state,
        items: [...state.items, { product: product, quantity }]
      }
    }
    case ActionTypes.REMOVE_ITEM_FROM_CART: {
      const { productId } = action.payload as RemoveItemFromCartParams

      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== productId)
      }
    }
    default:
      return state
  }
}
