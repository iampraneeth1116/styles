import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[var(--accent)] border-t border-[var(--border)] py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-bold tracking-tighter mb-4 text-[var(--primary)]">STYLES</h3>
                    <p className="text-sm text-[var(--muted)] max-w-xs">
                        Elevating everyday essentials with uncompromising quality and timeless aesthetics.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-[var(--primary)]">Shop</h4>
                    <ul className="space-y-2 text-sm text-[var(--muted)]">
                        <li><Link href="/products?category=new" className="hover:text-[var(--primary)] transition-colors">New Arrivals</Link></li>
                        <li><Link href="/products?category=men" className="hover:text-[var(--primary)] transition-colors">Men</Link></li>
                        <li><Link href="/products?category=women" className="hover:text-[var(--primary)] transition-colors">Women</Link></li>
                        <li><Link href="/products?category=accessories" className="hover:text-[var(--primary)] transition-colors">Accessories</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-[var(--primary)]">Company</h4>
                    <ul className="space-y-2 text-sm text-[var(--muted)]">
                        <li><Link href="/about" className="hover:text-[var(--primary)] transition-colors">About Us</Link></li>
                        <li><Link href="/contact" className="hover:text-[var(--primary)] transition-colors">Contact</Link></li>
                        <li><Link href="/careers" className="hover:text-[var(--primary)] transition-colors">Careers</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-4 text-[var(--primary)]">Legal</h4>
                    <ul className="space-y-2 text-sm text-[var(--muted)]">
                        <li><Link href="/privacy" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-[var(--primary)] transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center text-xs text-[var(--muted)]">
                <p>&copy; {new Date().getFullYear()} Styles. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <span className="hover:text-[var(--primary)] cursor-pointer transition-colors">Instagram</span>
                    <span className="hover:text-[var(--primary)] cursor-pointer transition-colors">Twitter</span>
                    <span className="hover:text-[var(--primary)] cursor-pointer transition-colors">Pinterest</span>
                </div>
            </div>
        </footer>
    );
}
