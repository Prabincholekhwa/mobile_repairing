import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShoppingCart, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check, Cpu, Camera, Battery, Monitor } from 'lucide-react';

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setSelectedVariant(null);
      setSelectedSize('');
      setQuantity(1);
      setLoading(true);

      const { data } = await supabase
        .from('ecom_products')
        .select('*, variants:ecom_product_variants(*)')
        .eq('handle', handle)
        .single();

      if (data) {
        let variants = data.variants || [];
        if (data.has_variants && variants.length === 0) {
          const { data: variantData } = await supabase
            .from('ecom_product_variants')
            .select('*')
            .eq('product_id', data.id)
            .order('position');
          variants = variantData || [];
          data.variants = variants;
        }

        setProduct(data);
        if (variants.length > 0) {
          const sorted = [...variants].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
          const firstInStock = sorted.find((v: any) => v.inventory_qty == null || v.inventory_qty > 0) || sorted[0];
          setSelectedVariant(firstInStock);
          setSelectedSize(firstInStock?.option1 || '');
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [handle]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const variant = product?.variants?.find((v: any) =>
      v.option1 === size || v.title?.toLowerCase().includes(size.toLowerCase())
    );
    if (variant) setSelectedVariant(variant);
  };

  const variantSizes = [...new Set(product?.variants?.map((v: any) => v.option1).filter(Boolean) || [])];
  const hasVariants = product?.has_variants && product?.variants?.length > 0;

  const getInStock = (): boolean => {
    if (selectedVariant) {
      if (selectedVariant.inventory_qty == null) return true;
      return selectedVariant.inventory_qty > 0;
    }
    if (product?.variants && product.variants.length > 0) {
      return product.variants.some((v: any) => v.inventory_qty == null || v.inventory_qty > 0);
    }
    if (product?.has_variants) return true;
    if (product?.inventory_qty == null) return true;
    return product.inventory_qty > 0;
  };
  const inStock = getInStock();

  const handleAddToCart = () => {
    if (!product) return;
    if (hasVariants && !selectedSize) return;
    if (!inStock) return;

    addToCart({
      product_id: product.id,
      variant_id: selectedVariant?.id || undefined,
      name: product.name,
      variant_title: selectedVariant?.title || selectedSize || undefined,
      sku: selectedVariant?.sku || product.sku || product.handle,
      price: selectedVariant?.price || product.price,
      image: product.images?.[0],
    }, quantity);

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const currentPrice = selectedVariant?.price || product?.price || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h2>
          <Link to="/products" className="text-cyan-600 hover:underline">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const specIcons: Record<string, any> = {
    chip: Cpu, camera: Camera, battery: Battery, display: Monitor
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-cyan-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-cyan-600">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="aspect-square relative">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              {product.tags?.includes('deal') && (
                <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  Hot Deal
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-cyan-600 font-semibold uppercase tracking-wider mb-2">{product.vendor}</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1f3a] mb-4">{product.name}</h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1a1f3a]">${(currentPrice / 100).toFixed(2)}</span>
              {hasVariants && <span className="text-sm text-gray-400">for {selectedSize || 'selected'} variant</span>}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            {/* Storage Selector */}
            {variantSizes.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Storage
                </label>
                <div className="flex flex-wrap gap-3">
                  {variantSizes.map((size: string) => {
                    const variant = product.variants?.find((v: any) => v.option1 === size);
                    const sizeInStock = variant ? (variant.inventory_qty == null || variant.inventory_qty > 0) : true;
                    return (
                      <button
                        key={size}
                        onClick={() => sizeInStock && handleSizeSelect(size)}
                        disabled={!sizeInStock}
                        className={`px-6 py-3 border-2 rounded-xl font-medium text-sm transition-all ${
                          selectedSize === size
                            ? 'bg-[#1a1f3a] text-white border-[#1a1f3a]'
                            : sizeInStock
                            ? 'border-gray-200 text-gray-700 hover:border-cyan-400 hover:text-cyan-600'
                            : 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                        {variant && (
                          <span className="block text-xs mt-0.5 opacity-70">
                            ${(variant.price / 100).toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Quantity</label>
              <div className="inline-flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={(hasVariants && !selectedSize) || !inStock}
              className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : !inStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#1a1f3a] to-[#2a3050] text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {addedToCart ? (
                <><Check className="w-5 h-5" /> Added to Cart!</>
              ) : !inStock ? (
                'Out of Stock'
              ) : hasVariants && !selectedSize ? (
                'Select Storage'
              ) : (
                <><ShoppingCart className="w-5 h-5" /> Add to Cart - ${((currentPrice * quantity) / 100).toFixed(2)}</>
              )}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-green-500" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-500" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5 text-orange-500" />
                <span>30-Day Returns</span>
              </div>
            </div>

            {/* Specs */}
            {product.metadata && (
              <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-lg text-[#1a1f3a] mb-4">Key Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.metadata).filter(([k]) => k !== 'storage_options').map(([key, value]) => {
                    const Icon = specIcons[key] || Monitor;
                    return (
                      <div key={key} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                          <p className="text-sm font-medium text-gray-900">{String(value)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
