import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const { data: orderData } = await supabase
        .from('ecom_orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (orderData) setOrder(orderData);

      const { data: items } = await supabase
        .from('ecom_order_items')
        .select('*')
        .eq('order_id', orderId);
      if (items) setOrderItems(items);
    };
    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a1f3a] mb-3">Order Confirmed!</h1>
          <p className="text-gray-500 text-lg">Thank you for your purchase. Your order has been placed successfully.</p>
          {orderId && (
            <p className="text-sm text-gray-400 mt-2">
              Order ID: <span className="font-mono font-medium text-gray-600">{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
          )}
        </div>

        {order && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg text-[#1a1f3a] mb-4">Order Details</h2>
            <div className="space-y-3 mb-6">
              {orderItems.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    {item.variant_title && <p className="text-sm text-gray-500">{item.variant_title}</p>}
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.total / 100).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${(order.subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">{order.shipping === 0 ? 'Free' : `$${(order.shipping / 100).toFixed(2)}`}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.tax / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#1a1f3a]">${(order.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
            <Mail className="w-5 h-5 text-cyan-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 text-sm">Confirmation Email</p>
              <p className="text-xs text-gray-500">A confirmation email has been sent to your inbox.</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
            <Package className="w-5 h-5 text-cyan-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 text-sm">Free Shipping</p>
              <p className="text-xs text-gray-500">Your order will be shipped within 1-2 business days.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-[#1a1f3a] text-white px-8 py-4 rounded-xl font-semibold hover:bg-cyan-600 transition-colors">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
