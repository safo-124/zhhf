'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HandHeart } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center text-center text-white">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(to right, #1e3a8a, #047857)",
            "linear-gradient(to right, #064e3b, #1e40af)",
            "linear-gradient(to right, #1e3a8a, #047857)",
          ],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
        {/* Animated Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
        >
          Zion Helping Hand Foundation
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-2xl text-lg text-blue-100"
        >
          Bringing hope and support to our community, one helping hand at a time.
        </motion.p> {/* <-- THIS TAG IS NOW CORRECT */}

        {/* Pulsing "Donate" Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10"
        >
          <Link href="/donate">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-200 text-lg px-8 py-6 rounded-full shadow-2xl font-bold">
                Donate Now <HandHeart className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}