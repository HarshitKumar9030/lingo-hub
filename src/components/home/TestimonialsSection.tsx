'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Alex Morgan',
    role: 'Designer',
    avatar: '/avatars/alex.jpg',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    name: 'Jordan Smith',
    role: 'Developer',
    avatar: '/avatars/jordan.jpg',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    name: 'Casey Johnson',
    role: 'Writer',
    avatar: '/avatars/casey.jpg',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    name: 'Riley Davis',
    role: 'Student',
    avatar: '/avatars/riley.jpg',
    content: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

export function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (    <section className="relative py-32 overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa]/50 to-white dark:from-[#0a0a0a]/50 dark:to-[#111]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >          <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] dark:text-[#fafafa] mb-4 tracking-tight">
            Loved by{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              learners everywhere
            </span>
          </h2>
          <p className="text-lg text-[#888] dark:text-[#888] max-w-2xl mx-auto">
            See what people are saying about their language learning journey
          </p>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="group"
            >
              <div className="relative h-full">
                {/* Glassmorphic Card */}
                <div className="relative h-full p-8 rounded-xl bg-white/80 dark:bg-[#111]/80 border border-[#e5e5e5]/50 dark:border-[#1a1a1a]/50 shadow-lg transition-all duration-500 group-hover:bg-white dark:group-hover:bg-[#111] group-hover:border-[#e5e5e5] dark:group-hover:border-[#1a1a1a] group-hover:shadow-xl">
                  
                  {/* Quote Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <Quote className="w-8 h-8 text-blue-500/60 dark:text-blue-400/60 flex-shrink-0" />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 border border-blue-200/30 dark:border-blue-700/30 opacity-60" />
                  </div>                  {/* Content */}
                  <blockquote className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed text-base">
                    {testimonial.content}
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12 ring-2 ring-gray-200/50 dark:ring-gray-700/50">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/5 dark:to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ready to start your own success story?
          </p>
          <button className="inline-flex items-center px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white font-medium shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
            Begin your journey
          </button>
        </motion.div>
      </div>
    </section>
  );
}
