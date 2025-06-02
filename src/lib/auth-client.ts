'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: User;
  expires: string;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const sessionData = await response.json();
          if (sessionData && sessionData.user) {
            setSession(sessionData);
            setStatus('authenticated');
          } else {
            setSession(null);
            setStatus('unauthenticated');
          }
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Failed to fetch session:', error);
        setSession(null);
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  return { data: session, status };
}

export async function signIn(providerId: string, options?: { callbackUrl?: string; email?: string; password?: string }) {
  const callbackUrl = options?.callbackUrl || '/';
  
  if (providerId === 'credentials') {
    if (!options?.email || !options?.password) {
      throw new Error('Email and password are required for credential login');
    }
    
    try {
      const response = await fetch('/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: options.email,
          password: options.password,
          callbackUrl,
        }),
      });
      
      if (response.ok) {
        window.location.href = callbackUrl;
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }
    } catch (error) {
      throw error;
    }
  } else {
    window.location.href = `/api/auth/signin/${providerId}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }
}

export async function signOut(options?: { callbackUrl?: string }) {
  const callbackUrl = options?.callbackUrl || '/';
  
  try {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      window.location.href = callbackUrl;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    // Fallback: redirect anyway
    window.location.href = callbackUrl;
  }
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
