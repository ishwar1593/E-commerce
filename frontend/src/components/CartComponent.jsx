import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Minus, Plus, X, ShoppingBag } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <div className="w-24 h-24 flex-shrink-0">
        <img 
          src={item.images[0]} 
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-2">Pack Size: {item.package_size} tablets</p>
        <div className="flex items-baseline gap-2">
          <span className="font-bold">₹{item.sales_price}</span>
          <span className="text-sm text-gray-500 line-through">₹{item.mrp}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stockQty}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-right min-w-[100px]">
        <div className="font-bold">₹{(item.sales_price * item.quantity).toFixed(2)}</div>
      </div>

      <Button 
        variant="ghost" 
        size="icon"
        className="text-gray-500 hover:text-red-500"
        onClick={() => removeFromCart(item.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

const CartComponent = () => {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      name: "Dolo 650",
      description: "It has low power",
      package_size: 10,
      images: ["https://res.cloudinary.com/dubd2cvyg/image/upload/v1736938184/gb81voap0higd2tto0ar.webp"],
      sales_price: 10,
      mrp: 25,
      quantity: 2,
      stockQty: 50
    },
    // Add more items as needed
  ])

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.sales_price * item.quantity), 0)
  }

  const calculateSavings = () => {
    return cartItems.reduce((sum, item) => sum + ((item.mrp - item.sales_price) * item.quantity), 0)
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const shippingCost = subtotal >= 500 ? 0 : 40
    return subtotal + shippingCost
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
        <Button onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="divide-y">
              {cartItems.map(item => (
                <CartItem 
                  key={item.id} 
                  item={item}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-green-600">
                  <span>Total Savings</span>
                  <span>₹{calculateSavings().toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{calculateSubtotal() >= 500 ? 'Free' : '₹40.00'}</span>
                </div>

                {calculateSubtotal() < 500 && (
                  <div className="text-sm text-gray-500">
                    Add items worth ₹{(500 - calculateSubtotal()).toFixed(2)} more for free shipping
                  </div>
                )}
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" size="lg">
                Proceed to Checkout
              </Button>

              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartComponent;