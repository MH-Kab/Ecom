import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getAdminOrders, updateOrderStatus, getProducts, createProduct, updateProduct, deleteProduct } from '../../utils/api';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered'];

function StatusBadge({ status }) {
  const classes = {
    Pending: 'status-pending',
    Processing: 'status-processing',
    Shipped: 'status-shipped',
    Delivered: 'status-delivered',
  };
  return (
    <span className={`badge px-2.5 py-1 rounded-full text-xs font-medium ${classes[status] || 'status-pending'}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', tracking: '' });
  const [saving, setSaving] = useState(false);
  const [productForm, setProductForm] = useState(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) router.push('/admin/login');
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders({ search, status: statusFilter });
      setOrders(res.data.orders || []);
      setStats(res.data.stats || {});
    } catch (err) {
      if (err.response?.status === 401) router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  const loadProducts = useCallback(async () => {
    try {
      const res = await getProducts();
      setProducts(res.data.products || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'products') loadProducts();
  }, [activeTab, loadOrders, loadProducts]);

  const handleUpdateOrder = async () => {
    if (!selectedOrder || !updateForm.status) return;
    setSaving(true);
    try {
      await updateOrderStatus({
        orderNumber: selectedOrder.orderNumber,
        deliveryStatus: updateForm.status,
        trackingNumber: updateForm.tracking || undefined
      });
      setSelectedOrder(null);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch {}
  };

  const handleSaveProduct = async () => {
    setSaving(true);
    try {
      if (productForm.id) {
        await updateProduct(productForm.id, productForm);
      } else {
        await createProduct(productForm);
      }
      setProductForm(null);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-dark">
      <Head>
        <title>Admin Dashboard – AutoParts</title>
      </Head>

      {/* Sidebar + Content layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col fixed left-0 top-0 hidden md:flex">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zm12 7H5V6h10v5z"/>
                </svg>
              </div>
              <span className="font-display text-xl text-white tracking-wider">ADMIN</span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
              { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-500/10 text-brand-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700/50">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-2 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Store
            </Link>
            <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 min-h-screen">
          {/* Top bar */}
          <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
            <h1 className="text-white font-semibold capitalize">{activeTab}</h1>
            {/* Mobile tab switcher */}
            <div className="flex gap-2 md:hidden">
              <button onClick={() => setActiveTab('orders')} className={`text-xs px-3 py-1.5 rounded-full ${activeTab === 'orders' ? 'bg-brand-500 text-white' : 'text-slate-400 bg-slate-800'}`}>Orders</button>
              <button onClick={() => setActiveTab('products')} className={`text-xs px-3 py-1.5 rounded-full ${activeTab === 'products' ? 'bg-brand-500 text-white' : 'text-slate-400 bg-slate-800'}`}>Products</button>
            </div>
          </div>

          <div className="p-6">
            {/* ─── ORDERS TAB ─────────────────────────────── */}
            {activeTab === 'orders' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Orders', value: stats.total || 0, color: 'text-white' },
                    { label: 'Pending', value: stats.pending || 0, color: 'text-yellow-400' },
                    { label: 'Shipped', value: stats.shipped || 0, color: 'text-purple-400' },
                    { label: 'Delivered', value: stats.delivered || 0, color: 'text-green-400' },
                  ].map(s => (
                    <div key={s.label} className="card p-4">
                      <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                      <p className={`text-3xl font-display tracking-wide ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Search order, customer, phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input flex-1"
                  />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="input sm:w-44"
                  >
                    <option value="all">All Statuses</option>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={loadOrders} className="btn-primary px-4">Refresh</button>
                </div>

                {/* Orders Table */}
                <div className="card overflow-hidden">
                  {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No orders found</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700/50 text-left">
                            <th className="px-4 py-3 text-slate-400 font-medium">Order #</th>
                            <th className="px-4 py-3 text-slate-400 font-medium">Customer</th>
                            <th className="px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Date</th>
                            <th className="px-4 py-3 text-slate-400 font-medium">Items</th>
                            <th className="px-4 py-3 text-slate-400 font-medium">Status</th>
                            <th className="px-4 py-3 text-slate-400 font-medium">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.orderNumber} className="border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-3">
                                <span className="text-brand-400 font-mono text-xs">{order.orderNumber}</span>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-white font-medium">{order.customerName}</p>
                                <p className="text-slate-400 text-xs">{order.phone}</p>
                              </td>
                              <td className="px-4 py-3 text-slate-400 hidden md:table-cell text-xs">{order.orderDate}</td>
                              <td className="px-4 py-3 text-slate-300 text-xs">
                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                              </td>
                              <td className="px-4 py-3"><StatusBadge status={order.deliveryStatus} /></td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setUpdateForm({ status: order.deliveryStatus, tracking: order.trackingNumber || '' });
                                  }}
                                  className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors"
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ─── PRODUCTS TAB ──────────────────────────── */}
            {activeTab === 'products' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-slate-400 text-sm">{products.length} products</p>
                  <button
                    onClick={() => setProductForm({ partNumber:'', name:'', description:'', price:'', category:'', image:'' })}
                    className="btn-primary text-sm"
                  >
                    + Add Product
                  </button>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700/50 text-left">
                          <th className="px-4 py-3 text-slate-400 font-medium">Part #</th>
                          <th className="px-4 py-3 text-slate-400 font-medium">Name</th>
                          <th className="px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Category</th>
                          <th className="px-4 py-3 text-slate-400 font-medium">Price</th>
                          <th className="px-4 py-3 text-slate-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p.id} className="border-b border-slate-700/20 hover:bg-slate-800/30">
                            <td className="px-4 py-3 text-brand-400 font-mono text-xs">{p.partNumber}</td>
                            <td className="px-4 py-3 text-white">{p.name}</td>
                            <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{p.category}</td>
                            <td className="px-4 py-3 text-white">${p.price}</td>
                            <td className="px-4 py-3 flex gap-2">
                              <button
                                onClick={() => setProductForm({ ...p })}
                                className="text-brand-400 hover:text-brand-300 text-xs"
                              >Edit</button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="text-red-500 hover:text-red-400 text-xs"
                              >Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Update Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Update Order</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-brand-400 font-mono text-sm mb-4">{selectedOrder.orderNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="label">Delivery Status</label>
                <select
                  value={updateForm.status}
                  onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))}
                  className="input"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Tracking Number <span className="text-slate-500">(optional)</span></label>
                <input
                  type="text"
                  value={updateForm.tracking}
                  onChange={e => setUpdateForm(f => ({ ...f, tracking: e.target.value }))}
                  placeholder="e.g. 1Z999AA10123456784"
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedOrder(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleUpdateOrder} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {productForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setProductForm(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              {[
                { key: 'partNumber', label: 'Part Number', placeholder: 'PN-1001' },
                { key: 'name', label: 'Product Name', placeholder: 'Brake Pad Set' },
                { key: 'price', label: 'Price (USD)', placeholder: '45', type: 'number' },
                { key: 'category', label: 'Category', placeholder: 'Brakes' },
                { key: 'image', label: 'Image URL', placeholder: '/images/brake-pad.jpg' },
              ].map(field => (
                <div key={field.key}>
                  <label className="label">{field.label}</label>
                  <input
                    type={field.type || 'text'}
                    value={productForm[field.key] || ''}
                    onChange={e => setProductForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="input"
                  />
                </div>
              ))}
              <div>
                <label className="label">Description</label>
                <textarea
                  value={productForm.description || ''}
                  onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="input resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={!!productForm.featured}
                  onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-orange-500"
                />
                <label htmlFor="featured" className="text-slate-300 text-sm">Featured product</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setProductForm(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleSaveProduct} disabled={saving} className="btn-primary flex-1 justify-center">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
