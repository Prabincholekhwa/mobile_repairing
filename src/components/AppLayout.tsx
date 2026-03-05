import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Star, Wrench, Monitor, Battery, Droplets, Cpu, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const REPAIR_HIGHLIGHTS = [
  { icon: Monitor, title: 'Screen Repair', desc: 'From $49 · 30 min', color: 'from-blue-500 to-blue-600' },
  { icon: Battery, title: 'Battery Swap', desc: 'From $29 · 20 min', color: 'from-green-500 to-green-600' },
  { icon: Droplets, title: 'Water Damage', desc: 'From $59 · 1-2 hrs', color: 'from-cyan-500 to-cyan-600' },
  { icon: Cpu, title: 'Board Repair', desc: 'From $79 · 2-4 hrs', color: 'from-purple-500 to-purple-600' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', text: 'Got my iPhone screen fixed in 25 minutes! Amazing service and the price was very fair. Highly recommend MobileHub.', rating: 5, device: 'iPhone 16 Pro' },
  { name: 'James K.', text: 'Bought a Samsung Galaxy S25 Ultra here. Best price I found anywhere and they set everything up for me. Great experience!', rating: 5, device: 'Galaxy S25 Ultra' },
  { name: 'Emily R.', text: 'My phone fell in water and I thought it was gone. They recovered everything including my photos. Lifesavers!', rating: 5, device: 'Pixel 9 Pro' },
  { name: 'Michael T.', text: 'The battery replacement was quick and affordable. My phone feels brand new again. Will definitely come back.', rating: 4, device: 'iPhone 15' },
  { name: 'Lisa W.', text: 'Excellent selection of accessories. Found the perfect case and charger. Staff was very helpful and knowledgeable.', rating: 5, device: 'OnePlus 13' },
];

const BRANDS = [
  { name: 'Apple', logo: 'A' },
  { name: 'Samsung', logo: 'S' },
  { name: 'Google', logo: 'G' },
  { name: 'OnePlus', logo: 'O' },
  { name: 'Xiaomi', logo: 'X' },
  { name: 'Huawei', logo: 'H' },
];

export default function AppLayout() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [dealProducts, setDealProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch featured products
      const { data: featured } = await supabase
        .from('ecom_products')
        .select('*, variants:ecom_product_variants(*)')
        .eq('status', 'active')
        .contains('tags', ['featured'])
        .limit(8);
      if (featured) setFeaturedProducts(featured);

      // Fetch deal products
      const { data: deals } = await supabase
        .from('ecom_products')
        .select('*, variants:ecom_product_variants(*)')
        .eq('status', 'active')
        .contains('tags', ['deal'])
        .limit(4);
      if (deals) setDealProducts(deals);

      // Fetch collections
      const { data: cols } = await supabase
        .from('ecom_collections')
        .select('id, title, handle, description')
        .eq('is_visible', true);
      if (cols) setCollections(cols);

      setLoading(false);
    };
    fetchData();
  }, []);

  const nextTestimonial = () => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prevTestimonial = () => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      {/* Collections */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1a1f3a] mb-2">Shop by Category</h2>
          <p className="text-gray-500">Browse our curated collections</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map(col => (
            <Link
              key={col.id}
              to={`/collections/${col.handle}`}
              className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-cyan-200 transition-all text-center"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#1a1f3a] to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-lg">{col.title[0]}</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-cyan-600 transition-colors">{col.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#1a1f3a] mb-2">Featured Phones</h2>
            <p className="text-gray-500">The latest and greatest smartphones</p>
          </div>
          <Link to="/products" className="hidden sm:inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-5 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center mt-8 sm:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 text-cyan-600 font-medium">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Repair Services */}
      <section className="bg-gradient-to-br from-[#1a1f3a] via-[#1a2550] to-[#0c1a3a] py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">Professional Repair Center</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Expert Phone Repairs</h2>
            <p className="text-gray-400">Most repairs completed in under 30 minutes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {REPAIR_HIGHLIGHTS.map((service, i) => (
              <Link key={i} to="/repair" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-1">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link to="/repair" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg">
              <Wrench className="w-5 h-5" /> Book a Repair <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hot Deals */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-[#1a1f3a] mb-2">Hot Deals</h2>
              <p className="text-gray-500">Incredible prices on top phones</p>
            </div>
            <Link to="/collections/hot-deals" className="hidden sm:inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium transition-colors">
              All Deals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a1f3a] mb-2">Authorized Dealer</h2>
            <p className="text-gray-500">We carry genuine products from all major brands</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {BRANDS.map(brand => (
              <Link
                key={brand.name}
                to={`/products?search=${brand.name}`}
                className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-cyan-50 hover:shadow-md transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:shadow-md transition-shadow">
                  <span className="text-2xl font-bold text-[#1a1f3a] group-hover:text-cyan-600 transition-colors">{brand.logo}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-cyan-600 transition-colors">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#1a1f3a] mb-2">What Our Customers Say</h2>
          <p className="text-gray-500">Trusted by thousands of happy customers</p>
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <Quote className="w-10 h-10 text-cyan-200 mx-auto mb-4" />
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              "{TESTIMONIALS[testimonialIndex].text}"
            </p>
            <div className="flex items-center justify-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < TESTIMONIALS[testimonialIndex].rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <p className="font-semibold text-gray-900">{TESTIMONIALS[testimonialIndex].name}</p>
            <p className="text-sm text-gray-500">{TESTIMONIALS[testimonialIndex].device}</p>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prevTestimonial} className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${i === testimonialIndex ? 'bg-cyan-500 w-6' : 'bg-gray-300'}`}
                />
              ))}
            </div>
            <button onClick={nextTestimonial} className="p-2 bg-white rounded-full shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Upgrade Your Phone?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Browse our collection of the latest smartphones or bring in your device for expert repair.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="bg-white text-[#1a1f3a] px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Shop Now
            </Link>
            <Link to="/repair" className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-colors">
              Book Repair
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
