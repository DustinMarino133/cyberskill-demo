'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Shield, ArrowRight, Play, CheckCircle, Sparkles,
  GraduationCap, Building2, Users, Brain, Target,
  BookOpen, Code, Network, Monitor, Globe,
  MessageSquare, Mail, Phone, MapPin, Github, Twitter, Linkedin,
  Check, ArrowDown, ChevronRight, Menu, X, User,
  Zap, Award, Eye, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const isHeroInView = useInView(heroRef);

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const floatingY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced artificial intelligence creates personalized learning paths that adapt to each student's pace and learning style."
    },
    {
      icon: Shield,
      title: "Comprehensive Security Training",
      description: "Master cybersecurity fundamentals through hands-on practice and real-world scenarios."
    },
    {
      icon: Target,
      title: "Interactive Assessments",
      description: "Test your knowledge with engaging quizzes and practical exercises designed by industry experts."
    },
    {
      icon: Network,
      title: "Collaborative Learning",
      description: "Connect with students and educators worldwide in a supportive learning community."
    }
  ];

  const services = [
    {
      title: "Student Platform",
      description: "Comprehensive cybersecurity education with AI-powered tools and interactive learning experiences.",
      features: ["AI Study Cards", "Interactive Quizzes", "Structured Courses", "24/7 AI Assistant"],
      cta: "Start Learning",
      route: "/auth/login",
      icon: GraduationCap,
      gradient: "from-blue-400 to-blue-600"
    },
    {
      title: "Corporate Training",
      description: "Professional cybersecurity training programs for businesses and organizations.",
      features: ["Security Awareness", "Compliance Training", "Risk Assessment", "Progress Tracking"],
      cta: "Secure Your Business",
      route: "/auth/login",
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Educational Solutions",
      description: "Complete curriculum management and student progress tracking for educational institutions.",
      features: ["Curriculum Management", "Student Analytics", "Assessment Tools", "Progress Reports"],
      cta: "Enhance Education",
      route: "/auth/login",
      icon: Users,
      gradient: "from-cyan-400 to-blue-500"
    }
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: "Structured Learning",
      points: [
        "Grade-appropriate content from 6th to 12th grade",
        "Progressive skill building",
        "Clear learning objectives"
      ]
    },
    {
      icon: Brain,
      title: "AI-Enhanced Education",
      points: [
        "Personalized learning recommendations",
        "Intelligent content generation",
        "Adaptive assessment tools"
      ]
    },
    {
      icon: Users,
      title: "Community Support",
      points: [
        "Expert instructor guidance",
        "Peer collaboration features",
        "Active learning community"
      ]
    }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailInput('');
    alert('Thank you for your interest! We will be in touch soon.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs with parallax */}
        <motion.div 
          style={{ y: bgY }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </motion.div>

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
              style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        
        {/* Floating elements with parallax */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              y: floatingY,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/20 backdrop-blur-xl border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  CyberSkill
                </span>
                <p className="text-xs text-gray-400">Education Platform</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-300 hover:text-blue-400 transition-colors">Home</a>
              <a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a>
              <a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors">Services</a>
              <a href="#benefits" className="text-gray-300 hover:text-blue-400 transition-colors">Benefits</a>
              <a href="#contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/auth/login')}
                className="hidden md:block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none"
              >
                Get Started
              </Button>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
                    </div>
                    
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
                      <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-900/30 backdrop-blur-xl border-t border-blue-500/20"
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#home" className="block text-gray-300 hover:text-blue-400 transition-colors">Home</a>
                <a href="#about" className="block text-gray-300 hover:text-blue-400 transition-colors">About</a>
                <a href="#services" className="block text-gray-300 hover:text-blue-400 transition-colors">Services</a>
                <a href="#benefits" className="block text-gray-300 hover:text-blue-400 transition-colors">Benefits</a>
                <a href="#contact" className="block text-gray-300 hover:text-blue-400 transition-colors">Contact</a>
                <Button 
                  onClick={() => router.push('/auth/login')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none"
                >
                  Get Started
                </Button>
              </div>
                  </motion.div>
          )}
        </AnimatePresence>
      </nav>
                
      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        <motion.div 
          style={{ y: heroY }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-blue-500/20 backdrop-blur-sm text-blue-300 border-blue-500/30 px-6 py-2">
              Next-Generation Cybersecurity Education
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Master{' '}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
                    animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                Cybersecurity
                    </motion.span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              The comprehensive platform for cybersecurity education. Learn through interactive courses, 
              AI-powered tools, and hands-on practice designed for students from grade 6 through 12.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => router.push('/auth/login')}
                className="px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg border-none"
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-blue-500/30 text-blue-300 hover:bg-blue-500/10 backdrop-blur-sm"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
                </motion.div>

          {/* Scroll Indicator */}
                <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                  <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-blue-400"
            >
              <ArrowDown className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8"
            >
              <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
                About CyberSkill
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-6">
                Leading the Future of{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Cybersecurity Education
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                Created by cybersecurity experts and educational specialists, CyberSkill provides 
                comprehensive cybersecurity education tailored for students. Our platform combines 
                cutting-edge AI with proven educational methodologies.
              </p>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                With partnerships across educational institutions and industry leaders, 
                we're building a more secure digital future through quality education.
              </p>
              <div className="space-y-4">
                {['AI-Powered Learning Tools', 'Real-World Practice Scenarios', 'Expert-Designed Curriculum', 'Continuous Innovation'].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-400" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
                      <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2970&auto=format&fit=crop"
                alt="Cybersecurity Education"
                width={2970}
                height={1980}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CyberSkill
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Our platform offers comprehensive features designed to enhance cybersecurity education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
                        <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mb-4">
                  <feature.icon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
                        </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Our{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Services
                      </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Comprehensive cybersecurity education solutions for students, businesses, and educational institutions
            </p>
                  </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
                  <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border-blue-500/20 h-full">
                  <CardHeader className="text-center pb-4">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${service.gradient} bg-opacity-20 mb-4`}>
                      <service.icon className="h-8 w-8 text-blue-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-300 mb-6">{service.description}</p>
                    <ul className="space-y-2 mb-8">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300">
                          <Check className="h-4 w-4 text-blue-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => router.push(service.route)}
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white border-none`}
                    >
                      {service.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
              className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Key{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Benefits
              </span>
              </h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Discover the advantages of learning cybersecurity with CyberSkill
              </p>
            </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-xl p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mr-4">
                    <benefit.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{benefit.title}</h3>
                </div>
                <ul className="space-y-3">
                  {benefit.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start text-gray-300">
                      <ArrowRight className="h-4 w-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Learning?
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of students already mastering cybersecurity with CyberSkill
            </p>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 bg-slate-800/50 border-blue-500/30 text-white placeholder-gray-400"
                required
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none"
              >
                Get Started
              </Button>
            </form>

            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              </div>
            </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 CyberSkill. All rights reserved. Empowering the next generation of cybersecurity professionals.
          </p>
        </div>
      </footer>
    </div>
  );
} 