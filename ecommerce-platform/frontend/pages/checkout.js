import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../utils/CartContext';
import { formatPrice } from '../utils/cart';
import { placeOrder } from '../utils/api';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^[\d\s\+\-\(\)]{7,}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const res = await placeOrder({
        customer: {
          name: form.name,
          address: form.address,
          phone: form.phone,
          email: form.email
        },
        items: cart.map(item => ({
          partNumber: item.partNumber,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        comment: form.comment
      });

      const { orderNumber, whatsappUrl } = res.data;

      // Clear cart
      clearCart();

      // Redirect to WhatsApp
      if (whatsappUrl) {
        window.open(whatsappUrl, '_blank');
      }

      // Redirect to success page
      router.push(`/order-success?order=${orderNumber}`);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="text-white text-xl mb-4">Your cart is empty</h2>
          <Link href="/products" className="btn-primary inline-flex">Shop Now</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Checkout – AutoParts Store</title>
      </Head>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="section-title mb-8">CHECKOUT</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="card p-6">
                <h2 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                  <span className="w-7 h-7 bg-brand-500 rounded-full flex items-center justify-center text-sm">1</span>
                  Customer Information
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="label">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 555 000 0000"
                      className={`input ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label">Email <span className="text-slate-500">(optional)</span></label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`input ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="label">Delivery Address *</label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="123 Main St, City, State, ZIP"
                      className={`input resize-none ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="label">Order Comment <span className="text-slate-500">(optional)</span></label>
                    <textarea
                      name="comment"
                      value={form.comment}
                      onChange={handleChange}
                      rows={2}
                      placeholder="E.g. Please deliver after 5pm"
                      className="input resize-none"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-2">
              <div className="card p-6 sticky top-24">
                <h2 className="text-white font-semibold text-lg mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e)=>{e.target.style.display='none'}} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-400 text-xs font-mono">{item.partNumber}</p>
                        <p className="text-white text-sm truncate">{item.name}</p>
                        <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-white text-sm font-medium flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white text-2xl font-display tracking-wide">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order via WhatsApp
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-slate-500 text-xs text-center mt-3">
                  You'll be redirected to WhatsApp to confirm your order
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
