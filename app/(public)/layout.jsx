'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { HandHeart, Menu, X } from "lucide-react";
import { Footer } from '@/components/public/footer';

function PublicHeader({ isMenuOpen, setIsMenuOpen }) {
  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/stories", label: "Stories" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <HandHeart className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">ZHHF</span>
          </Link>
          {/* --- Desktop Navigation --- */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link href="/donate" className="hidden sm:block">
              <Button className="bg-green-600 hover:bg-green-700">Donate</Button>
          </Link>
          
          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


export default function PublicLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/about", label: "About Us" },
    { href: "/events", label: "Events" },
    { href: "/blog", label: "Blog" },
    { href: "/stories", label: "Stories" },
    { href: "/campaigns", label: "Campaigns" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];
  
  return (
    <div className="relative flex min-h-screen flex-col">
      <PublicHeader isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      {/* --- Animated Mobile Menu Panel --- */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, y: 0 },
          closed: { opacity: 0, y: "-100%" },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute top-16 left-0 w-full bg-background shadow-lg md:hidden z-40"
      >
        <nav className="flex flex-col items-start space-y-1 p-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-lg w-full p-2 rounded-md hover:bg-muted"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              {link.label}
            </Link>
          ))}
          <Link href="/donate" className="w-full pt-4">
            <Button className="w-full bg-green-600 hover:bg-green-700">Donate</Button>
          </Link>
        </nav>
      </motion.div>
      
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}