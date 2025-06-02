'use client';

import { motion } from 'framer-motion';
import { 
  Target, 
  Heart, 
  Users, 
  Lightbulb, 
  Globe,
  Brain,
  Sparkles,
  Github,
  Twitter,
  Instagram,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

const values = [
  {
    icon: Heart,
    title: 'Passion for Learning',
    description: 'We believe language learning should be engaging, natural, and enjoyable.',
    gradient: 'from-red-500 to-pink-500'
  },
  {
    icon: Brain,
    title: 'AI-Powered Innovation',
    description: 'Leveraging cutting-edge AI to create personalized learning experiences.',
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Building a supportive global community of language learners.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Making language learning accessible to everyone, everywhere.',
    gradient: 'from-green-500 to-emerald-500'
  }
];

const stats = [
  { value: '10K+', label: 'Active Learners', icon: Users },
  { value: '500+', label: 'Interactive Stories', icon: Target },
  { value: '25+', label: 'Languages', icon: Globe },
  { value: '95%', label: 'Success Rate', icon: Heart }
];

const team = [
  {
    name: 'Harshit Kumar',
    role: 'Founder & CEO',
    bio: 'Passionate about technology and language learning. Building the future of education.',
    image: '/team/harshit.jpg',
    social: {
      github: 'https://github.com/harshitkumar9030',
      twitter: 'https://twitter.com/OhHarshit',
      instagram: 'https://instagram.com/_harshit.xd'
    }
  }
];

export default function AboutPage() {
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
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-xl"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">About LingoHub</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Revolutionizing
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Language Learning
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              We're on a mission to make language learning natural, engaging, and accessible 
              through the power of immersive storytelling and AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Traditional language learning methods often fail because they treat vocabulary as isolated words 
              to memorize. We believe in contextual learning through real-life scenarios, where every word 
              has meaning and purpose. Our AI-powered platform creates immersive stories that make language 
              learning feel like an adventure, not a chore.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 group">
                  <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at LingoHub
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="h-full bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${value.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals building the future of language learning
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            {team.map((member, index) => (
              <Card key={member.name} className="max-w-sm bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    <a 
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors"
                    >
                      <Github className="w-5 h-5 text-gray-700 hover:text-gray-900" />
                    </a>
                    <a 
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-blue-500" />
                    </a>
                    <a 
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors"
                    >
                      <Instagram className="w-5 h-5 text-pink-500" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Start Your
              <br />
              Language Journey?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of learners who are mastering new languages through our immersive stories.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4"
              >
                <Link href="/auth/signin" className="flex items-center space-x-2">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 text-lg px-8 py-4"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
