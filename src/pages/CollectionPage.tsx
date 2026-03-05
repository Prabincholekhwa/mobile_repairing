import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Loader2 } from 'lucide-react';

export default function CollectionPage() {
  const { handle } = useParams<{ handle: string }>();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionProducts = async () => {
      if (!handle) return;
      setLoading(true);

      const { data: collectionData } = await supabase
        .from('ecom_collections')
        .select('*')
        .eq('handle', handle)
        .single();

      if (!collectionData) {
        setLoading(false);
        return;
      }
      setCollection(collectionData);

      const { data: productLinks } = await supabase
        .from('ecom_product_collections')
        .select('product_id, position')
        .eq('collection_id', collectionData.id)
        .order('position');

      if (!productLinks || productLinks.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      const productIds = productLinks.map(pl => pl.product_id);
      const { data: productsData } = await supabase
        .from('ecom_products')
        .select('*, variants:ecom_product_variants(*)')
        .in('id', productIds)
        .eq('status', 'active');

      const sortedProducts = productIds
        .map(id => productsData?.find(p => p.id === id))
        .filter(Boolean);

      setProducts(sortedProducts as any[]);
      setLoading(false);
    };

    fetchCollectionProducts();
  }, [handle]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-cyan-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/products" className="hover:text-cyan-600">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">{collection?.title || 'Collection'}</span>
        </nav>

        {/* Collection Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1f3a] mb-2">{collection?.title || 'Collection'}</h1>
          {collection?.description && (
            <p className="text-gray-500">{collection.description}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">{products.length} products</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No products in this collection</h2>
            <Link to="/products" className="text-cyan-600 hover:underline">Browse all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
