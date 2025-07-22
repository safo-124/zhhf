'use client';

import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { HandHeart, Menu, X } from "lucide-react";
import { Footer } from '@/components/public/footer';
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const ListItem = React.forwardRef(function ListItem({ className, title, children, ...props }, ref) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-800 focus:bg-blue-800",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-white">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-blue-200">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


export default function PublicLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Reusable links array for both mobile and desktop
  const aboutLinks = [
    { href: "/about", title: "About Us", description: "Our mission, vision, and story." },
    { href: "/stories", title: "Success Stories", description: "The real-life impact of our work." },
    { href: "/gallery", title: "Gallery", description: "Photos from our events and community." },
    { href: "/contact", title: "Contact Us", description: "Get in touch with our team." },
  ];
  
  const workLinks = [
    { href: "/events", title: "Events", description: "Join us at our upcoming community events." },
    { href: "/blog", title: "Blog & News", description: "Stay updated with our latest articles." },
    { href: "/campaigns", title: "Campaigns", description: "Support a specific fundraising cause." },
  ];
  
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full bg-blue-950 text-white shadow-md">
        <div className="container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <HandHeart className="h-7 w-7" />
            <span className="text-xl font-bold">ZHHF</span>
          </Link>
          
          {/* --- Desktop Navigation Menu --- */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent text-sm font-medium hover:bg-blue-800 focus:bg-blue-800 data-[active]:bg-blue-800 data-[state=open]:bg-blue-800">
                    About
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-blue-900">
                      {aboutLinks.map((item) => (
                        <ListItem key={item.title} href={item.href} title={item.title}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                   <NavigationMenuTrigger className="bg-transparent text-sm font-medium hover:bg-blue-800 focus:bg-blue-800 data-[active]:bg-blue-800 data-[state=open]:bg-blue-800">
                    Our Work
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-blue-900">
                      {workLinks.map((item) => (
                        <ListItem key={item.title} href={item.href} title={item.title}>
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                   <Link href="/volunteer" legacyBehavior passHref>
                    <NavigationMenuLink className="bg-transparent text-sm font-medium hover:bg-blue-800 focus:bg-blue-800 data-[active]:bg-blue-800 data-[state=open]:bg-blue-800 px-4 py-2 rounded-md">
                      Volunteer
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Link href="/donate">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">Donate</Button>
              </Link>
            </div>
            {/* --- Mobile Menu Button --- */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className="hover:bg-blue-800"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- Animated Full-Screen Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-blue-950 z-40 flex flex-col items-center justify-center"
          >
            <Button variant="ghost" size="icon" className="absolute top-6 right-5 text-white hover:bg-blue-800" onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
              <X className="h-8 w-8" />
            </Button>
            <nav className="flex flex-col items-center space-y-6">
              {[...aboutLinks, ...workLinks].map((link) => (
                <Link key={link.href} href={link.href} className="text-3xl font-bold text-white hover:text-green-400" onClick={() => setIsMenuOpen(false)}>
                  {link.title}
                </Link>
              ))}
              <Link href="/donate" className="pt-8">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 rounded-md">Donate</Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}