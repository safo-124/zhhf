'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

export function ShareButtons({ title }) {
  const pathname = usePathname();
  // Ensure you have a base URL for sharing links, especially for production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const urlToShare = `${baseUrl}${pathname}`;

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(urlToShare);

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook className="h-4 w-4" />,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=Check out this link: ${encodedUrl}`,
      icon: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 mt-8">
      <p className="text-sm font-semibold mr-2">Share this post:</p>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.name}`}
        >
          <Button variant="outline" size="icon">
            {link.icon}
          </Button>
        </a>
      ))}
    </div>
  );
}