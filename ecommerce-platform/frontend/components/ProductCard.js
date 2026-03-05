import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../utils/CartContext';
import { formatPrice } from '../utils/cart';

export default function ProductCard({ product }) {
  const { addToCart, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Placeholder color based on product ID
  const placeholderColors = [
    'from-slate-700 to-slate-600',
    'from-blue-900 to-blue-800',
    'from-orange-900 to-orange-800',
    'from-green-900 to-green-800',
    'from-purple-900 to-purple-800',
  ];
  const colorClass = placeholderColors[product.id % placeholderColors.length];

  return (
    <div className="product-card group">
      {/* Image */}
      <Link href={`/products/${product.id}`}>
        <div className={`relative h-48 bg-gradient-to-br ${colorClass} overflow-hidden`}>
          {product.image && product.image !== '/images/placeholder.jpg' ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="w-20 h-20 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Part number */}
        <p className="text-brand-400 text-xs font-mono font-medium mb-1">{product.partNumber}</p>

        {/* Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-white font-semibold text-base leading-tight hover:text-brand-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-slate-400 text-sm mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-display text-white tracking-wide">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 ${
              added
                ? 'bg-green-500 text-white'
                : 'bg-brand-500 hover:bg-brand-400 text-white'
            }`}
          >
            {added ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
