import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCart } from '../../utils/CartContext';
import { getProduct } from '../../utils/api';
import { formatPrice } from '../../utils/cart';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(res => setProduct(res.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="skeleton h-96 rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-10 w-3/4" />
              <div className="skeleton h-6 w-1/3" />
              <div className="skeleton h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-white text-2xl mb-4">Product not found</h2>
          <Link href="/products" className="btn-primary inline-flex">Back to Products</Link>
        </div>
      </Layout>
    );
  }

  const placeholderColors = [
    'from-slate-700 to-slate-600',
    'from-blue-900 to-blue-800',
    'from-orange-900 to-orange-800',
    'from-green-900 to-green-800',
    'from-purple-900 to-purple-800',
  ];
  const colorClass = placeholderColors[product.id % placeholderColors.length];

  return (
    <Layout>
      <Head>
        <title>{product.name} – AutoParts Store</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-400 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
          {/* Image */}
          <div className={`bg-gradient-to-br ${colorClass} rounded-2xl overflow-hidden aspect-square flex items-center justify-center relative`}>
            {product.image && product.image !== '/images/placeholder.jpg' ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg className="w-40 h-40 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-brand-400 font-mono text-sm font-medium mb-2">
              Part #{product.partNumber}
            </p>
            <h1 className="text-white text-3xl font-bold mb-4">{product.name}</h1>

            <div className="text-4xl font-display text-white mb-6 tracking-wide">
              {formatPrice(product.price)}
            </div>

            <p className="text-slate-300 leading-relaxed mb-8">{product.description}</p>

            {/* Quantity */}
            <div className="mb-6">
              <label className="label">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors border border-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-white text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center justify-center transition-colors border border-slate-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 active:scale-95 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-brand-500 hover:bg-brand-400 text-white'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-700/50">
              {[
                { icon: '✅', text: 'Quality Guaranteed' },
                { icon: '🚀', text: 'Fast Shipping' },
                { icon: '🔄', text: '30-Day Returns' },
              ].map(badge => (
                <div key={badge.text} className="text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-slate-400 text-xs">{badge.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
