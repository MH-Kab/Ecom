import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { trackOrder } from '../utils/api';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function StatusBadge({ status }) {
  const classes = {
    Pending: 'status-pending',
    Processing: 'status-processing',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
  };
  return (
    <span className={`badge px-3 py-1 rounded-full text-sm font-medium ${classes[status] || 'status-pending'}`}>
      {status}
    </span>
  );
}

function ProgressBar({ status }) {
  const idx = STATUS_STEPS.indexOf(status);
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i <= idx ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-500'
            }`}>
              {i < idx ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : i + 1}
            </div>
            <span className={`text-xs mt-1 hidden sm:block ${i <= idx ? 'text-brand-400' : 'text-slate-600'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
      {/* Progress line */}
      <div className="relative h-1 bg-slate-700 rounded-full mx-4">
        <div
          className="absolute top-0 left-0 h-full bg-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${(idx / (STATUS_STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const [form, setForm] = useState({ orderNumber: '', phone: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setError('');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.orderNumber.trim() || !form.phone.trim()) {
      setError('Please enter both order number and phone number');
      return;
    }

    setLoading(true);
    setOrder(null);
    setError('');

    try {
      const res = await trackOrder(form.orderNumber.trim(), form.phone.trim());
      setOrder(res.data.order);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Track Order – AutoParts Store</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="section-title mb-3">TRACK YOUR ORDER</h1>
          <p className="text-slate-400">Enter your order number and phone to check your delivery status</p>
        </div>

        {/* Search form */}
        <div className="card p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="label">Order Number</label>
              <input
                type="text"
                name="orderNumber"
                value={form.orderNumber}
                onChange={handleChange}
                placeholder="ORD-2026-0001"
                className="input"
              />
            </div>
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                className="input"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order result */}
        {order && (
          <div className="card p-6 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">{order.orderNumber}</h2>
                <p className="text-slate-400 text-sm">{order.orderDate}</p>
              </div>
              <StatusBadge status={order.deliveryStatus} />
            </div>

            <ProgressBar status={order.deliveryStatus} />

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="mt-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <p className="text-slate-400 text-sm mb-1">Tracking Number</p>
                <p className="text-brand-400 font-mono font-bold text-lg">{order.trackingNumber}</p>
              </div>
            )}

            {/* Products */}
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">Items Ordered</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-700/30 last:border-0">
                    <div>
                      <p className="text-brand-400 text-xs font-mono">{item.partNumber}</p>
                      <p className="text-white text-sm">{item.name}</p>
                    </div>
                    <span className="text-slate-400 text-sm">Qty: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <h3 className="text-white font-semibold mb-2">Delivery Address</h3>
              <p className="text-slate-400 text-sm">{order.customer.address}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
