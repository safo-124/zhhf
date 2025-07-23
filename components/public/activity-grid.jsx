'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ArrowRight, BookHeart, Calendar, Target, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeMap = {
  Blog: { icon: Newspaper, color: 'text-red-500', href: (item) => `/blog/${item.slug}` },
  Event: { icon: Calendar, color: 'text-red-500', href: (item) => `/events` },
  Campaign: { icon: Target, color: 'text-red-500', href: (item) => `/campaigns/${item.id}` },
  Story: { icon: BookHeart, color: 'text-red-500', href: (item) => `/stories` },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

function ActivityCard({ item, index, className }) {
  const config = typeMap[item.type];
  const Icon = config.icon;

  return (
    <motion.div
      className={cn("w-full", className)}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={index}
    >
      <Link href={config.href(item)} className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
            <Icon className={cn("h-5 w-5", config.color)} />
            <p className={cn("font-semibold", config.color)}>{item.type}</p>
        </div>
        <h3 className="text-xl font-bold mb-3 text-blue-950 flex-grow">{item.title}</h3>
        <span className="font-semibold text-green-700 flex items-center mt-auto opacity-0 group-hover:opacity-100 transition-opacity">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

export function ActivityGrid({ activities }) {
  if (!activities || activities.length === 0) {
    return <p className="text-center text-muted-foreground">No recent activity.</p>;
  }

  // Assign grid span classes to create the "mixed up" layout
  const gridClasses = [
    'lg:col-span-2 lg:row-span-2', // First item is large
    'lg:col-span-1',             // Second item is small
    'lg:col-span-1',             // Third item is small
    'lg:col-span-1',             // Fourth item is small
    'lg:col-span-1',             // etc.
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-6">
      {activities.map((item, index) => (
        <ActivityCard key={`${item.type}-${item.id}`} item={item} index={index} className={gridClasses[index]} />
      ))}
    </div>
  );
}