'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Users, 
  Zap, 
  Target, 
  Trophy
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Interactive Stories',
    description: 'Learn through engaging scenarios in cafés, airports, and everyday situations that feel real.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Smart algorithms adapt to your learning pace and provide personalized vocabulary just for you.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: Target,
    title: 'Contextual Vocabulary',
    description: 'No more boring flashcards. Learn words naturally within meaningful conversations that stick.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get immediate pronunciation help with IPA notation and audio examples when you need them.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Trophy,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and achievement milestones that motivate.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Users,
    title: 'Community Learning',
    description: 'Connect with fellow learners, share progress, and practice together in group challenges.',
    gradient: 'from-pink-500 to-rose-500'
  }
];

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-[#111] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >          <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] dark:text-[#fafafa] mb-6">
            Why{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              LingoHub
            </span>
            {' '}works
          </h2>          <p className="text-xl text-[#888] dark:text-[#888] max-w-3xl mx-auto">
            Experience language learning that adapts to you, not the other way around
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >              <div className="h-full p-8 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm hover:shadow-md border border-[#e5e5e5] dark:border-[#1a1a1a] transition-all duration-300">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#1a1a1a] dark:text-[#fafafa] mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#888] dark:text-[#888] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
