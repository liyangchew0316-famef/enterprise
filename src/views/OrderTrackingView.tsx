import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { 
  Search, 
  Truck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PackageCheck, 
  Copy,
  Printer
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { orders, trackedOrderId, setTrackedOrderId, showToast } = useApp();
  const [inputSearchId, setInputSearchId] = useState(trackedOrderId);

  const matchedOrder = orders.find(o => o.id.toLowerCase() === inputSearchId.trim().toLowerCase());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSearchId.trim()) {
      setTrackedOrderId(inputSearchId.trim());
    }
  };

  const copyTracking = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied tracking code ${code} to clipboard!`, 'success');
  };

  const steps: { status: OrderStatus; label: string; desc: string; icon: string }[] = [
    { status: 'Pending', label: 'Order Received', desc: 'Payment verified & queued for slicing', icon: '📝' },
    { status: 'Slicing', label: 'STL Slicing', desc: 'Generating GCode toolpaths & mesh check', icon: '💻' },
    { status: 'Printing', label: '3D Printing in Studio', desc: 'Active print job on CoreXY bed', icon: '🖨️' },
    { status: 'Printed', label: 'Quality Inspection', desc: 'Hand-inspected, deburred & packaged', icon: '✨' },
    { status: 'Shipped', label: 'Dispatched with Courier', desc: 'Handed over for express delivery', icon: '🚚' }
  ];

  const getStepState = (stepStatus: OrderStatus) => {
    if (!matchedOrder) return 'upcoming';
    const statusOrder: OrderStatus[] = ['Pending', 'Slicing', 'Printing', 'Printed', 'Shipped', 'Delivered'];
    const currentIndex = statusOrder.indexOf(matchedOrder.status);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs text-center space-y-4">
        <div className="w-14 h-14 bg-red-50 text-[#af101a] rounded-2xl flex items-center justify-center mx-auto text-2xl">
          🚚
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#1a1c1c]">
          Live Order & Parcel Tracker
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Track your 3D printed order in real time as it moves from gcode slicing to studio fabrication and courier dispatch.
        </p>

        {/* Search input bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. CBI-8892)"
              value={inputSearchId}
              onChange={(e) => setInputSearchId(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm focus:outline-hidden focus:border-[#af101a] uppercase font-bold"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#af101a] text-white font-extrabold text-xs rounded-xl hover:bg-[#8d0a12] transition-colors"
          >
            Track Order
          </button>
        </form>
      </div>

      {/* Main Order Result */}
      {!matchedOrder ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-3">
          <div className="text-3xl">📦</div>
          <h3 className="font-heading font-bold text-gray-800 text-lg">Order #{inputSearchId || '—'} Not Found</h3>
          <p className="text-xs text-gray-500">Please check your order confirmation code received after placing an order.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Order Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase block">ORDER ID</span>
                <span className="font-heading font-extrabold text-2xl text-[#1a1c1c]">#{matchedOrder.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-red-100 text-[#af101a] rounded-full">
                  Status: {matchedOrder.status}
                </span>
                {matchedOrder.trackingNumber && (
                  <button
                    onClick={() => copyTracking(matchedOrder.trackingNumber!)}
                    className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{matchedOrder.trackingNumber}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Studio Printer Feed Simulation */}
            {matchedOrder.status === 'Printing' && (
              <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-2xl border border-gray-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#af101a] font-bold flex items-center gap-2">
                    <Printer className="w-4 h-4 animate-pulse" />
                    PRINTER #04 — BAMBU LAB X1-CARBON (ACTIVE)
                  </span>
                  <span className="text-gray-400">Bed: 60°C | Nozzle: 220°C</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#af101a] h-full w-2/3 animate-pulse" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Layer 185 / 280 (66% complete)</span>
                  <span>Est. completion: 22 mins</span>
                </div>
              </div>
            )}

            {/* Step Timeline */}
            <div className="pt-4 space-y-6">
              <h3 className="font-heading font-bold text-sm text-gray-800 uppercase tracking-wider">
                Production & Delivery Steps
              </h3>

              <div className="space-y-4">
                {steps.map((step, idx) => {
                  const state = getStepState(step.status);

                  return (
                    <div key={step.status} className="flex gap-4 items-start">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${
                        state === 'completed' ? 'bg-emerald-600 text-white border-emerald-600' :
                        state === 'current' ? 'bg-[#af101a] text-white border-[#af101a] ring-4 ring-red-100' :
                        'bg-gray-100 text-gray-400 border-gray-300'
                      }`}>
                        {state === 'completed' ? '✓' : step.icon}
                      </div>

                      <div className="flex-1 pt-1">
                        <div className="flex items-baseline justify-between">
                          <h4 className={`font-bold text-sm ${state === 'current' ? 'text-[#af101a]' : 'text-gray-900'}`}>
                            {step.label}
                          </h4>
                          {state === 'current' && (
                            <span className="text-[10px] bg-red-100 text-[#af101a] font-extrabold px-2 py-0.5 rounded uppercase">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Customer & Items Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-heading font-bold text-sm text-gray-900 uppercase">Customer Information</h4>
              <div className="space-y-1.5 text-gray-600">
                <div><strong className="text-gray-800">Name:</strong> {matchedOrder.customer.fullName}</div>
                <div><strong className="text-gray-800">Email:</strong> {matchedOrder.customer.email}</div>
                <div><strong className="text-gray-800">Phone:</strong> {matchedOrder.customer.phone}</div>
                <div><strong className="text-gray-800">Address:</strong> {matchedOrder.customer.address}, {matchedOrder.customer.city}, {matchedOrder.customer.state} {matchedOrder.customer.postcode}</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 text-xs">
              <h4 className="font-heading font-bold text-sm text-gray-900 uppercase">Items Ordered</h4>
              <div className="space-y-2">
                {matchedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <strong className="text-gray-900 block">{it.name}</strong>
                      <span className="text-gray-500">{it.color} • {it.material} x{it.quantity}</span>
                    </div>
                    <span className="font-bold text-gray-900">RM {(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
