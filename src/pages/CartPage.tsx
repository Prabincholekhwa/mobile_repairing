import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-[#1a1f3a] text-white px-8 py-4 rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" /> Browse Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1a1f3a] mb-8">Shopping Cart ({cartCount} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.product_id + (item.variant_id || '')} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  {item.variant_title && (
                    <p className="text-sm text-gray-500 mb-2">{item.variant_title}</p>
                  )}
                  <p className="text-lg font-bold text-[#1a1f3a]">${(item.price / 100).toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.product_id, item.variant_id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 py-2 font-medium text-sm min-w-[40px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-gray-900">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-[#1a1f3a] mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${(cartTotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-[#1a1f3a]">${(cartTotal / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a1f3a] to-[#2a3050] text-white py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-4 flex items-center gap-2 text-sm text-green-600 justify-center">
                <Truck className="w-4 h-4" />
                <span>Free shipping on all orders</span>
              </div>

              <Link to="/products" className="block text-center text-sm text-cyan-600 hover:underline mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
