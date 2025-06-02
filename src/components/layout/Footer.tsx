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
    <footer className="relative border-t border-[#e5e5e5] dark:border-[#333] bg-white dark:bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#1a1a1a] dark:bg-[#e5e5e5] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white dark:text-[#1a1a1a]" />
              </div>
              <span className="text-xl font-semibold text-[#1a1a1a] dark:text-[#e5e5e5]">
                LingoHub
              </span>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-8">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-[#888] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors duration-200"
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
                  className="p-2 text-[#888] hover:text-[#1a1a1a] dark:hover:text-[#e5e5e5] transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>          <div className="mt-8 pt-6 border-t border-[#e5e5e5] dark:border-[#333]">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <p className="text-sm text-[#888]">
                © 2025 LingoHub. All rights reserved.
              </p>
              
              <div className="flex items-center space-x-2 text-sm text-[#888]">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span>by</span>
                <a 
                  href="https://github.com/harshitkumar9030" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1a1a1a] hover:text-[#888] dark:text-[#e5e5e5] dark:hover:text-[#888] transition-colors duration-200"
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
