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
  Info
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Stories', href: '/stories', icon: BookOpen },
  { name: 'Learn', href: '/learn', icon: Brain },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'About', href: '/about', icon: Info },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'backdrop-blur-2xl bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/20 dark:border-gray-800/30 shadow-lg shadow-black/5' 
          : 'backdrop-blur-lg bg-white/50 dark:bg-gray-950/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-2"
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                LingoHub
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 group relative"
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
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button 
                  asChild 
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all duration-300"
                >
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
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
            className="md:hidden backdrop-blur-2xl bg-white/90 dark:bg-gray-950/90 border-t border-gray-200/30 dark:border-gray-800/30"
          >
            <div className="px-4 py-6 space-y-3">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              ))}
              
              <div className="pt-6 border-t border-gray-200/30 dark:border-gray-800/30 space-y-3">
                {session ? (
                  <div className="px-4">
                    <UserProfile />
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    <Button 
                      variant="outline" 
                      asChild 
                      className="w-full border-gray-200/50 dark:border-gray-700/50"
                    >
                      <Link href="/auth/signin">Sign in</Link>
                    </Button>
                    <Button 
                      asChild 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
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
