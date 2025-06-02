'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';

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

interface UserProfileContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
  updateAvatar: (avatar: { url: string; publicId: string } | undefined) => void;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const profileData = useUserProfile();

  return (
    <UserProfileContext.Provider value={profileData}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
}
