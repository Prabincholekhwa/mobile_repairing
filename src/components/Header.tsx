import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  Wrench,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopDropdown, setShopDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      const { data } = await supabase
        .from("ecom_collections")
        .select("id, title, handle")
        .eq("is_visible", true);
      if (data) setCollections(data);
    };
    fetchCollections();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#1a1f3a] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="tel:+1234567890"
              className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">9860058092</span>
            </a>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:inline text-gray-300">
              Shipping All Over Nepal
            </span>
          </div>
          <Link
            to="/repair"
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
          >
            <Wrench className="w-3 h-3" />
            Emergency Repair
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-bold text-[#1a1f3a]">
                KG<span className="text-cyan-500">Traders</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>

              {/* Shop Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShopDropdown(true)}
                onMouseLeave={() => setShopDropdown(false)}
              >
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 rounded-lg hover:bg-gray-50 transition-colors">
                  Shop <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {shopDropdown && (
                  <div className="absolute top-full left-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                    <Link
                      to="/products"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors font-medium"
                    >
                      All Products
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        to={`/collections/${col.handle}`}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
                      >
                        {col.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/repair"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Repair Services
              </Link>
              <Link
                to="/collections/hot-deals"
                className="px-3 py-2 text-sm font-medium text-orange-500 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
              >
                Deals
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                {userDropdown && (
                  <div className="absolute top-full right-0 bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-600 mb-2">
                          Sign in at checkout
                        </p>
                        <Link
                          to="/checkout"
                          onClick={() => setUserDropdown(false)}
                          className="block text-center bg-[#1a1f3a] text-white text-sm py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                          Go to Checkout
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-cyan-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white py-3 px-4">
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phones, accessories, brands..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white py-4 px-4">
            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                All Products
              </Link>
              {collections.map((col) => (
                <Link
                  key={col.id}
                  to={`/collections/${col.handle}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg pl-8"
                >
                  {col.title}
                </Link>
              ))}
              <Link
                to="/repair"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Repair Services
              </Link>
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cart ({cartCount})
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
