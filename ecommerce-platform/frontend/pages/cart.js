import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../utils/CartContext';
import { formatPrice } from '../utils/cart';

export default function CartPage() {
  const { cart, count, total, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <Layout>
      <Head>
        <title>Cart – AutoParts Store</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-8">YOUR CART</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-white text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-slate-400 mb-6">Add some parts to get started</p>
            <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="card p-4 flex gap-4 items-start">
                  <div className="w-20 h-20 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-brand-400 text-xs font-mono">{item.partNumber}</p>
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-brand-400 font-bold text-lg mt-1">{formatPrice(item.price)}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          −
                        </button>
                        <span className="text-white w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold">{formatPrice(item.price * item.quantity)}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-slate-500 hover:text-red-400 text-sm transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M4 7h16" />
                </svg>
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-400 truncate mr-2">{item.name} × {item.quantity}</span>
                      <span className="text-white flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white text-2xl font-display tracking-wide">{formatPrice(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-primary w-full justify-center">
                  Checkout
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                <Link href="/products" className="btn-ghost w-full text-center mt-2 text-sm">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
