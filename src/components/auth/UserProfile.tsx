'use client';

import { useSession, signOut } from "@/lib/auth-client";
import { useUserProfileContext } from "@/contexts/UserProfileContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, BookOpen } from "lucide-react";
import Link from "next/link";

export function UserProfile() {
  const { data: session, status } = useSession();
  const { profile } = useUserProfileContext();

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Button asChild variant="default">
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    );
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const userInitials = (profile?.name || session.user.name)
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  const avatarUrl = profile?.avatar?.url || session.user.image;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage 
              src={avatarUrl || undefined} 
              alt={(profile?.name || session.user.name) || "User"}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>      <DropdownMenuContent 
        className="w-64 bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-[#1a1a1a] shadow-lg rounded-lg p-2" 
        align="end" 
        forceMount
      >
        <div className="px-3 py-3 bg-[#fafafa] dark:bg-[#0a0a0a] rounded-md mb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-[#e5e5e5] dark:ring-[#1a1a1a]">
              <AvatarImage 
                src={avatarUrl || undefined} 
                alt={(profile?.name || session.user.name) || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1a1a1a] dark:text-[#fafafa] truncate">
                {profile?.name || session.user.name}
              </p>
              <p className="text-xs text-[#888] truncate">
                {profile?.email || session.user.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer flex items-center px-3 py-2 rounded-md text-sm text-[#1a1a1a] dark:text-[#fafafa] hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a] transition-colors">
              <User className="mr-3 h-4 w-4 text-[#888]" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/vocabulary" className="cursor-pointer flex items-center px-3 py-2 rounded-md text-sm text-[#1a1a1a] dark:text-[#fafafa] hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a] transition-colors">
              <BookOpen className="mr-3 h-4 w-4 text-[#888]" />
              <span>My Vocabulary</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer flex items-center px-3 py-2 rounded-md text-sm text-[#1a1a1a] dark:text-[#fafafa] hover:bg-[#f0f0f0] dark:hover:bg-[#1a1a1a] transition-colors">
              <Settings className="mr-3 h-4 w-4 text-[#888]" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>
        
        <div className="my-2 h-px bg-[#e5e5e5] dark:bg-[#1a1a1a]" />
        
        <DropdownMenuItem 
          className="cursor-pointer flex items-center px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
