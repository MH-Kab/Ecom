import Head from 'next/head';
import Layout from '../../components/Layout';

export default function ShippingPolicy() {
  return (
    <Layout>
      <Head><title>Shipping Policy – AutoParts Store</title></Head>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="section-title mb-8">SHIPPING POLICY</h1>
        <div className="card p-8 prose prose-invert prose-slate max-w-none">
          <h2 className="text-white text-xl font-semibold mb-3">Processing Time</h2>
          <p className="text-slate-300 mb-6">All orders are processed within 1-2 business days. Orders placed on weekends or holidays are processed on the next business day.</p>

          <h2 className="text-white text-xl font-semibold mb-3">Delivery Time</h2>
          <p className="text-slate-300 mb-6">Standard delivery takes 2-5 business days. Express delivery (1-2 business days) is available at an additional cost. Delivery times may vary based on location.</p>

          <h2 className="text-white text-xl font-semibold mb-3">Shipping Costs</h2>
          <p className="text-slate-300 mb-6">Free shipping on orders over $100. Standard shipping is $8.99 for orders under $100. Express shipping is $18.99.</p>

          <h2 className="text-white text-xl font-semibold mb-3">Order Tracking</h2>
          <p className="text-slate-300">Once your order ships, you will receive a tracking number via WhatsApp. You can also track your order using our <a href="/track-order" className="text-brand-400">Track Order</a> page.</p>
        </div>
      </div>
    </Layout>
  );
}
