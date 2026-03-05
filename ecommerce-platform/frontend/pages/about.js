import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head><title>About Us – AutoParts Store</title></Head>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="section-title mb-6">ABOUT US</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <p className="text-slate-300 leading-relaxed mb-4">
              AutoParts Store has been serving automotive professionals and DIY enthusiasts since 2018.
              We stock over 10,000 quality OEM and aftermarket parts for all major vehicle makes and models.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our team of certified automotive technicians is always available to help you find the right part
              for your vehicle — saving you time and money.
            </p>
            <Link href="/products" className="btn-primary inline-flex mt-2">
              Shop Now
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { icon: '🏆', title: 'Quality First', desc: 'Every part meets strict OEM quality standards' },
              { icon: '🚀', title: 'Fast Delivery', desc: 'Orders ship within 24 hours, most arrive in 48h' },
              { icon: '💬', title: 'Expert Support', desc: 'Talk to our mechanics 6 days a week' },
              { icon: '🔄', title: '30-Day Returns', desc: 'Not satisfied? Return within 30 days' },
            ].map(item => (
              <div key={item.title} className="flex gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
