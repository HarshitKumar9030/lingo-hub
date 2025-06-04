'use client';

import { Suspense } from 'react';
import { EnhancedStoriesClient } from '@/components/story/ClientOnlyStories';

export default function StoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading stories...</span>
        </div>
      </div>
    }>
      <EnhancedStoriesClient />
    </Suspense>
  );
}
