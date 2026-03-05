import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Wrench, Monitor, Battery, Droplets, Cpu, Wifi, HardDrive, Camera, Headphones, Check, Clock, Shield, DollarSign } from 'lucide-react';

const REPAIR_SERVICES = [
  { icon: Monitor, title: 'Screen Repair', desc: 'Cracked or broken screen replacement', price: 'From $49', time: '30 min', color: 'bg-blue-500' },
  { icon: Battery, title: 'Battery Replacement', desc: 'New battery for extended life', price: 'From $29', time: '20 min', color: 'bg-green-500' },
  { icon: Droplets, title: 'Water Damage', desc: 'Liquid damage repair & recovery', price: 'From $59', time: '1-2 hrs', color: 'bg-cyan-500' },
  { icon: Cpu, title: 'Motherboard Repair', desc: 'Component-level board repair', price: 'From $79', time: '2-4 hrs', color: 'bg-purple-500' },
  { icon: Wifi, title: 'Charging Port', desc: 'Port cleaning or replacement', price: 'From $39', time: '30 min', color: 'bg-orange-500' },
  { icon: HardDrive, title: 'Data Recovery', desc: 'Recover lost files and data', price: 'From $49', time: '1-3 hrs', color: 'bg-red-500' },
  { icon: Camera, title: 'Camera Repair', desc: 'Front or rear camera fix', price: 'From $39', time: '30 min', color: 'bg-pink-500' },
  { icon: Headphones, title: 'Speaker/Mic Fix', desc: 'Audio component repair', price: 'From $29', time: '20 min', color: 'bg-yellow-500' },
];

const BRANDS = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Motorola', 'Other'];

export default function RepairBookingPage() {
  const [formData, setFormData] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    device_brand: '', device_model: '', issue_type: '', issue_description: '',
    preferred_date: '', preferred_time: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { error: dbError } = await supabase.from('repair_bookings').insert([formData]);
    if (dbError) {
      setError('Failed to submit booking. Please try again.');
      setSubmitting(false);
      return;
    }
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1f3a] via-[#1a2550] to-[#0c1a3a] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
            <Wrench className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-300 text-sm font-medium">Certified Technicians</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Expert Phone Repair</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Fast, reliable repairs with genuine parts. Most fixes completed in under 30 minutes.
            All repairs come with a 90-day warranty.
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-sm text-gray-300">30-Min Service</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-sm text-gray-300">90-Day Warranty</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-sm text-gray-300">Transparent Pricing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Services Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#1a1f3a] mb-2 text-center">Our Repair Services</h2>
          <p className="text-gray-500 text-center mb-8">Professional repairs for all major brands</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {REPAIR_SERVICES.map((service, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-cyan-200 transition-all group cursor-pointer"
                onClick={() => setFormData({ ...formData, issue_type: service.title })}
              >
                <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{service.desc}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#1a1f3a]">{service.price}</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {service.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#1a1f3a] mb-2">Book a Repair</h2>
            <p className="text-gray-500 mb-8">Fill in the details below and we'll get back to you with a quote.</p>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
                <p className="text-gray-500 mb-6">We'll contact you shortly to confirm your appointment.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ customer_name: '', customer_email: '', customer_phone: '', device_brand: '', device_model: '', issue_type: '', issue_description: '', preferred_date: '', preferred_time: '' }); }}
                  className="text-cyan-600 hover:underline font-medium"
                >
                  Book another repair
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input type="text" name="customer_name" value={formData.customer_name} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                    <input type="email" name="customer_email" value={formData.customer_email} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                    <input type="tel" name="customer_phone" value={formData.customer_phone} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" placeholder="(123) 456-7890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Device Brand *</label>
                    <select name="device_brand" value={formData.device_brand} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm">
                      <option value="">Select brand</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Device Model *</label>
                    <input type="text" name="device_model" value={formData.device_model} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" placeholder="e.g. iPhone 16 Pro" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Type *</label>
                    <select name="issue_type" value={formData.issue_type} onChange={handleChange} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm">
                      <option value="">Select issue</option>
                      {REPAIR_SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Date</label>
                    <input type="date" name="preferred_date" value={formData.preferred_date} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Time</label>
                    <select name="preferred_time" value={formData.preferred_time} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm">
                      <option value="">Select time</option>
                      <option value="9:00 AM">9:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="1:00 PM">1:00 PM</option>
                      <option value="2:00 PM">2:00 PM</option>
                      <option value="3:00 PM">3:00 PM</option>
                      <option value="4:00 PM">4:00 PM</option>
                      <option value="5:00 PM">5:00 PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Describe the Issue</label>
                  <textarea name="issue_description" value={formData.issue_description} onChange={handleChange} rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
                    placeholder="Tell us more about the problem..." />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white py-4 rounded-xl font-semibold text-lg transition-all disabled:opacity-50 shadow-lg"
                >
                  {submitting ? 'Submitting...' : 'Submit Repair Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
