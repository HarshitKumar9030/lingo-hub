'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useUserProfileContext } from '@/contexts/UserProfileContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  User,
  ChevronLeft,
  Edit,
  Check,
  X,
  Loader2,
  Mail,
  Calendar,
  BookOpen,
  Trophy,
  Flame,
  Target,
  Languages,
  Globe,
  Pencil
} from 'lucide-react';
import Link from 'next/link';

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
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { profile, updateAvatar, fetchProfile: fetchProfileFromContext } = useUserProfileContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    nativeLanguage: '',
    targetLanguage: ''
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      window.location.href = '/auth/signin';
      return;
    }

    // The profile will be loaded by the context
    if (profile) {
      setEditForm({
        name: profile.name || '',
        nativeLanguage: profile.nativeLanguage || '',
        targetLanguage: profile.targetLanguage || ''
      });
      setIsLoading(false);
    }
  }, [session, status, profile]);

  const fetchProfileLocal = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data received:', data);
        fetchProfileFromContext();
        setEditForm({
          name: data.name || '',
          nativeLanguage: data.nativeLanguage || '',
          targetLanguage: data.targetLanguage || ''
        });
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        fetchProfileFromContext();
        setIsEditing(false);
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      // Handle avatar deletion
      try {
        const response = await fetch('/api/upload/avatar', {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchProfileFromContext();
        } else {
          console.error('Failed to delete avatar');
        }
      } catch (error) {
        console.error('Error deleting avatar:', error);
      }
      return;
    }

    // Handle avatar upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        fetchProfileFromContext();
      } else {
        const error = await response.json();
        console.error('Failed to upload avatar:', error.error);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-4 h-4 animate-spin text-[#888]" />
          <span className="text-sm text-[#888]">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm mx-auto px-6">
          <div className="w-12 h-12 bg-[#f0f0f0] dark:bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto">
            <User className="w-6 h-6 text-[#888]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#fafafa]">Profile not found</h2>
            <p className="text-sm text-[#888]">Couldn&apos;t load your profile.</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="text-sm h-9 bg-white dark:bg-[#1a1a1a] border-[#e5e5e5] dark:border-[#333] hover:bg-[#f9f9f9] dark:hover:bg-[#1f1f1f]">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#fafafa]/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#e5e5e5] dark:border-[#1a1a1a]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-[#888] hover:text-[#1a1a1a] dark:hover:text-[#fafafa] h-8 px-2">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#f0f0f0] dark:bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#888]" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#fafafa]">Profile</h1>
                  <p className="text-xs text-[#888]">Manage your account</p>
                </div>
              </div>
            </div>
            
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 text-sm bg-white dark:bg-[#1a1a1a] border-[#e5e5e5] dark:border-[#333] hover:bg-[#f9f9f9] dark:hover:bg-[#1f1f1f]"
              >
                <Pencil className="w-3 h-3 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="h-8 text-sm text-[#888] hover:text-[#1a1a1a] dark:hover:text-[#fafafa]"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="h-8 text-sm bg-[#1a1a1a] dark:bg-[#fafafa] text-white dark:text-[#1a1a1a] hover:bg-[#333] dark:hover:bg-[#e5e5e5]"
                >
                  {isSaving ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-start space-x-6">              <div className="flex-shrink-0">
                <ImageUpload
                  currentImage={profile.avatar?.url || ''}
                  onImageChange={async (imageUrl) => {
                    // If imageUrl is null, treat as delete
                    if (imageUrl === null) {
                      try {
                        const response = await fetch('/api/upload/avatar', {
                          method: 'DELETE',
                        });
                        if (response.ok) {
                          fetchProfileFromContext();
                        } else {
                          console.error('Failed to delete avatar');
                        }
                      } catch (error) {
                        console.error('Error deleting avatar:', error);
                      }
                    } else if (typeof imageUrl === 'string' && imageUrl !== '') {
                      // If imageUrl is a string, treat as new avatar URL (already uploaded)
                      fetchProfileFromContext();
                    }
                  }}
                  fallback={profile.name?.charAt(0) || 'U'}
                  size="lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[#1a1a1a] dark:text-[#fafafa] mb-1">
                      {profile.name || 'Anonymous User'}
                    </h2>
                    <div className="flex items-center text-sm text-[#888] space-x-4">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {profile.email}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#fafafa] dark:bg-[#0a0a0a] rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#1a1a1a] dark:text-[#fafafa] mb-1">
                        {profile.progress?.wordsLearned || 0}
                      </div>
                      <div className="text-xs text-[#888] flex items-center justify-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Words learned
                      </div>
                    </div>
                    
                    <div className="bg-[#fafafa] dark:bg-[#0a0a0a] rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#1a1a1a] dark:text-[#fafafa] mb-1">
                        {profile.progress?.storiesCompleted?.length || 0}
                      </div>
                      <div className="text-xs text-[#888] flex items-center justify-center">
                        <Trophy className="w-3 h-3 mr-1" />
                        Stories completed
                      </div>
                    </div>
                    
                    <div className="bg-[#fafafa] dark:bg-[#0a0a0a] rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#1a1a1a] dark:text-[#fafafa] mb-1">
                        {profile.progress?.streakDays || 0}
                      </div>
                      <div className="text-xs text-[#888] flex items-center justify-center">
                        <Flame className="w-3 h-3 mr-1" />
                        Day streak
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-xl">
            <div className="px-6 py-4 border-b border-[#e5e5e5] dark:border-[#1a1a1a]">
              <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-[#fafafa]">Account information</h3>
              <p className="text-sm text-[#888] mt-1">Update your personal details and preferences</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a] dark:text-[#fafafa]">
                    Display name
                  </label>
                  {isEditing ? (
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Enter your name"
                      className="h-9 bg-[#fafafa] dark:bg-[#0a0a0a] border-[#e5e5e5] dark:border-[#1a1a1a] text-sm"
                    />
                  ) : (
                    <div className="h-9 px-3 bg-[#fafafa] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-md flex items-center text-sm text-[#1a1a1a] dark:text-[#fafafa]">
                      {profile.name || 'Not set'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a] dark:text-[#fafafa]">
                    Email address
                  </label>
                  <div className="h-9 px-3 bg-[#f6f6f6] dark:bg-[#0f0f0f] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-md flex items-center text-sm text-[#888]">
                    {profile.email}
                  </div>
                  <p className="text-xs text-[#888]">Email cannot be changed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a] dark:text-[#fafafa]">
                    Native language
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.nativeLanguage}
                      onChange={(e) => setEditForm({ ...editForm, nativeLanguage: e.target.value })}
                      className="w-full h-9 px-3 bg-[#fafafa] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-md text-sm text-[#1a1a1a] dark:text-[#fafafa] focus:outline-none focus:border-[#888]"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Korean">Korean</option>
                    </select>
                  ) : (
                    <div className="h-9 px-3 bg-[#fafafa] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-md flex items-center text-sm text-[#1a1a1a] dark:text-[#fafafa]">
                      <Globe className="w-4 h-4 mr-2 text-[#888]" />
                      {profile.nativeLanguage || 'Not set'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1a1a1a] dark:text-[#fafafa]">
                    Learning language
                  </label>
                  {isEditing ? (
                    <select
                      value={editForm.targetLanguage}
                      onChange={(e) => setEditForm({ ...editForm, targetLanguage: e.target.value })}
                      className="w-full h-9 px-3 bg-[#fafafa] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-md text-sm text-[#1a1a1a] dark:text-[#fafafa] focus:outline-none focus:border-[#888]"
                    >
                      <option value="">Select language</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                      <option value="Portuguese">Portuguese</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Korean">Korean</option>
                    </select>
                  ) : (
                    <div className="h-9 px-3 bg-[#fafafa] dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-[#1a1a1a] rounded-md flex items-center text-sm text-[#1a1a1a] dark:text-[#fafafa]">
                      <Target className="w-4 h-4 mr-2 text-[#888]" />
                      {profile.targetLanguage || 'Not set'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
