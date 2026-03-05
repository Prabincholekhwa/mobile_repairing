import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Truck, ArrowLeft, Loader2 } from 'lucide-react';

const STRIPE_ACCOUNT_ID = 'STRIPE_ACCOUNT_ID';
const stripePromise = STRIPE_ACCOUNT_ID && STRIPE_ACCOUNT_ID !== 'STRIPE_ACCOUNT_ID'
  ? loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', { stripeAccount: STRIPE_ACCOUNT_ID })
  : null;

const SHIPPING_RULES = "Free shipping on all orders";

function CheckoutPaymentForm({ onSuccess }: { onSuccess: (pi: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-6 bg-gradient-to-r from-[#1a1f3a] to-[#2a3050] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 shadow-lg"
      >
        {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Lock className="w-5 h-5" /> Pay Now</>}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [shippingAddress, setShippingAddress] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', country: 'US'
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, []);

  const calculateShippingDirect = async (): Promise<number> => {
    const { data } = await supabase.functions.invoke('calculate-shipping', {
      body: {
        cartItems: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
        shippingRules: SHIPPING_RULES,
        subtotal: cartTotal
      }
    });
    const cost = data?.success ? (data.shippingCents || 0) : 0;
    setShippingCost(cost);
    return cost;
  };

  const calculateTaxDirect = async (state: string): Promise<number> => {
    if (!state) return 0;
    const { data } = await supabase.functions.invoke('calculate-tax', {
      body: { state, subtotal: cartTotal }
    });
    const taxAmount = data?.success ? (data.taxCents || 0) : 0;
    setTax(taxAmount);
    return taxAmount;
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const [shipCost, taxCost] = await Promise.all([
      calculateShippingDirect(),
      calculateTaxDirect(shippingAddress.state)
    ]);

    const total = cartTotal + shipCost + taxCost;
    if (total <= 0) return;

    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount: total, currency: 'usd' }
    });

    if (error || !data?.clientSecret) {
      setPaymentError('Unable to initialize payment. Please try again.');
      setStep('payment');
      return;
    }

    setClientSecret(data.clientSecret);
    setStep('payment');
  };

  // Recalculate when state changes
  useEffect(() => {
    if (shippingAddress.state && shippingAddress.state.length === 2) {
      calculateTaxDirect(shippingAddress.state);
    }
  }, [shippingAddress.state]);



  const handlePaymentSuccess = async (paymentIntent: any) => {
    login(shippingAddress.email, shippingAddress.name);

    const subtotal = cartTotal;
    const orderTotal = subtotal + shippingCost + tax;

    const { data: customer } = await supabase
      .from('ecom_customers')
      .upsert({ email: shippingAddress.email, name: shippingAddress.name, phone: shippingAddress.phone }, { onConflict: 'email' })
      .select('id')
      .single();

    const { data: order } = await supabase
      .from('ecom_orders')
      .insert({
        customer_id: customer?.id,
        status: 'paid',
        subtotal,
        tax,
        shipping: shippingCost,
        total: orderTotal,
        shipping_address: shippingAddress,
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select('id')
      .single();

    if (order) {
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.name,
        variant_title: item.variant_title || null,
        sku: item.sku || null,
        quantity: item.quantity,
        unit_price: item.price,
        total: item.price * item.quantity,
      }));
      await supabase.from('ecom_order_items').insert(orderItems);

      // Send confirmation email
      await supabase.functions.invoke('send-order-confirmation', {
        body: {
          orderId: order.id,
          customerEmail: shippingAddress.email,
          customerName: shippingAddress.name,
          orderItems,
          subtotal,
          shipping: shippingCost,
          tax,
          total: orderTotal,
          shippingAddress
        }
      });

      clearCart();
      navigate(`/order-confirmation?orderId=${order.id}`);
    }
  };

  const total = cartTotal + shippingCost + tax;

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-cyan-600 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-[#1a1f3a] mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {/* Steps */}
            <div className="flex items-center gap-4 mb-8">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-cyan-600' : 'text-green-600'}`}>
                <span className="w-8 h-8 rounded-full bg-current text-white flex items-center justify-center text-sm font-bold">
                  {step === 'payment' ? <span className="text-white">&#10003;</span> : '1'}
                </span>
                <span className="font-medium text-sm">Shipping</span>
              </div>
              <div className="flex-1 h-px bg-gray-200" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-cyan-600' : 'text-gray-400'}`}>
                <span className="w-8 h-8 rounded-full bg-current text-white flex items-center justify-center text-sm font-bold">2</span>
                <span className="font-medium text-sm">Payment</span>
              </div>
            </div>

            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#1a1f3a] mb-6">Shipping Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" required value={shippingAddress.name} onChange={e => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input type="email" required value={shippingAddress.email} onChange={e => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={shippingAddress.phone} onChange={e => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input type="text" required value={shippingAddress.address} onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input type="text" required value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input type="text" required maxLength={2} placeholder="e.g. CA" value={shippingAddress.state} onChange={e => setShippingAddress({ ...shippingAddress, state: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <input type="text" required value={shippingAddress.zip} onChange={e => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input type="text" value={shippingAddress.country} onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                </div>
                <button type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-[#1a1f3a] to-[#2a3050] text-white py-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#1a1f3a]">Payment</h2>
                  <button onClick={() => setStep('shipping')} className="text-sm text-cyan-600 hover:underline">Edit Shipping</button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 mb-6 text-sm text-gray-600">
                  <p className="font-medium">{shippingAddress.name}</p>
                  <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                </div>

                {!stripePromise ? (
                  <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center">
                    <p className="text-yellow-800 font-medium mb-1">Payment processing is being set up</p>
                    <p className="text-yellow-600 text-sm">Please check back soon to complete your purchase.</p>
                  </div>
                ) : paymentError ? (
                  <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
                    <p className="text-red-800">{paymentError}</p>
                  </div>
                ) : clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                    <CheckoutPaymentForm onSuccess={handlePaymentSuccess} />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                    <span className="ml-2 text-gray-500">Loading payment form...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-[#1a1f3a] mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.product_id + (item.variant_id || '')} className="flex gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-contain" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      {item.variant_title && <p className="text-xs text-gray-500">{item.variant_title}</p>}
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${(cartTotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Free
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>{tax > 0 ? `$${(tax / 100).toFixed(2)}` : step === 'shipping' ? 'Calculated next' : '$0.00'}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-[#1a1f3a]">${(total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
