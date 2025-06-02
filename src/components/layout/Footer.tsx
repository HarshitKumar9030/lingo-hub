'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Github, Twitter, Instagram, Heart, Sparkles } from 'lucide-react';

const footerLinks = [
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
  { name: 'Help', href: '/help' },
  { name: 'About', href: '/about' },
];

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/harshitkumar9030',
    icon: Github,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/OhHarshit',
    icon: Twitter,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/_harshit.xd',
    icon: Instagram,
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-gray-200/50 dark:border-gray-800/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50/20 to-transparent dark:from-gray-900/20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                LingoHub
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-8">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Social links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 LingoHub. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by</span>
                <a 
                  href="https://github.com/harshitkumar9030" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  Harshit Kumar
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
