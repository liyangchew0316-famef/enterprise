import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, MaterialSpool, Product } from '../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Layers, 
  Download, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Edit,
  Eye
} from 'lucide-react';

export const BossAdminView: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    spools, 
    updateSpoolStock, 
    addSpool, 
    addNewProduct,
    showToast 
  } = useApp();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  // Add Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(15.90);
  const [newProdCategory, setNewProdCategory] = useState<any>('keychains');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800');
  const [newProdDesc, setNewProdDesc] = useState('Custom 3D printed precision accessory from Cabai Maker Studio.');

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const activeJobs = orders.filter(o => o.status === 'Printing' || o.status === 'Slicing').length;
  const lowSpools = spools.filter(s => s.isLow).length;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'hkylovenbx') {
      setIsAuthenticated(true);
      setAuthError('');
      showToast('Welcome Boss! Executive Console Unlocked 🌶️', 'success');
    } else {
      setAuthError('Incorrect Boss Password! Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-[#af101a] rounded-2xl flex items-center justify-center mx-auto text-3xl shadow-inner">
            <ShieldCheck className="w-8 h-8 text-[#af101a]" />
          </div>

          <div>
            <h1 className="font-heading font-extrabold text-2xl text-gray-900">
              Boss Admin Portal
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Protected portal for CABAI ENTERPRISE™ management.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Enter Admin Password
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm focus:outline-hidden focus:border-[#af101a]"
              />
              {authError && (
                <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-sm rounded-xl shadow-md transition-all"
            >
              Authenticate Boss Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      studioName: 'CABAI ENTERPRISE™',
      totalRevenueRM: totalRevenue.toFixed(2),
      totalOrders: orders.length,
      orders: orders.map(o => ({
        id: o.id,
        customer: o.customer.fullName,
        total: o.total,
        status: o.status,
        date: o.date
      })),
      filamentInventory: spools.map(s => ({
        name: s.name,
        stockKg: s.stockKg,
        isLow: s.isLow
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cabai_Enterprise_Admin_Report_${Date.now()}.json`;
    a.click();
    showToast('Executive Admin Report downloaded successfully!', 'success');
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const created: Product = {
      id: `prod-admin-${Date.now()}`,
      name: newProdName,
      subtitle: 'Cabai Collection 🌶️',
      price: newProdPrice,
      rating: 5.0,
      reviewsCount: 1,
      category: newProdCategory,
      tags: ['New Release', 'Studio Original'],
      description: newProdDesc,
      images: [newProdImage],
      specifications: {
        material: 'Premium PLA+',
        weight: '25g',
        dimensions: '60mm x 30mm x 20mm',
        printTime: '1 hr 15 mins',
        layerHeight: '0.16mm High Detail',
        madeToOrder: true
      },
      colors: [
        { name: 'Chili Red', hex: '#af101a', bgClass: 'bg-[#af101a]' },
        { name: 'Matte Black', hex: '#1a1c1c', bgClass: 'bg-[#1a1c1c]' }
      ],
      materials: ['PLA', 'PETG'],
      isNew: true,
      inStock: true,
      stockQuantity: 50
    };

    addNewProduct(created);
    setIsAddProductOpen(false);
    setNewProdName('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Header */}
      <div className="bg-[#1a1c1c] text-white p-6 sm:p-8 rounded-3xl border-b-4 border-[#af101a] shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-extrabold text-xs tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>BOSS ADMIN EXECUTIVE CONSOLE</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            CABAI ENTERPRISE™ Studio Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-[#af101a] hover:bg-[#8d0a12] text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shop Product</span>
          </button>

          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-extrabold text-xs rounded-xl border border-gray-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>

          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPasswordInput('');
              showToast('Admin Portal Locked', 'info');
            }}
            className="px-3 py-2.5 bg-gray-900 hover:bg-red-900 text-gray-300 hover:text-white font-extrabold text-xs rounded-xl border border-gray-800 transition-colors"
          >
            Lock Portal
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#af101a] flex items-center justify-center font-bold text-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase block">Total Revenue</span>
            <span className="font-heading font-extrabold text-xl text-[#1a1c1c]">RM {totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase block">Total Orders</span>
            <span className="font-heading font-extrabold text-xl text-[#1a1c1c]">{orders.length} orders</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase block">Active Print Jobs</span>
            <span className="font-heading font-extrabold text-xl text-[#1a1c1c]">{activeJobs} printing</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-500 font-bold uppercase block">Filament Inventory</span>
            <span className="font-heading font-extrabold text-xl text-[#1a1c1c]">{spools.length} Spools ({lowSpools} low)</span>
          </div>
        </div>

      </div>

      {/* Orders Table Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        
        {/* Table Header Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-[#1a1c1c]">Customer Orders Queue</h2>
            <p className="text-xs text-gray-500">Manage order statuses and slice jobs in real time.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Order ID or Name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#af101a]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-300 rounded-xl text-gray-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Slicing">Slicing</option>
              <option value="Printing">Printing</option>
              <option value="Printed">Printed</option>
              <option value="Shipped">Shipped</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total RM</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 text-xs font-semibold">
                    No customer orders placed yet. Store is live and ready for new orders! 🌶️
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-red-50/20 transition-colors">
                  <td className="p-4 font-mono font-extrabold text-[#af101a]">{order.id}</td>
                  <td className="p-4">
                    <strong className="text-gray-900 block">{order.customer.fullName}</strong>
                    <span className="text-gray-400">{order.customer.email}</span>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="p-4 font-extrabold text-gray-900">RM {order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e: any) => updateOrderStatus(order.id, e.target.value)}
                      className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-gray-100 border border-gray-300 text-gray-800"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Slicing">Slicing</option>
                      <option value="Printing">Printing</option>
                      <option value="Printed">Printed</option>
                      <option value="Shipped">Shipped</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 bg-[#1a1c1c] text-white font-bold rounded-lg hover:bg-[#af101a] transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Spool Inventory Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <h2 className="font-heading font-extrabold text-lg text-[#1a1c1c]">Filament Spool Inventory</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spools.map(spool => (
            <div key={spool.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-gray-900 block font-bold text-sm">{spool.name}</strong>
                  <span className="text-xs text-gray-500">{spool.material} • RM {spool.pricePerKg}/kg</span>
                </div>
                <span className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: spool.colorHex }} />
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Stock Remaining:</span>
                  <span className={spool.isLow ? 'text-red-600 font-extrabold' : 'text-gray-800'}>
                    {spool.stockKg.toFixed(1)} / {spool.maxCapacityKg} kg
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${spool.isLow ? 'bg-red-600' : 'bg-[#af101a]'}`}
                    style={{ width: `${(spool.stockKg / spool.maxCapacityKg) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {spool.isLow && (
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    ⚠️ Low Stock Alert
                  </span>
                )}
                <button
                  onClick={() => updateSpoolStock(spool.id, spool.stockKg + 5.0)}
                  className="ml-auto px-3 py-1 bg-gray-800 hover:bg-[#af101a] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  + Refill (+5kg)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
            <h3 className="font-heading font-extrabold text-lg text-gray-900">Add New Product to Shop</h3>
            
            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Cabai Limited Dragon Figurine"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Price (RM)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="keychains">Keychains</option>
                    <option value="organizers">Desk Organizers</option>
                    <option value="desk">Phone Stands</option>
                    <option value="home">Home & Decor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Image URL</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#af101a] text-white font-bold rounded-xl"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <h3 className="font-heading font-extrabold text-lg text-gray-900">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-gray-500">{selectedOrder.customer.fullName} • {selectedOrder.customer.phone}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="font-bold text-gray-500">✕</button>
            </div>

            <div className="text-xs space-y-2">
              <div className="p-3 bg-gray-50 rounded-xl">
                <strong className="block text-gray-900 font-bold">Shipping Address:</strong>
                {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.postcode}
              </div>

              <div className="space-y-1">
                <strong className="block text-gray-900 font-bold">Items:</strong>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-gray-700">
                    <span>{it.name} ({it.color}, {it.material}) x{it.quantity}</span>
                    <span>RM {(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t flex justify-between font-bold text-sm">
                <span>Total Amount Paid:</span>
                <span className="text-[#af101a]">RM {selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 bg-[#1a1c1c] text-white font-bold rounded-xl text-xs"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
