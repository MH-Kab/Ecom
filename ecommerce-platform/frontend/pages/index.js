import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/api';

const CATEGORIES = [
  { name: 'Brakes', icon: '🛑', desc: 'Pads, rotors, calipers' },
  { name: 'Engine', icon: '⚙️', desc: 'Filters, belts, gaskets' },
  { name: 'Suspension', icon: '🔧', desc: 'Shocks, springs, arms' },
  { name: 'Electrical', icon: '⚡', desc: 'Alternators, starters, sensors' },
  { name: 'Cooling', icon: '🌡️', desc: 'Radiators, thermostats' },
  { name: 'Fuel System', icon: '⛽', desc: 'Pumps, injectors, filters' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(res => {
        const all = res.data.products || [];
        setFeaturedProducts(all.filter(p => p.featured).slice(0, 4));
      })
      .catch(() => setFeaturedProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Head>
        <title>AutoParts Store – Quality Car Parts</title>
        <meta name="description" content="Find premium automotive parts at competitive prices. Fast shipping, expert support." />
      </Head>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #f97316 0%, transparent 50%), radial-gradient(circle at 80% 50%, #ea580c 0%, transparent 50%)'
            }}
          />
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '64px 64px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              Premium Automotive Parts
            </div>

            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-white tracking-wider mb-4 leading-none">
              EVERY PART
              <br />
              <span className="text-brand-400">YOUR CAR</span>
              <br />
              NEEDS
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Quality OEM and aftermarket auto parts. Fast shipping, competitive prices, and expert customer support.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="btn-primary text-base px-8 py-4">
                Shop All Parts
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link href="/track-order" className="btn-secondary text-base px-8 py-4">
                Track Order
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Parts' },
              { value: '48h', label: 'Shipping' },
              { value: '99%', label: 'Satisfaction' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl sm:text-4xl text-brand-400 tracking-wide">{stat.value}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">SHOP BY CATEGORY</h2>
          <p className="text-slate-400">Find parts by the type you need</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={`/categories?cat=${cat.name}`}
              className="card p-4 text-center hover:border-brand-500/50 hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="text-white font-medium text-sm group-hover:text-brand-400 transition-colors">{cat.name}</div>
              <div className="text-slate-500 text-xs mt-0.5">{cat.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="section-title mb-2">FEATURED PARTS</h2>
            <p className="text-slate-400">Top-selling products this week</p>
          </div>
          <Link href="/products" className="btn-secondary hidden sm:flex">
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link href="/products" className="btn-secondary inline-flex">
            View All Products
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-slate-800/30 border-y border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-3">WHY CHOOSE US</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '✅', title: 'Quality Guaranteed', desc: 'All parts meet OEM specifications and are rigorously tested.' },
              { icon: '🚀', title: 'Fast Shipping', desc: 'Orders ship within 24 hours. Most areas receive delivery in 48 hours.' },
              { icon: '💬', title: 'Expert Support', desc: 'Our technicians are available 6 days a week to help you find the right part.' },
              { icon: '🔄', title: 'Easy Returns', desc: '30-day hassle-free return policy on all parts and accessories.' },
            ].map(item => (
              <div key={item.title} className="card p-6 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-brand-600/20 to-brand-500/10 border border-brand-500/30 rounded-2xl p-10">
          <h2 className="section-title mb-4">READY TO ORDER?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Browse our catalog, add parts to your cart, and place your order in minutes via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-primary text-base px-8 py-4">
              Start Shopping
            </Link>
            <Link href="/track-order" className="btn-secondary text-base px-8 py-4">
              Track Existing Order
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
