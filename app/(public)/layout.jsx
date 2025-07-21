import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { HandHeart } from "lucide-react";

function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <HandHeart className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">ZHHF</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/about">About Us</Link>
            <Link href="/events">Events</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/campaigns">Campaigns</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/donate">Donate</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <Link href="/login">
                <Button variant="outline">Admin Login</Button>
            </Link>
        </div>
      </div>
    </header>
  );
}

export default function PublicLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <PublicHeader />
            <main className="flex-1">{children}</main>
        </div>
    );
}