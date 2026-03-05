import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Truck,
  Award,
  Wrench,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("ecom_collections")
      .select("id, title, handle")
      .eq("is_visible", true)
      .then(({ data }) => {
        if (data) setCollections(data);
      });
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#1a1f3a] text-white">
      {/* Trust Badges */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-400">On all orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">1 Year Warranty</p>
                <p className="text-xs text-gray-400">On all devices</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Expert Repairs</p>
                <p className="text-xs text-gray-400">30-min service</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Authorized Dealer</p>
                <p className="text-xs text-gray-400">Genuine products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                KG<span className="text-cyan-400">Traders</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your trusted destination for the latest smartphones, accessories,
              and expert repair services. Authorized dealer for all major
              brands.
            </p>
            <div className="flex gap-3">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-white/5 hover:bg-cyan-500/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  <span className="text-xs text-gray-400 uppercase font-bold">
                    {social[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  All Products
                </Link>
              </li>
              {collections.slice(0, 5).map((col) => (
                <li key={col.id}>
                  <Link
                    to={`/collections/${col.handle}`}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {col.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/repair"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Screen Repair
                </Link>
              </li>
              <li>
                <Link
                  to="/repair"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Battery Replacement
                </Link>
              </li>
              <li>
                <Link
                  to="/repair"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Water Damage
                </Link>
              </li>
              <li>
                <Link
                  to="/repair"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Software Issues
                </Link>
              </li>
              <li>
                <Link
                  to="/repair"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Data Recovery
                </Link>
              </li>
              <li>
                <Link
                  to="/repair"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Book a Repair
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">Jagati, Bhaktapur</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="mob: 9860058092"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  9860058092
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <a
                  href="mailto:kgtraders@gmail.com"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  kgtraders@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                <div className="text-gray-400 text-sm">
                  <p>Sun-Fri: 9AM - 9PM</p>
                  <p>Saturday: 9AM - 12PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-1">Stay Updated</h3>
              <p className="text-gray-400 text-sm">
                Get the latest deals and new arrivals straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">
            &copy; 2026 KGTraders. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-300 text-xs transition-colors"
            >
              Return Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
