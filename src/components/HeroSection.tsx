import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, Smartphone } from 'lucide-react';

const HERO_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/69a854155280f8ce1208150d_1772639358165_8e92e47e.png';
const REPAIR_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/69a854155280f8ce1208150d_1772639421750_d5552e99.jpg';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Main Hero */}
      <div className="relative bg-gradient-to-br from-[#1a1f3a] via-[#1a2550] to-[#0c1a3a] min-h-[600px] flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
          <div className="absolute top-40 right-40 w-48 h-48 bg-orange-500 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-cyan-300 text-sm font-medium">Authorized Dealer - All Major Brands</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Your One-Stop
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Mobile Shop
                </span>
                & Repair Center
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-lg leading-relaxed">
                Latest smartphones at the best prices. Expert repairs in 30 minutes or less. 
                Free shipping on all orders with 1-year warranty.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
                >
                  <Smartphone className="w-5 h-5" />
                  Shop Phones
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/repair"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all border border-white/20 hover:border-white/40"
                >
                  <Wrench className="w-5 h-5" />
                  Book Repair
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
                <div>
                  <p className="text-3xl font-bold text-white">10K+</p>
                  <p className="text-gray-400 text-sm">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-gray-400 text-sm">Phone Models</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">30min</p>
                  <p className="text-gray-400 text-sm">Avg Repair Time</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative">
                <img
                  src={HERO_IMAGE}
                  alt="Latest smartphones"
                  className="w-full rounded-2xl shadow-2xl"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Expert Repairs</p>
                      <p className="text-xs text-gray-500">Starting at $29.99</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Repair Banner */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={REPAIR_IMAGE} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-lg">Cracked Screen? We Fix It Fast!</p>
                <p className="text-white/80 text-sm">Most repairs completed in under 30 minutes with genuine parts</p>
              </div>
            </div>
            <Link
              to="/repair"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors whitespace-nowrap"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
