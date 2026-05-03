'use client';

import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: { name: string };
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.products
      .getAll({ limit: 4 })
      .then((data) => {
        setProducts(data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message);
        setLoaded(true);
      });
  }, []);

  const displayProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category?.name || '',
    imageUrl: p.images?.[0] || '',
  }));

  return (
    <div>
      <Hero />

      {/* Featured Products Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter text-[var(--primary)] mb-2">FEATURED PIECES</h2>
            <p className="text-[var(--muted)]">Our most coveted styles, curated for you.</p>
          </div>
          <Link href="/products?type=all" className="hidden sm:flex items-center text-sm font-semibold text-[var(--primary)] group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="mt-12 sm:hidden text-center">
          <Link href="/products?type=all">
            <Button variant="outline" className="w-full">View All Products</Button>
          </Link>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="py-24 bg-[var(--accent)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/products?category=men" className="group relative aspect-square md:aspect-[16/9] overflow-hidden bg-white">
              <Image
                src="/images/category_men.png"
                alt="Shop Men's Premium Collection"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <h3 className="text-3xl font-bold tracking-tighter text-white mb-4 uppercase drop-shadow-md">Men</h3>
                <span className="text-sm font-medium border-b border-white text-white pb-1 transition-all group-hover:pr-4 drop-shadow-md">Shop Collection</span>
              </div>
            </Link>
            <Link href="/products?category=women" className="group relative aspect-square md:aspect-[16/9] overflow-hidden bg-white">
              <Image
                src="/images/category_women.png"
                alt="Shop Women's Premium Collection"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <h3 className="text-3xl font-bold tracking-tighter text-white mb-4 uppercase drop-shadow-md">Women</h3>
                <span className="text-sm font-medium border-b border-white text-white pb-1 transition-all group-hover:pr-4 drop-shadow-md">Shop Collection</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--muted)] mb-6 block">Our Philosophy</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-[var(--primary)] mb-8 leading-tight">
          WE BELIEVE IN CLOTHES THAT EMPOWER, <br />
          NOT OVERWHELM.
        </h2>
        <p className="text-lg text-[var(--muted)] leading-relaxed mb-10">
          Styles was born from a desire to return to the basics. We strip away the noise of fast fashion to focus on what truly matters: exceptional materials, ethical craftsmanship, and a silhouette that stands the test of time.
        </p>
        <Link href="/about" className="text-sm font-bold border-b-2 border-[var(--primary)] pb-1">
          Read Our Story
        </Link>
      </section>
    </div>
  );
}
