'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { 
  Shield, ArrowRight, Play, CheckCircle, Sparkles,
  GraduationCap, School, Users, Trophy, Brain,
  Target, Users2, Award, Globe, Heart, Lightbulb,
  Rocket, Clock, Star, Zap, BookOpen, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HomePage() {
  const router = useRouter();
  const [currentStat, setCurrentStat] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const isHeroInView = useInView(heroRef);
  const isFeaturesInView = useInView(featuresRef);
  const isStatsInView = useInView(statsRef);

  // Auto-cycle through stats
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { number: "50,000+", label: "Students Learning", icon: Users, description: "Active learners worldwide" },
    { number: "1,200+", label: "Schools Using", icon: School, description: "Educational institutions" },
    { number: "95%", label: "Success Rate", icon: Trophy, description: "Course completion rate" },
    { number: "24/7", label: "AI Support", icon: Brain, description: "Intelligent assistance" }
  ];

  const gradeFeatures = [
    {
      grade: "Elementary (K-5)",
      title: "Digital Citizenship Basics",
      description: "Fun, interactive lessons teaching safe online behavior and digital responsibility",
      features: ["Password Safety", "Stranger Danger Online", "Digital Footprints", "Cyberbullying Prevention"],
      color: "from-emerald-500 to-teal-600",
      icon: "🎒",
      bgColor: "bg-gradient-to-br from-emerald-500/10 to-teal-600/10"
    },
    {
      grade: "Middle School (6-8)",
      title: "Cyber Awareness Foundations",
      description: "Building critical thinking skills for navigating the digital world safely",
      features: ["Social Media Safety", "Phishing Recognition", "Privacy Settings", "Digital Ethics"],
      color: "from-blue-500 to-indigo-600",
      icon: "📚",
      bgColor: "bg-gradient-to-br from-blue-500/10 to-indigo-600/10"
    },
    {
      grade: "High School (9-12)",
      title: "Advanced Cybersecurity",
      description: "Comprehensive security concepts and career pathway exploration",
      features: ["Network Security", "Cryptography Basics", "Ethical Hacking", "Career Preparation"],
      color: "from-purple-500 to-violet-600",
      icon: "🎓",
      bgColor: "bg-gradient-to-br from-purple-500/10 to-violet-600/10"
    },
    {
      grade: "College & Adult",
      title: "Professional Certification",
      description: "Industry-standard training for cybersecurity professionals",
      features: ["CISSP Prep", "CEH Training", "Security+", "Real-world Projects"],
      color: "from-orange-500 to-red-600",
      icon: "💼",
      bgColor: "bg-gradient-to-br from-orange-500/10 to-red-600/10"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-cyber-purple/5 to-cyber-blue/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(83,109,226,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div className="cyber-grid-lg opacity-20" />
        
        {/* Enhanced Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
            className={`absolute w-2 h-2 rounded-full blur-sm ${
              i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-cyber-blue' : 'bg-cyber-purple'
            }`}
            style={{
              top: `${20 + (i * 15) % 60}%`,
              left: `${10 + (i * 20) % 80}%`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10">
        {/* Enhanced Hero Section */}
        <section ref={heroRef} className="kokonut-hero">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isHeroInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              {/* Logo with Enhanced Animation */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-cyber-blue rounded-full blur-xl opacity-50 animate-pulse-slow" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-primary via-cyber-blue to-cyber-purple rounded-full flex items-center justify-center shadow-cyber-strong">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Enhanced Title */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold">
                  <span className="gradient-text">CyberSkill</span>
                  <span className="glow-text">.AI</span>
                </h1>
                
                <div className="space-y-4">
                  <p className="text-2xl md:text-3xl text-slate-200 font-light">
                    The Revolutionary Cybersecurity Education Platform
                  </p>
                  
                  <p className="text-lg md:text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed">
                    Empowering students from K-12 to college with AI-powered cybersecurity education. 
                    Making digital safety engaging, accessible, and effective for the next generation.
                  </p>
                </div>
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg"
                    className="kokonut-button kokonut-button-primary px-10 py-4 text-lg font-semibold group"
                    onClick={() => router.push('/auth/login')}
                  >
                    <Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                    Start Learning Now
                    <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="glassmorphism border-white/20 text-slate-200 hover:bg-white/10 px-10 py-4 text-lg font-semibold group"
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <Lightbulb className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform" />
                    Explore Features
                  </Button>
                </motion.div>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-8 pt-8 text-slate-400"
              >
                {[
                  { icon: CheckCircle, text: "Free for educators" },
                  { icon: Zap, text: "No setup required" },
                  { icon: Star, text: "Instant access" }
                ].map(({ icon: Icon, text }, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Live Stats Section */}
        <section ref={statsRef} className="kokonut-section">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="kokonut-grid-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isActive = currentStat === index;
                return (
                  <motion.div
                    key={index}
                    animate={{
                      scale: isActive ? 1.05 : 1,
                      y: isActive ? -5 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <div className={`kokonut-card text-center h-full transition-all duration-300 ${
                      isActive ? 'cyber-glow-strong' : 'hover:cyber-glow'
                    }`}>
                      <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary to-cyber-blue shadow-cyber' 
                            : 'bg-slate-800 group-hover:bg-slate-700'
                        }`}>
                          <Icon className={`h-8 w-8 transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'
                          }`} />
                        </div>
                      </div>
                      
                      <div className={`text-3xl md:text-4xl font-bold mb-2 transition-colors duration-300 ${
                        isActive ? 'text-primary' : 'text-white group-hover:text-primary'
                      }`}>
                        {stat.number}
                      </div>
                      
                      <div className="text-slate-300 font-medium mb-1">{stat.label}</div>
                      <div className="text-sm text-slate-500">{stat.description}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Grade-Level Features */}
        <section id="features" ref={featuresRef} className="kokonut-section">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isFeaturesInView ? { scale: 1 } : {}}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <Badge className="mb-6 bg-gradient-to-r from-primary to-cyber-blue text-white px-6 py-3 text-lg font-semibold">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Tailored for Every Grade Level
                </Badge>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">Age-Appropriate</span>{" "}
                <span className="text-white">Cybersecurity Education</span>
              </h2>
              
              <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                From digital citizenship basics to professional certification, we provide comprehensive 
                cybersecurity education that grows with your students.
              </p>
            </motion.div>

            <div className="kokonut-grid-4">
              {gradeFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group h-full"
                >
                  <div className={`kokonut-card h-full ${feature.bgColor} group-hover:cyber-glow transition-all duration-300`}>
                    <div className="text-center mb-6">
                      <div className="text-5xl mb-4 animate-bounce-slow">{feature.icon}</div>
                      <Badge className={`bg-gradient-to-r ${feature.color} text-white mb-4 px-4 py-2 font-semibold`}>
                        {feature.grade}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-slate-300 leading-relaxed">
                        {feature.description}
                      </p>
                      
                      <div className="space-y-3 pt-4">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center text-slate-300 group-hover:text-slate-200 transition-colors">
                            <div className="w-2 h-2 bg-gradient-to-r from-primary to-cyber-blue rounded-full mr-3 flex-shrink-0" />
                            <span className="text-sm font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Final CTA */}
        <section className="kokonut-section bg-gradient-to-br from-primary/10 via-cyber-purple/5 to-cyber-blue/10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glassmorphism-strong rounded-3xl p-12 md:p-16"
            >
              <div className="space-y-8">
                <div className="space-y-6">
                  <h2 className="text-4xl md:text-6xl font-bold">
                    <span className="text-white">Ready to Transform</span><br />
                    <span className="gradient-text">Cybersecurity Education?</span>
                  </h2>
                  
                  <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Join thousands of educators and students who are already building a safer digital future with CyberSkill.AI
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg"
                      className="kokonut-button kokonut-button-primary px-12 py-5 text-xl font-semibold group"
                      onClick={() => router.push('/auth/login')}
                    >
                      <Rocket className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      Start Free Demo
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="glassmorphism border-white/20 text-slate-200 hover:bg-white/10 px-12 py-5 text-xl font-semibold group"
                    >
                      <Clock className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                      Schedule Demo
                    </Button>
                  </motion.div>
                </div>

                <div className="flex flex-wrap justify-center gap-8 pt-8 text-slate-400">
                  {[
                    { icon: CheckCircle, text: "Free for educators" },
                    { icon: Lock, text: "Enterprise security" },
                    { icon: BookOpen, text: "Comprehensive curriculum" }
                  ].map(({ icon: Icon, text }, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}