import Link from 'next/link';
import { HandHeart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <HandHeart className="h-8 w-8 text-green-400" />
            <span className="text-xl font-bold text-white">ZHHF</span>
          </Link>
          <p className="text-sm">
            Empowering our community, together.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-green-400">About Us</Link></li>
            <li><Link href="/events" className="hover:text-green-400">Events</Link></li>
            <li><Link href="/blog" className="hover:text-green-400">Blog</Link></li>
            <li><Link href="/gallery" className="hover:text-green-400">Gallery</Link></li>
          </ul>
        </div>

        {/* Column 3: Get Involved */}
        <div>
          <h3 className="font-semibold text-white mb-4">Get Involved</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/donate" className="hover:text-green-400">Donate</Link></li>
            <li><Link href="/volunteer" className="hover:text-green-400">Volunteer</Link></li>
            <li><Link href="/campaigns" className="hover:text-green-400">Campaigns</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-green-400">Contact Us</Link></li>
            <li className="text-slate-400">info@zhhf.org</li>
            <li className="text-slate-400">+233 12 345 6789</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-slate-400">
          &copy; {currentYear} Zion Helping Hand Foundation. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}