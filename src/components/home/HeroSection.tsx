'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Zap, Globe, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };


  // temp stats 
  const stats = [
    { icon: Users, value: '10K+', label: 'Learners' },
    { icon: BookOpen, value: '500+', label: 'Stories' },
    { icon: Globe, value: '25+', label: 'Languages' },
  ];

  return (    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-300">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fafafa]/50 via-[#f5f5f5]/30 to-[#f0f0f0]/50 dark:from-[#0a0a0a]/50 dark:via-[#111]/30 dark:to-[#1a1a1a]/50" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
        
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1.05, 1, 1.05],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-2xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-white/80 dark:bg-[#111]/80 backdrop-blur-sm border border-[#e5e5e5]/50 dark:border-[#1a1a1a]/50 rounded-full px-4 py-2 mb-8 shadow-sm"
          >
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-[#888] dark:text-[#888]">AI-Powered Language Learning</span>
          </motion.div>          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-[#1a1a1a] dark:text-[#fafafa]"
          >
            Learn languages through
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              immersive stories
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-[#888] dark:text-[#888] mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Master vocabulary naturally with AI-generated stories that adapt to your level. 
            Every word has context, every lesson tells a story you&apos;ll remember.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >            <Button
              asChild
              size="lg"
              className="group relative bg-[#1a1a1a] dark:bg-[#fafafa] text-white dark:text-[#1a1a1a] hover:bg-[#333] dark:hover:bg-[#e5e5e5] border-0 h-12 px-8 rounded-lg transition-colors"
            >
              <Link href="/auth/signin" className="flex items-center space-x-2">
                <span className="relative z-10">Start Learning Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group bg-white dark:bg-[#111] border-[#e5e5e5] dark:border-[#1a1a1a] text-[#1a1a1a] dark:text-[#fafafa] hover:bg-[#f9f9f9] dark:hover:bg-[#1f1f1f] h-12 px-8 rounded-lg"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-2xl font-bold text-[#1a1a1a] dark:text-[#fafafa]">
                    {stat.value}
                  </span>
                </div>
                <p className="text-sm text-[#888] dark:text-[#888]">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
