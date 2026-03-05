import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const CATEGORIES = [
  { name: 'Brakes', icon: '🛑', desc: 'Pads, rotors, calipers, lines', count: '120+' },
  { name: 'Engine', icon: '⚙️', desc: 'Filters, belts, gaskets, seals', count: '350+' },
  { name: 'Suspension', icon: '🔧', desc: 'Shocks, springs, control arms', count: '90+' },
  { name: 'Electrical', icon: '⚡', desc: 'Alternators, starters, sensors', count: '200+' },
  { name: 'Cooling', icon: '🌡️', desc: 'Radiators, thermostats, fans', count: '75+' },
  { name: 'Fuel System', icon: '⛽', desc: 'Pumps, injectors, filters', count: '60+' },
];

export default function CategoriesPage() {
  const router = useRouter();
  const { cat } = router.query;

  if (cat) {
    router.push(`/products?category=${cat}`);
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>Categories – AutoParts Store</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="section-title mb-3">SHOP BY CATEGORY</h1>
          <p className="text-slate-400">Browse our extensive catalog by category</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="card p-8 text-center hover:border-brand-500/50 hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="text-5xl mb-4">{cat.icon}</div>
              <h2 className="text-white text-xl font-bold mb-2 group-hover:text-brand-400 transition-colors">{cat.name}</h2>
              <p className="text-slate-400 text-sm mb-3">{cat.desc}</p>
              <span className="text-brand-400 font-semibold text-sm">{cat.count} parts →</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
