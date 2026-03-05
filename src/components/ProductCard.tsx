import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const getPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const sorted = [...product.variants].sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
      return sorted[0].price;
    }
    return product.price;
  };

  const price = getPrice();
  const hasVariants = product.has_variants && product.variants?.length > 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      const firstVariant = product.variants[0];
      addToCart({
        product_id: product.id,
        variant_id: firstVariant.id,
        name: product.name,
        variant_title: firstVariant.title,
        sku: firstVariant.sku || product.sku,
        price: firstVariant.price,
        image: product.images?.[0],
      });
    } else {
      addToCart({
        product_id: product.id,
        name: product.name,
        sku: product.sku || product.handle,
        price: product.price,
        image: product.images?.[0],
      });
    }
  };

  const isFeatured = product.tags?.includes('featured');
  const isDeal = product.tags?.includes('deal');

  return (
    <Link to={`/products/${product.handle}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {isFeatured && (
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Zap className="w-3 h-3" /> Featured
            </span>
          )}
          {isDeal && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Hot Deal
            </span>
          )}
        </div>

        {/* Free Shipping Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
            Free Shipping
          </span>
        </div>

        {/* Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-4 right-4 bg-[#1a1f3a] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#00d4ff] hover:scale-110 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{product.vendor}</p>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.metadata?.chip && (
            <p className="text-xs text-gray-500 mb-2">{product.metadata.chip}</p>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-[#1a1f3a]">
                ${(price / 100).toFixed(2)}
              </span>
              {hasVariants && (
                <span className="text-xs text-gray-400 ml-1">from</span>
              )}
            </div>
            {product.product_type === 'Smartphone' && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {product.metadata?.display?.split(' ')[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
