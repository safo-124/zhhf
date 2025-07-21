'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PaginationControls({ currentPage, totalPages, basePath }) {
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between mt-6">
      <Link href={`${basePath}?page=${currentPage - 1}`} passHref>
        <Button variant="outline" disabled={!hasPreviousPage}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
      </Link>
      
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Link href={`${basePath}?page=${currentPage + 1}`} passHref>
        <Button variant="outline" disabled={!hasNextPage}>
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}