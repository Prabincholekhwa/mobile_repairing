import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Wrench, Clock, CheckCircle, AlertCircle, Search, RefreshCw, Save, ChevronDown, ChevronUp, Filter, Loader2, User, Cpu, Calendar, FileText, X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

export default function RepairAdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const ADMIN_PASSWORD = 'mobilehub2026';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === ADMIN_PASSWORD) {
      setAuthenticated(true);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('repair_bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) fetchBookings();
  }, [authenticated]);

  const handleUpdate = async (bookingId: string) => {
    const updates = editData[bookingId];
    if (!updates) return;
    setSaving(bookingId);

    const updatePayload: any = { updated_at: new Date().toISOString() };
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.technician_notes !== undefined) updatePayload.technician_notes = updates.technician_notes;
    if (updates.technician_name !== undefined) updatePayload.technician_name = updates.technician_name;
    if (updates.estimated_cost !== undefined) updatePayload.estimated_cost = updates.estimated_cost;
    if (updates.estimated_completion !== undefined) updatePayload.estimated_completion = updates.estimated_completion || null;

    await supabase.from('repair_bookings').update(updatePayload).eq('id', bookingId);
    await fetchBookings();
    setEditData(prev => { const n = { ...prev }; delete n[bookingId]; return n; });
    setSaving(null);
  };

  const getEditValue = (bookingId: string, field: string, fallback: any) => {
    return editData[bookingId]?.[field] ?? fallback;
  };

  const setEditValue = (bookingId: string, field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [bookingId]: { ...(prev[bookingId] || {}), [field]: value }
    }));
  };

  const filteredBookings = bookings
    .filter(b => statusFilter === 'all' || b.status === statusFilter)
    .filter(b => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return b.customer_name?.toLowerCase().includes(q) ||
        b.customer_email?.toLowerCase().includes(q) ||
        b.device_brand?.toLowerCase().includes(q) ||
        b.device_model?.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
    });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    'in-progress': bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-[#1a1f3a] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Wrench className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1f3a] mb-2">Repair Admin Panel</h1>
            <p className="text-gray-500 text-sm mb-6">Enter the admin password to manage repairs.</p>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm mb-4"
              />
              <button type="submit" className="w-full bg-[#1a1f3a] text-white py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors">
                Sign In
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-4">Default password: mobilehub2026</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1f3a]">Repair Management</h1>
            <p className="text-gray-500">Manage and update repair bookings</p>
          </div>
          <button onClick={fetchBookings} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[{ value: 'all', label: 'All' }, ...STATUS_OPTIONS].map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === opt.value
                  ? 'bg-[#1a1f3a] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {opt.label} <span className="ml-1 opacity-70">({(statusCounts as any)[opt.value] || 0})</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, device, or booking ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No repair bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const isExpanded = expandedId === booking.id;
              const statusOpt = STATUS_OPTIONS.find(s => s.value === booking.status) || STATUS_OPTIONS[0];

              return (
                <div key={booking.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusOpt.color}`}>
                      {statusOpt.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{booking.customer_name}</p>
                      <p className="text-xs text-gray-500">{booking.device_brand} {booking.device_model} — {booking.issue_type}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-mono hidden sm:block">#{booking.id.slice(0, 8).toUpperCase()}</span>
                    <span className="text-xs text-gray-400 hidden md:block">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {/* Expanded Edit Panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Info (read-only) */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Info
                          </h4>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <p><span className="text-gray-500">Name:</span> <span className="font-medium">{booking.customer_name}</span></p>
                            <p><span className="text-gray-500">Email:</span> <span className="font-medium">{booking.customer_email}</span></p>
                            <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{booking.customer_phone}</span></p>
                          </div>
                        </div>

                        {/* Device Info (read-only) */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Device Info
                          </h4>
                          <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                            <p><span className="text-gray-500">Brand:</span> <span className="font-medium">{booking.device_brand}</span></p>
                            <p><span className="text-gray-500">Model:</span> <span className="font-medium">{booking.device_model}</span></p>
                            <p><span className="text-gray-500">Issue:</span> <span className="font-medium">{booking.issue_type}</span></p>
                            {booking.issue_description && (
                              <p><span className="text-gray-500">Details:</span> <span className="font-medium">{booking.issue_description}</span></p>
                            )}
                          </div>
                        </div>

                        {/* Editable Fields */}
                        <div className="md:col-span-2">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Wrench className="w-4 h-4" /> Update Repair Status
                          </h4>
                          <div className="bg-white rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                                <select
                                  value={getEditValue(booking.id, 'status', booking.status)}
                                  onChange={e => setEditValue(booking.id, 'status', e.target.value)}
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                  {STATUS_OPTIONS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Technician Name</label>
                                <input
                                  type="text"
                                  value={getEditValue(booking.id, 'technician_name', booking.technician_name || '')}
                                  onChange={e => setEditValue(booking.id, 'technician_name', e.target.value)}
                                  placeholder="e.g. John Smith"
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Cost (cents)</label>
                                <input
                                  type="number"
                                  value={getEditValue(booking.id, 'estimated_cost', booking.estimated_cost || '')}
                                  onChange={e => setEditValue(booking.id, 'estimated_cost', parseInt(e.target.value) || 0)}
                                  placeholder="e.g. 4999 for $49.99"
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Completion</label>
                              <input
                                type="datetime-local"
                                value={getEditValue(booking.id, 'estimated_completion', booking.estimated_completion ? new Date(booking.estimated_completion).toISOString().slice(0, 16) : '')}
                                onChange={e => setEditValue(booking.id, 'estimated_completion', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Technician Notes</label>
                              <textarea
                                value={getEditValue(booking.id, 'technician_notes', booking.technician_notes || '')}
                                onChange={e => setEditValue(booking.id, 'technician_notes', e.target.value)}
                                rows={3}
                                placeholder="Add notes about the repair progress, parts used, etc."
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                              />
                            </div>
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => { setExpandedId(null); setEditData(prev => { const n = { ...prev }; delete n[booking.id]; return n; }); }}
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdate(booking.id)}
                                disabled={saving === booking.id || !editData[booking.id]}
                                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all disabled:opacity-50 shadow-md"
                              >
                                {saving === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
