'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/components/auth/UserProfile';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useSession } from '@/lib/auth-client';
import { 
  Menu, 
  X, 
  BookOpen, 
  Brain, 
  Users, 
  Sparkles,
  Home,
  Info,
  BarChart3
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true },
  { name: 'Stories', href: '/stories', icon: BookOpen },
  { name: 'Learn', href: '/learn', icon: Brain },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'About', href: '/about', icon: Info },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter navigation items based on authentication status
  const filteredNavigation = mounted ? navigation.filter(item => !item.requiresAuth || session) : navigation.filter(item => !item.requiresAuth);

  return (    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-xl bg-[#fafafa]/90 dark:bg-[#0a0a0a]/90 border-b border-[#e5e5e5] dark:border-[#1a1a1a] shadow-sm' 
          : 'backdrop-blur-lg bg-[#fafafa]/70 dark:bg-[#0a0a0a]/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2"
          >            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1a1a1a] dark:bg-[#e5e5e5] rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white dark:text-[#1a1a1a]" />
              </div>
              <span className="text-xl font-semibold text-[#1a1a1a] dark:text-[#e5e5e5]">
                LingoHub
              </span>
            </Link>
          </motion.div>          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              ><Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#888] hover:text-[#1a1a1a] dark:text-[#888] dark:hover:text-[#e5e5e5] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] transition-all duration-200 group relative h-8"
                  >
                    <item.icon className="w-4 h-4 mr-2 group-hover:scale-105 transition-transform" />
                    {item.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200/50 dark:bg-gray-700/50 rounded-full animate-pulse" />
            ) : session ? (
              <UserProfile />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-2"
              >                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-[#888] hover:text-[#1a1a1a] dark:text-[#888] dark:hover:text-[#fafafa] hover:bg-[#f0f0f0]/50 dark:hover:bg-[#1a1a1a]/50"
                >
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="bg-[#1a1a1a] hover:bg-[#333] dark:bg-[#fafafa] dark:hover:bg-[#e5e5e5] text-white dark:text-[#1a1a1a] border-0 transition-all duration-200"
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#888] hover:text-[#1a1a1a] dark:text-[#888] dark:hover:text-[#e5e5e5] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden backdrop-blur-xl bg-[#fafafa]/95 dark:bg-[#0a0a0a]/95 border-t border-[#e5e5e5] dark:border-[#1a1a1a]"
          >            <div className="px-4 py-6 space-y-3">
              {navigation
                .filter(item => !item.requiresAuth || session)
                .map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-[#888] hover:text-[#1a1a1a] dark:text-[#888] dark:hover:text-[#e5e5e5] hover:bg-[#f5f5f5] dark:hover:bg-[#2a2a2a] transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-6 border-t border-[#e5e5e5] dark:border-[#1a1a1a] space-y-3">
                {session ? (
                  <div className="px-4">
                    <UserProfile />
                  </div>
                ) : (                  <div className="space-y-2 px-4">
                    <Button 
                      variant="outline" 
                      asChild 
                      className="w-full"
                    >
                      <Link href="/auth/signin">Sign in</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full"
                    >
                      <Link href="/auth/signup">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
