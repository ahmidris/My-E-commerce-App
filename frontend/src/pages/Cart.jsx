import React, { useContext } from 'react'
import { ShopContext } from '../context/shopContext'

const Cart = () => {
  const {products, currency, cartItems} = useContext(ShopContext);

  
  return (
    <div>
      
    </div>
  )
}

export default Cart
