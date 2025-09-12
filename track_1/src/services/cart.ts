export type CartItem = {
  name: string
  type: 'PRIMARY' | 'SECONDARY'
  price?: number | string | null
  currency?: string | null
  addedAt: number
}

const CART_KEY = 'doma_cart'
const CART_EVENT = 'cart_updated'

export function getCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function setCartItems(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function addToCart(item: CartItem) {
  const items = getCartItems()
  items.unshift(item)
  setCartItems(items)
}

export function removeFromCart(index: number) {
  const items = getCartItems()
  items.splice(index, 1)
  setCartItems(items)
}

export function clearCart() {
  setCartItems([])
}

export const CART_EVENTS = { UPDATED: CART_EVENT }


