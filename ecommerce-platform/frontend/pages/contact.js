import Head from 'next/head';
import Layout from '../components/Layout';

export default function Contact() {
  return (
    <Layout>
      <Head><title>Contact Us – AutoParts Store</title></Head>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="section-title mb-8">CONTACT US</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { icon: '📞', label: 'Phone', value: '+1 555 123 4567' },
              { icon: '📧', label: 'Email', value: 'info@autoparts-store.com' },
              { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 8AM – 6PM' },
              { icon: '📍', label: 'Address', value: '123 Auto Drive, Parts City, PC 12345' },
            ].map(item => (
              <div key={item.label} className="card p-4 flex gap-4 items-start">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">{item.label}</p>
                  <p className="text-white font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h2 className="text-white font-semibold mb-4">Send a Message</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Your name" className="input" />
              <input type="email" placeholder="Your email" className="input" />
              <textarea rows={4} placeholder="Your message" className="input resize-none" />
              <button className="btn-primary w-full justify-center">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
