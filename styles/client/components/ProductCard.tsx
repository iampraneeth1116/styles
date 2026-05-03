import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Check, Heart } from 'lucide-react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
}

export function ProductCard({ id, name, price, category, imageUrl }: ProductCardProps) {
    const { addItem: addCartItem } = useCart();
    const { addItem: addWishlistItem, removeItem: removeWishlistItem, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const router = useRouter();
    const [added, setAdded] = useState(false);

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push('/login');
            return;
        }

        addCartItem({ id, name, price, category, imageUrl }, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInWishlist(id)) {
            removeWishlistItem(id);
        } else {
            addWishlistItem({ id, name, price, category, imageUrl });
        }
    };

    return (
        <div className="group flex flex-col cursor-pointer">
            <Link href={`/products/${id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--accent)] mb-4">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[var(--muted)] text-sm">
                        {name}
                    </div>
                )}

                {/* Quick add overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-10 flex gap-2">
                    <Button
                        variant="primary"
                        className="flex-1 shadow-lg"
                        size="sm"
                        onClick={handleQuickAdd}
                    >
                        {added ? (
                            <span className="flex items-center justify-center">
                                <Check className="h-4 w-4 mr-2" /> Added
                            </span>
                        ) : 'Quick Add'}
                    </Button>
                    <Button
                        variant="outline"
                        className="shadow-lg px-3 bg-white/90 backdrop-blur-sm hover:bg-white text-[var(--primary)] border-transparent"
                        size="sm"
                        onClick={handleWishlist}
                        aria-label={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart className={`h-4 w-4 ${isInWishlist(id) ? 'fill-[var(--primary)] text-[var(--primary)]' : 'text-[var(--primary)]'}`} />
                    </Button>
                </div>
            </Link>

            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-[var(--muted)] mb-1 uppercase tracking-wider">{category}</p>
                    <Link href={`/products/${id}`}>
                        <h3 className="text-sm font-medium text-[var(--primary)] group-hover:text-[var(--muted)] transition-colors">
                            {name}
                        </h3>
                    </Link>
                </div>
                <p className="text-sm font-medium text-[var(--primary)]">${price.toFixed(2)}</p>
            </div>
        </div>
    );
}
