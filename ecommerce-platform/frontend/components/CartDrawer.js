import Link from 'next/link';
import { useCart } from '../utils/CartContext';
import { formatPrice } from '../utils/cart';

export default function CartDrawer() {
  const { cart, count, total, isOpen, closeCart, updateQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={closeCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700/50 z-50 flex flex-col animate-slide-in-right shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div>
            <h2 className="text-white font-semibold text-lg">Your Cart</h2>
            <p className="text-slate-400 text-sm">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-white font-medium mb-1">Your cart is empty</h3>
              <p className="text-slate-400 text-sm mb-4">Add products to get started</p>
              <button onClick={closeCart} className="btn-secondary text-sm">
                Browse Products
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-brand-400 text-xs font-mono">{item.partNumber}</p>
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-brand-400 font-semibold text-sm mt-0.5">{formatPrice(item.price)}</p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded-md flex items-center justify-center transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="text-white text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded-md flex items-center justify-center transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total</span>
              <span className="text-white text-xl font-display tracking-wide">{formatPrice(total)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center"
            >
              Proceed to Checkout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="btn-ghost w-full text-center text-sm"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
