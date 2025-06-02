'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, Upload, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  currentImage?: string;
  fallback?: string;
  onImageChange?: (imageUrl: string | null) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRemove?: boolean;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
  xl: 'w-40 h-40'
};

export function ImageUpload({
  currentImage,
  fallback = 'U',
  onImageChange,
  className,
  size = 'lg',
  showRemove = true,
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const { url } = await response.json();
      onImageChange?.(url);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!currentImage) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload/avatar', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      onImageChange?.(null);
    } catch (error) {
      console.error('Delete error:', error);
      setError(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('flex flex-col items-center space-y-4', className)}>
      <div className="relative">
        <Avatar className={cn(sizeClasses[size], 'border-2 border-gray-200 dark:border-gray-700')}>
          <AvatarImage 
            src={currentImage || undefined} 
            alt="Profile" 
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
            {fallback}
          </AvatarFallback>
        </Avatar>

        {isUploading && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}

     
      </div>

      {!disabled && (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="text-xs"
            >
              <Upload className="w-3 h-3 mr-1" />
              Upload Photo
            </Button>

            {currentImage && showRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center max-w-48">
              {error}
            </p>
          )}

          <p className="text-xs text-gray-500 text-center max-w-48">
            JPG, PNG or WEBP. Max size 5MB.
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
