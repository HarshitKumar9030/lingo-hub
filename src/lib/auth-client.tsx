'use client';

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession as useNextAuthSession } from "next-auth/react";
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

export const useSession = useNextAuthSession;

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60} 
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}

export async function signIn(providerId: string, options?: { callbackUrl?: string; email?: string; password?: string }) {
  const callbackUrl = options?.callbackUrl || '/';
  
  if (providerId === 'credentials') {
    if (!options?.email || !options?.password) {
      throw new Error('Email and password are required for credential login');
    }
    
    const result = await nextAuthSignIn('credentials', {
      email: options.email,
      password: options.password,
      callbackUrl,
      redirect: false,
    });
    
    if (result?.error) {
      throw new Error('Invalid credentials');
    }
    
    if (result?.ok) {
      window.location.href = callbackUrl;
    }
  } else {
    await nextAuthSignIn(providerId, { callbackUrl });
  }
}

export async function signOut(options?: { callbackUrl?: string }) {
  const callbackUrl = options?.callbackUrl || '/';
  await nextAuthSignOut({ callbackUrl });
}

export async function getProviders() {
  try {
    const response = await fetch('/api/auth/providers');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch providers:', error);
  }
  return null;
}

export async function signUp(name: string, email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}
