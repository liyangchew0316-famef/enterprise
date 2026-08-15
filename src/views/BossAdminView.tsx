import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, MaterialSpool, Product } from '../types';
import { generateExecutiveReportPDF, generateOrderInvoicePDF } from '../utils/pdfGenerator';
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
  Eye,
  FileText,
  Paintbrush,
  Sparkles,
  ExternalLink,
  Sliders
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
    generateExecutiveReportPDF({
      generatedAt: new Date().toISOString(),
      totalRevenue,
      totalOrders: orders.length,
      activeJobs,
      orders,
      spools
    });
    showToast('Executive Admin PDF Report generated & downloaded!', 'success');
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
                  <td className="p-4 max-w-xs">
                    <div className="space-y-1">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-gray-900 font-bold">{i.name} (x{i.quantity})</span>
                          {i.isCustomPrint ? (
                            <span className="text-[10px] font-extrabold bg-red-100 text-[#af101a] px-1.5 py-0.5 rounded-sm">
                              Custom 3D
                            </span>
                          ) : (i.customDetails || i.customText) ? (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-sm">
                              Customized
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
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
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-gray-100 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-xl text-gray-900">Order #{selectedOrder.id}</h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-[#af101a]">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed on {new Date(selectedOrder.date).toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-4 overflow-y-auto pr-1">
              
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-1">
                  <strong className="block text-gray-900 font-bold uppercase text-[10px] tracking-wider text-gray-400">Customer Details</strong>
                  <p className="font-bold text-gray-800 text-sm">{selectedOrder.customer.fullName}</p>
                  <p className="text-gray-600">{selectedOrder.customer.email}</p>
                  <p className="text-gray-600">{selectedOrder.customer.phone}</p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-1">
                  <strong className="block text-gray-900 font-bold uppercase text-[10px] tracking-wider text-gray-400">Shipping Address</strong>
                  <p className="text-gray-700 font-medium leading-relaxed">
                    {selectedOrder.customer.address}, {selectedOrder.customer.postcode} {selectedOrder.customer.city}, {selectedOrder.customer.state}
                  </p>
                  {selectedOrder.customer.notes && (
                    <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 mt-1">
                      <strong>Note:</strong> {selectedOrder.customer.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Items List with Custom Details */}
              <div className="space-y-3">
                <strong className="block text-gray-900 font-bold uppercase text-[10px] tracking-wider text-gray-400">
                  Ordered Items ({selectedOrder.items.length})
                </strong>

                {selectedOrder.items.map((it, idx) => {
                  const hasCustomization = Boolean(
                    it.isCustomPrint || 
                    it.customDetails || 
                    it.customText || 
                    it.drawingImage || 
                    it.customImageUrl || 
                    it.fileUrl ||
                    it.imageUrl ||
                    it.customPrintDetails
                  );

                  const customImageRef = it.drawingImage || it.customImageUrl || it.fileUrl || (it.imageUrl && it.isCustomPrint ? it.imageUrl : undefined);
                  const specs = it.customPrintDetails || {};
                  const infill = it.infillPercent || specs.infillPercent;
                  const layerH = it.layerHeight || specs.layerHeight;
                  const scale = it.scalePercent || specs.scalePercent;
                  const fileName = it.fileName || specs.fileName || specs.designTitle;
                  const instructions = it.specialInstructions || specs.specialInstructions;
                  const customTextDesc = it.customDetails || it.customText;

                  return (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                      
                      {/* Item Main Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-heading font-extrabold text-sm text-gray-900">{it.name}</h4>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 font-bold rounded-md text-[11px]">
                              Qty: {it.quantity}
                            </span>
                            {it.isCustomPrint ? (
                              <span className="px-2 py-0.5 bg-red-100 text-[#af101a] font-extrabold rounded-md text-[10px] uppercase">
                                Custom 3D Print
                              </span>
                            ) : (customTextDesc || hasCustomization) ? (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-extrabold rounded-md text-[10px] uppercase">
                                Customized
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 font-medium rounded-md text-[10px]">
                                Standard Product
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                            {it.color && (
                              <span>Color: <strong className="text-gray-800">{it.color}</strong></span>
                            )}
                            {it.material && (
                              <span>Material: <strong className="text-gray-800">{it.material}</strong></span>
                            )}
                            <span>Unit Price: <strong className="text-gray-800">RM {it.price.toFixed(2)}</strong></span>
                          </div>
                        </div>

                        <div className="text-right sm:self-center">
                          <span className="text-xs text-gray-400 block sm:inline mr-1">Subtotal:</span>
                          <span className="font-extrabold text-sm text-gray-900">
                            RM {(it.price * it.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Custom Print / Customization Section */}
                      {hasCustomization && (
                        <div className="p-3 bg-red-50/40 rounded-xl border border-red-100/80 space-y-2.5">
                          <div className="flex items-center gap-1.5 text-[#af101a] font-bold text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#af101a]" />
                            <span>Custom Print / Customization Details:</span>
                          </div>

                          {/* Full Un-truncated Customer Custom Text / Description */}
                          {customTextDesc && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200/80">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                                Customer Specification / Instructions:
                              </span>
                              <p className="text-xs text-gray-800 font-medium whitespace-pre-wrap break-words leading-relaxed">
                                {customTextDesc}
                              </p>
                            </div>
                          )}

                          {/* Slicing & Engineering Attributes */}
                          {(fileName || infill || layerH || scale || instructions) && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                              {fileName && (
                                <div className="bg-white p-2 rounded-lg border border-gray-200/70">
                                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Design / File</span>
                                  <span className="font-bold text-gray-800 truncate block text-[11px]">{fileName}</span>
                                </div>
                              )}
                              {infill && (
                                <div className="bg-white p-2 rounded-lg border border-gray-200/70">
                                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Infill Density</span>
                                  <span className="font-bold text-gray-800 block text-[11px]">{infill}%</span>
                                </div>
                              )}
                              {layerH && (
                                <div className="bg-white p-2 rounded-lg border border-gray-200/70">
                                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Layer Height</span>
                                  <span className="font-bold text-gray-800 block text-[11px]">{layerH}mm</span>
                                </div>
                              )}
                              {scale && (
                                <div className="bg-white p-2 rounded-lg border border-gray-200/70">
                                  <span className="text-[10px] text-gray-400 font-bold block uppercase">Scale</span>
                                  <span className="font-bold text-gray-800 block text-[11px]">{scale}%</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Special instructions if separated */}
                          {instructions && instructions !== customTextDesc && (
                            <div className="bg-white p-2.5 rounded-lg border border-gray-200/80">
                              <span className="text-[10px] font-bold uppercase text-gray-400 block mb-0.5">
                                Additional Notes:
                              </span>
                              <p className="text-xs text-gray-800 whitespace-pre-wrap break-words">
                                {instructions}
                              </p>
                            </div>
                          )}

                          {/* Uploaded / Drawn Image Reference */}
                          {customImageRef && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200/80 space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                                Custom Upload / Artwork Reference:
                              </span>
                              <div className="flex items-center gap-3">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                                  <img 
                                    src={customImageRef} 
                                    alt="Custom 3D Print Design" 
                                    className="w-full h-full object-contain"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="space-y-1 text-xs">
                                  <span className="font-bold text-gray-800 block">Custom Drawing / Model Visual</span>
                                  <p className="text-[11px] text-gray-500">Design captured from customer custom creator.</p>
                                  {customImageRef.startsWith('http') && (
                                    <a
                                      href={customImageRef}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#af101a] hover:underline"
                                    >
                                      <span>Open full-resolution file</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Order Financials Breakdown */}
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>RM {selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee:</span>
                  <span>{selectedOrder.shipping === 0 ? 'FREE (RM 0.00)' : `RM ${selectedOrder.shipping.toFixed(2)}`}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-RM {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>SST (6%):</span>
                  <span>RM {selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-extrabold text-sm">
                  <span className="text-gray-900">Total Amount Paid ({selectedOrder.paymentMethod.toUpperCase()}):</span>
                  <span className="text-[#af101a]">RM {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100 shrink-0">
              <button
                onClick={() => generateOrderInvoicePDF(selectedOrder)}
                className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-[#af101a] font-bold rounded-xl text-xs border border-red-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>Download Invoice PDF</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-[#1a1c1c] hover:bg-gray-800 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
