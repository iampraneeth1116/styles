import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/Button';

export default function Hero() {
    return (
        <section className="relative w-full h-[85vh] bg-[var(--accent)] overflow-hidden">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/images/hero_men_women.png"
                    alt="Styles Featured Collection - Men and Women"
                    fill
                    className="object-cover object-center transition-transform duration-10000 hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-black/5" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-xl">
                    <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary)] mb-4 bg-white/80 backdrop-blur-sm px-3 py-1">
                        New Collection 2026
                    </span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-[var(--primary)] mb-6 leading-[0.9]">
                        ELEVATED <br />
                        SIMPLICITY
                    </h1>
                    <p className="text-lg text-[var(--primary)]/80 mb-10 max-w-md leading-relaxed">
                        Discover a curated selection of premium essentials designed for the modern wardrobe. Timeless aesthetics, uncompromising quality.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products?category=men">
                            <Button size="lg" className="w-full sm:w-auto">
                                Explore Men
                            </Button>
                        </Link>
                        <Link href="/products?category=women">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur-sm">
                                Explore Women
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                <div className="w-[1px] h-12 bg-[var(--primary)]/20" />
            </div>
        </section>
    );
}
