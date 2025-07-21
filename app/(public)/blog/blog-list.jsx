'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { format } from "date-fns";

export function BlogList({ allPosts }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-10 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search for an article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-lg"
        />
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
              <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                <div className="relative aspect-video w-full">
                  <Image
                    src={post.imageUrl || '/placeholder.svg'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary">{post.title}</CardTitle>
                  <CardDescription>
                    {format(new Date(post.createdAt), "MMMM do, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No articles found matching your search.</p>
        </div>
      )}
    </>
  );
}