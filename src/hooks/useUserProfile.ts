'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  nativeLanguage?: string;
  targetLanguage?: string;
  progress?: {
    wordsLearned: number;
    storiesCompleted: string[];
    currentLevel: number;
    streakDays: number;
    lastLoginDate: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export function useUserProfile() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session?.user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/profile');
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setError('Failed to fetch profile');
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      setError('Error fetching profile');
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
  };

  const updateAvatar = (avatar: { url: string; publicId: string } | undefined) => {
    setProfile(prev => prev ? { ...prev, avatar } : null);
  };

  useEffect(() => {
    if (status === 'loading') return;
    fetchProfile();
  }, [session, status]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar
  };
}
