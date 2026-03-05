import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Clock, CheckCircle, Loader2, Wrench, AlertCircle, Phone, Mail, Calendar, Cpu, FileText, User, ArrowRight, Shield, Package } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: any; description: string }> = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    icon: Clock,
    description: 'Your repair request has been received and is awaiting review by our technicians.'
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: Wrench,
    description: 'A technician is currently working on your device. We\'ll update you when it\'s ready.'
  },
  completed: {
    label: 'Completed',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    icon: CheckCircle,
    description: 'Your repair is complete! You can pick up your device at our store.'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    icon: AlertCircle,
    description: 'This repair request has been cancelled.'
  }
};

const PROGRESS_STEPS = [
  { key: 'pending', label: 'Received' },
  { key: 'in-progress', label: 'Repairing' },
  { key: 'completed', label: 'Ready' },
];

function getStepIndex(status: string) {
  if (status === 'pending') return 0;
  if (status === 'in-progress') return 1;
  if (status === 'completed') return 2;
  return -1;
}

export default function RepairTrackPage() {
  const [searchType, setSearchType] = useState<'id' | 'email'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setLoading(true);
    setError('');
    setBookings([]);
    setSearched(true);

    try {
      let query = supabase.from('repair_bookings').select('*');

      if (searchType === 'id') {
        // Search by booking ID (first 8 chars or full UUID)
        const searchTerm = searchValue.trim();
        if (searchTerm.length <= 8) {
          // Partial ID search - get all and filter client-side
          const { data, error: dbError } = await query.order('created_at', { ascending: false });
          if (dbError) throw dbError;
          const filtered = (data || []).filter(b => 
            b.id.toUpperCase().startsWith(searchTerm.toUpperCase()) ||
            b.id.slice(0, 8).toUpperCase() === searchTerm.toUpperCase()
          );
          setBookings(filtered);
        } else {
          const { data, error: dbError } = await query.eq('id', searchTerm);
          if (dbError) throw dbError;
          setBookings(data || []);
        }
      } else {
        const { data, error: dbError } = await query
          .eq('customer_email', searchValue.trim().toLowerCase())
          .order('created_at', { ascending: false });
        if (dbError) throw dbError;
        setBookings(data || []);
      }
    } catch (err: any) {
      setError('Failed to search. Please check your input and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1f3a] via-[#1a2550] to-[#0c1a3a] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Package className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Real-Time Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Repair</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Enter your booking ID or email address to check the current status of your repair.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8 relative z-10">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setSearchType('id'); setSearchValue(''); setSearched(false); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                searchType === 'id'
                  ? 'bg-[#1a1f3a] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" /> Search by Booking ID
            </button>
            <button
              onClick={() => { setSearchType('email'); setSearchValue(''); setSearched(false); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                searchType === 'email'
                  ? 'bg-[#1a1f3a] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mail className="w-4 h-4" /> Search by Email
            </button>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder={searchType === 'id' ? 'Enter booking ID (e.g. A1B2C3D4)' : 'Enter your email address'}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Track
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && !loading && bookings.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mb-8">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No repairs found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any repair bookings matching your {searchType === 'id' ? 'booking ID' : 'email address'}.
            </p>
            <Link
              to="/repair"
              className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Book a new repair <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {bookings.map(booking => {
          const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
          const StatusIcon = statusConfig.icon;
          const currentStep = getStepIndex(booking.status);

          return (
            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              {/* Status Header */}
              <div className={`${statusConfig.bgColor} border-b p-6`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      booking.status === 'completed' ? 'bg-green-100' :
                      booking.status === 'in-progress' ? 'bg-blue-100' :
                      booking.status === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${statusConfig.color}`}>{statusConfig.label}</h3>
                      <p className="text-sm text-gray-600">{statusConfig.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono bg-white/80 px-3 py-1.5 rounded-lg">
                    #{booking.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>

                {/* Progress Bar */}
                {booking.status !== 'cancelled' && (
                  <div className="flex items-center gap-2 mt-4">
                    {PROGRESS_STEPS.map((step, i) => (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            i <= currentStep
                              ? 'bg-cyan-500 text-white shadow-md'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {i < currentStep ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              i + 1
                            )}
                          </div>
                          <span className={`text-xs mt-1 font-medium ${i <= currentStep ? 'text-cyan-700' : 'text-gray-400'}`}>
                            {step.label}
                          </span>
                        </div>
                        {i < PROGRESS_STEPS.length - 1 && (
                          <div className={`flex-1 h-1 rounded-full ${i < currentStep ? 'bg-cyan-500' : 'bg-gray-200'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Device Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Device Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Device</p>
                          <p className="text-sm font-medium text-gray-900">{booking.device_brand} {booking.device_model}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Wrench className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Issue Type</p>
                          <p className="text-sm font-medium text-gray-900">{booking.issue_type}</p>
                        </div>
                      </div>
                      {booking.issue_description && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-400">Description</p>
                            <p className="text-sm text-gray-700">{booking.issue_description}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Booking Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Customer</p>
                          <p className="text-sm font-medium text-gray-900">{booking.customer_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-400">Submitted</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      {booking.estimated_cost && (
                        <div className="flex items-center gap-3">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Estimated Cost</p>
                            <p className="text-sm font-bold text-[#1a1f3a]">${(booking.estimated_cost / 100).toFixed(2)}</p>
                          </div>
                        </div>
                      )}
                      {booking.estimated_completion && (
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-400">Estimated Completion</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(booking.estimated_completion).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technician Notes */}
                {booking.technician_notes && (
                  <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-semibold text-blue-900">
                        Technician Notes
                        {booking.technician_name && <span className="font-normal text-blue-600"> — {booking.technician_name}</span>}
                      </h4>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">{booking.technician_notes}</p>
                  </div>
                )}

                {/* Contact */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                  <a href="tel:+1234567890" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                    <Phone className="w-4 h-4" /> (123) 456-7890
                  </a>
                  <a href="mailto:hello@mobilehub.com" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                    <Mail className="w-4 h-4" /> hello@mobilehub.com
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {/* Help Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-16">
          <h3 className="text-lg font-bold text-[#1a1f3a] mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <FileText className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Lost your Booking ID?</p>
                <p className="text-xs text-gray-500 mt-1">Try searching with your email address instead.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Call Us</p>
                <p className="text-xs text-gray-500 mt-1">Reach us at (123) 456-7890 for immediate help.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Wrench className="w-5 h-5 text-cyan-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">New Repair?</p>
                <p className="text-xs text-gray-500 mt-1">
                  <Link to="/repair" className="text-cyan-600 hover:underline">Book a repair</Link> online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
