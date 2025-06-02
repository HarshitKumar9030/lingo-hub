'use client';

import { ReactNode } from "react";

// For NextAuth v5 beta, we'll create a custom session provider
interface AuthProviderProps {
  children: ReactNode;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // For NextAuth v5, session management is handled automatically
  return <>{children}</>;
}
