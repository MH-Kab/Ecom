import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/api';

const CATEGORIES = ['All', 'Brakes', 'Engine', 'Suspension', 'Electrical', 'Cooling', 'Fuel System'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const router = useRouter();

  useEffect(() => {
    if (router.query.category) setCategory(router.query.category);
    if (router.query.search) setSearch(router.query.search);
  }, [router.query]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category && category !== 'All') params.category = category;
    if (search) params.search = search;

    getProducts(params)
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const val = e.target.searchInput.value;
    setSearch(val);
  };

  return (
    <Layout>
      <Head>
        <title>All Products – AutoParts Store</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">ALL PRODUCTS</h1>
          <p className="text-slate-400">{products.length} parts available</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              name="searchInput"
              type="text"
              defaultValue={search}
              placeholder="Search by name or part number..."
              className="input flex-1"
            />
            <button type="submit" className="btn-primary px-4 py-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton h-48" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-white font-medium text-lg mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); }}
              className="btn-secondary mt-4 inline-flex"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
