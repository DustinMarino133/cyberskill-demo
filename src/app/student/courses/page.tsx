'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, Filter, Star, Clock, Users, Award,
  ChevronLeft, ChevronRight, Play, PlayCircle, CheckCircle, Lock,
  Target, TrendingUp, Zap, Shield, Brain, Code,
  Globe, Smartphone, Database, Cpu, Monitor, Key
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile, Course } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { toast } from 'react-hot-toast';
import { useTheme } from '@/contexts/ThemeContext';

interface DetailedCourse {
  id: string;
  title: string;
  description: string;
  gradeLevel: string;
  category: string;
  progress: number;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  prerequisites: string[];
  modules: CourseModule[];
  skills: string[];
  certificate: boolean;
  featured: boolean;
  price: 'free' | 'premium';
}

interface CourseModule {
  id: string;
  title: string;
  lessons: number;
  duration: string;
  completed: boolean;
}

export default function CoursesPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [courses, setCourses] = useState<DetailedCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<DetailedCourse[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<DetailedCourse | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const { currentTheme } = useTheme();
  const router = useRouter();

  const grades = ['all', 'elementary', 'middle', 'high', 'college'];
  const categories = ['all', 'fundamentals', 'network', 'cryptography', 'ethics', 'malware', 'forensics'];

  const courseIcons = {
    fundamentals: Shield,
    network: Globe,
    cryptography: Key,
    ethics: Award,
    malware: Target,
    forensics: Search,
    default: BookOpen
  };

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadCourses();
        loadEnrolledCourses();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const loadCourses = () => {
    const courseData: DetailedCourse[] = [
      {
        id: 'cyber-101',
        title: 'Cybersecurity Fundamentals',
        description: 'Learn the basics of cybersecurity, from threats to defenses',
        gradeLevel: 'elementary',
        category: 'fundamentals',
        progress: 0,
        instructor: 'Dr. Sarah Chen',
        duration: '4 weeks',
        students: 1245,
        rating: 4.8,
        reviews: 234,
        prerequisites: [],
        skills: ['Password Security', 'Safe Browsing', 'Email Security', 'Digital Citizenship'],
        certificate: true,
        featured: true,
        price: 'free',
        modules: [
          { id: 'm1', title: 'Introduction to Cybersecurity', lessons: 5, duration: '45 min', completed: false },
          { id: 'm2', title: 'Common Cyber Threats', lessons: 6, duration: '60 min', completed: false },
          { id: 'm3', title: 'Personal Digital Security', lessons: 4, duration: '30 min', completed: false },
          { id: 'm4', title: 'Best Practices & Prevention', lessons: 7, duration: '90 min', completed: false }
        ]
      },
      {
        id: 'network-security',
        title: 'Network Security Essentials',
        description: 'Understand network protocols, firewalls, and network-based attacks',
        gradeLevel: 'high',
        category: 'network',
        progress: 0,
        instructor: 'Prof. Michael Torres',
        duration: '6 weeks',
        students: 892,
        rating: 4.7,
        reviews: 156,
        prerequisites: ['Cybersecurity Fundamentals'],
        skills: ['Network Protocols', 'Firewall Management', 'VPN Configuration', 'Network Monitoring'],
        certificate: true,
        featured: true,
        price: 'premium',
        modules: [
          { id: 'm1', title: 'Network Fundamentals', lessons: 8, duration: '120 min', completed: false },
          { id: 'm2', title: 'Network Threats & Attacks', lessons: 10, duration: '150 min', completed: false },
          { id: 'm3', title: 'Firewalls & Intrusion Detection', lessons: 9, duration: '135 min', completed: false },
          { id: 'm4', title: 'Wireless Security', lessons: 6, duration: '90 min', completed: false },
          { id: 'm5', title: 'Network Monitoring & Analysis', lessons: 7, duration: '105 min', completed: false }
        ]
      },
      {
        id: 'cryptography-basics',
        title: 'Introduction to Cryptography',
        description: 'Explore encryption, hashing, and digital signatures',
        gradeLevel: 'college',
        category: 'cryptography',
        progress: 0,
        instructor: 'Dr. Lisa Wang',
        duration: '8 weeks',
        students: 567,
        rating: 4.9,
        reviews: 89,
        prerequisites: ['Network Security Essentials'],
        skills: ['Symmetric Encryption', 'Public Key Cryptography', 'Hash Functions', 'Digital Signatures'],
        certificate: true,
        featured: false,
        price: 'premium',
        modules: [
          { id: 'm1', title: 'Cryptography History & Basics', lessons: 6, duration: '90 min', completed: false },
          { id: 'm2', title: 'Symmetric Cryptography', lessons: 8, duration: '120 min', completed: false },
          { id: 'm3', title: 'Asymmetric Cryptography', lessons: 10, duration: '150 min', completed: false },
          { id: 'm4', title: 'Hash Functions & MACs', lessons: 7, duration: '105 min', completed: false },
          { id: 'm5', title: 'Digital Signatures & PKI', lessons: 9, duration: '135 min', completed: false },
          { id: 'm6', title: 'Modern Cryptographic Applications', lessons: 5, duration: '75 min', completed: false }
        ]
      },
      {
        id: 'cyber-ethics',
        title: 'Cybersecurity Ethics & Law',
        description: 'Understand the legal and ethical aspects of cybersecurity',
        gradeLevel: 'middle',
        category: 'ethics',
        progress: 0,
        instructor: 'Prof. David Kim',
        duration: '3 weeks',
        students: 234,
        rating: 4.6,
        reviews: 45,
        prerequisites: [],
        skills: ['Cyber Law', 'Digital Rights', 'Privacy Protection', 'Ethical Hacking'],
        certificate: true,
        featured: false,
        price: 'free',
        modules: [
          { id: 'm1', title: 'Cybersecurity Law Overview', lessons: 4, duration: '60 min', completed: false },
          { id: 'm2', title: 'Privacy & Data Protection', lessons: 5, duration: '75 min', completed: false },
          { id: 'm3', title: 'Ethical Hacking Guidelines', lessons: 6, duration: '90 min', completed: false }
        ]
      },
      {
        id: 'malware-analysis',
        title: 'Malware Analysis & Defense',
        description: 'Learn to identify, analyze, and defend against malicious software',
        gradeLevel: 'college',
        category: 'malware',
        progress: 0,
        instructor: 'Dr. Jennifer Liu',
        duration: '10 weeks',
        students: 345,
        rating: 4.8,
        reviews: 67,
        prerequisites: ['Network Security Essentials', 'Cybersecurity Fundamentals'],
        skills: ['Malware Detection', 'Static Analysis', 'Dynamic Analysis', 'Reverse Engineering'],
        certificate: true,
        featured: true,
        price: 'premium',
        modules: [
          { id: 'm1', title: 'Malware Types & Classification', lessons: 7, duration: '105 min', completed: false },
          { id: 'm2', title: 'Static Analysis Techniques', lessons: 9, duration: '135 min', completed: false },
          { id: 'm3', title: 'Dynamic Analysis & Sandboxing', lessons: 8, duration: '120 min', completed: false },
          { id: 'm4', title: 'Reverse Engineering Basics', lessons: 12, duration: '180 min', completed: false },
          { id: 'm5', title: 'Advanced Persistent Threats', lessons: 6, duration: '90 min', completed: false },
          { id: 'm6', title: 'Malware Defense Strategies', lessons: 8, duration: '120 min', completed: false }
        ]
      },
      {
        id: 'digital-forensics',
        title: 'Digital Forensics Investigation',
        description: 'Master the art of digital evidence collection and analysis',
        gradeLevel: 'college',
        category: 'forensics',
        progress: 0,
        instructor: 'Det. Mark Johnson',
        duration: '12 weeks',
        students: 178,
        rating: 4.9,
        reviews: 23,
        prerequisites: ['Malware Analysis & Defense'],
        skills: ['Evidence Collection', 'Disk Imaging', 'Network Forensics', 'Mobile Forensics'],
        certificate: true,
        featured: false,
        price: 'premium',
        modules: [
          { id: 'm1', title: 'Forensics Fundamentals', lessons: 5, duration: '75 min', completed: false },
          { id: 'm2', title: 'Digital Evidence Handling', lessons: 8, duration: '120 min', completed: false },
          { id: 'm3', title: 'Disk & File System Analysis', lessons: 10, duration: '150 min', completed: false },
          { id: 'm4', title: 'Network Traffic Analysis', lessons: 9, duration: '135 min', completed: false },
          { id: 'm5', title: 'Mobile Device Forensics', lessons: 7, duration: '105 min', completed: false },
          { id: 'm6', title: 'Report Writing & Testimony', lessons: 6, duration: '90 min', completed: false }
        ]
      }
    ];

    setCourses(courseData);
    setFilteredCourses(courseData);
  };

  const loadEnrolledCourses = () => {
    const enrolled = localStorage.getItem('enrolledCourses');
    if (enrolled) {
      setEnrolledCourses(JSON.parse(enrolled));
    }
  };

  useEffect(() => {
    let filtered = courses;

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(course => course.gradeLevel === selectedGrade);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCourses(filtered);
  }, [courses, selectedGrade, selectedCategory, searchQuery]);

  const enrollInCourse = (courseId: string) => {
    const newEnrolled = [...enrolledCourses, courseId];
    setEnrolledCourses(newEnrolled);
    localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolled));
    toast.success('Successfully enrolled in course! 🎉');
  };

  const startCourse = (course: DetailedCourse) => {
    // Navigate to the video player page
    toast.success(`Starting ${course.title}! Good luck! 📚`);
    router.push(`/student/courses/${course.id}`);
  };

  const isEnrolled = (courseId: string) => enrolledCourses.includes(courseId);

  const canEnroll = (course: DetailedCourse) => {
    if (course.prerequisites.length === 0) return true;
    return course.prerequisites.every(prereq => 
      enrolledCourses.some(id => courses.find(c => c.id === id)?.title === prereq)
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fundamentals': return Shield;
      case 'network': return Globe;
      case 'cryptography': return Key;
      case 'ethics': return Award;
      case 'malware': return Target;
      case 'forensics': return Search;
      default: return BookOpen;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: currentTheme.colors.background }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: currentTheme.colors.primary }}></div>
          <p style={{ color: currentTheme.colors.textSecondary }}>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: currentTheme.colors.background }}>
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center" style={{ color: currentTheme.colors.text }}>
                <BookOpen className="h-8 w-8 mr-3 text-cyber-green" />
                Course Catalog
              </h1>
              <p className="text-muted-foreground mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                Discover cybersecurity courses tailored to your grade level
              </p>
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/student/dashboard')}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, skills, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  style={{ 
                    backgroundColor: currentTheme.colors.surface,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                />
              </div>
            </div>

            <div>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-md border"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              >
                <option value="all">All Grade Levels</option>
                <option value="elementary">Elementary</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
                <option value="college">College/Adult</option>
              </select>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-md border"
                style={{ 
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.text
                }}
              >
                <option value="all">All Categories</option>
                <option value="fundamentals">Fundamentals</option>
                <option value="network">Network Security</option>
                <option value="cryptography">Cryptography</option>
                <option value="ethics">Ethics & Law</option>
                <option value="malware">Malware</option>
                <option value="forensics">Digital Forensics</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center" style={{ color: currentTheme.colors.text }}>
            <Star className="h-6 w-6 mr-2 text-yellow-500" />
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.filter(course => course.featured).map((course) => {
              const Icon = getCategoryIcon(course.category);
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <Card className={`${currentTheme.styles.cardClass} border-2 border-cyber-green/30 h-full`} style={{ borderColor: currentTheme.colors.border }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-cyber-green/10 rounded-lg">
                            <Icon className="h-6 w-6 text-cyber-green" />
                          </div>
                          <div>
                            <Badge className="mb-1 bg-cyber-green text-black">Featured</Badge>
                            <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>{course.title}</CardTitle>
                          </div>
                        </div>
                        <Badge variant={course.price === 'free' ? 'secondary' : 'default'} style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                          {course.price === 'free' ? 'Free' : 'Premium'}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2" style={{ color: currentTheme.colors.textSecondary }}>
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {course.rating}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">Skills you'll learn:</div>
                        <div className="flex flex-wrap gap-1">
                          {course.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                              {skill}
                            </Badge>
                          ))}
                          {course.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                              +{course.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto space-y-2">
                        {isEnrolled(course.id) ? (
                          <Button
                            onClick={() => startCourse(course)}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button
                            onClick={() => enrollInCourse(course.id)}
                            disabled={!canEnroll(course)}
                            className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black disabled:opacity-50"
                          >
                            {canEnroll(course) ? (
                              <>Enroll Now</>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Prerequisites Required
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCourse(course)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* All Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.text }}>
            All Courses ({filteredCourses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const Icon = getCategoryIcon(course.category);
              return (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  className="relative"
                >
                  <Card className={`${currentTheme.styles.cardClass} h-full`} style={{ borderColor: currentTheme.colors.border }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <Badge className="mb-1" variant="secondary" style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                              {course.gradeLevel.charAt(0).toUpperCase() + course.gradeLevel.slice(1)}
                            </Badge>
                            <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>{course.title}</CardTitle>
                          </div>
                        </div>
                        <Badge variant={course.price === 'free' ? 'secondary' : 'default'} style={{ borderColor: currentTheme.colors.border, color: currentTheme.colors.text }}>
                          {course.price === 'free' ? 'Free' : 'Premium'}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2" style={{ color: currentTheme.colors.textSecondary }}>
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {course.rating} ({course.reviews})
                        </div>
                      </div>

                      {course.prerequisites.length > 0 && (
                        <div className="mb-4">
                          <div className="text-sm text-muted-foreground mb-1">Prerequisites:</div>
                          <div className="text-xs text-muted-foreground">
                            {course.prerequisites.join(', ')}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto space-y-2">
                        {isEnrolled(course.id) ? (
                          <Button
                            onClick={() => startCourse(course)}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button
                            onClick={() => enrollInCourse(course.id)}
                            disabled={!canEnroll(course)}
                            className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black disabled:opacity-50"
                          >
                            {canEnroll(course) ? (
                              <>Enroll Now</>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Prerequisites Required
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCourse(course)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Course Detail Modal */}
        <AnimatePresence>
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedCourse(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  border: `1px solid ${currentTheme.colors.border}`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2" style={{ color: currentTheme.colors.text }}>
                        {selectedCourse.title}
                      </h2>
                      <p className="text-muted-foreground mb-4" style={{ color: currentTheme.colors.textSecondary }}>
                        {selectedCourse.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge style={{ backgroundColor: `${currentTheme.colors.primary}20`, color: currentTheme.colors.primary }}>
                          {selectedCourse.gradeLevel.charAt(0).toUpperCase() + selectedCourse.gradeLevel.slice(1)}
                        </Badge>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {selectedCourse.duration}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          {selectedCourse.students} students
                        </div>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 mr-1 fill-current" />
                          {selectedCourse.rating} ({selectedCourse.reviews} reviews)
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCourse(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      {/* Course Modules */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>Course Content</h3>
                        <div className="space-y-3">
                          {selectedCourse.modules.map((module, index) => (
                            <div
                              key={module.id}
                              className="flex items-center justify-between p-3 border border-border rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium" style={{ color: currentTheme.colors.text }}>{module.title}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {module.lessons} lessons • {module.duration}
                                  </div>
                                </div>
                              </div>
                              {module.completed && (
                                <CheckCircle className="h-5 w-5 text-cyber-green" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>Skills You'll Learn</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedCourse.skills.map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg"
                            >
                              <CheckCircle className="h-4 w-4 text-cyber-green" />
                              <span className="text-sm" style={{ color: currentTheme.colors.text }}>{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Instructor */}
                      <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                        <CardHeader>
                          <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>Instructor</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                              <Users className="h-8 w-8 text-primary" />
                            </div>
                            <h4 className="font-medium" style={{ color: currentTheme.colors.text }}>{selectedCourse.instructor}</h4>
                            <p className="text-sm text-muted-foreground">
                              Cybersecurity Expert
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Prerequisites */}
                      {selectedCourse.prerequisites.length > 0 && (
                        <Card className={currentTheme.styles.cardClass} style={{ borderColor: currentTheme.colors.border }}>
                          <CardHeader>
                            <CardTitle className="text-lg" style={{ color: currentTheme.colors.text }}>Prerequisites</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {selectedCourse.prerequisites.map((prereq) => (
                                <li key={prereq} className="text-sm flex items-center">
                                  <Target className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span style={{ color: currentTheme.colors.text }}>{prereq}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Enrollment Action */}
                      <div className="space-y-3">
                        {isEnrolled(selectedCourse.id) ? (
                          <Button
                            onClick={() => {
                              startCourse(selectedCourse);
                              setSelectedCourse(null);
                            }}
                            className="w-full bg-primary hover:bg-primary/90"
                            size="lg"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              enrollInCourse(selectedCourse.id);
                              setSelectedCourse(null);
                            }}
                            disabled={!canEnroll(selectedCourse)}
                            className="w-full bg-cyber-green hover:bg-cyber-green/90 text-black disabled:opacity-50"
                            size="lg"
                          >
                            {canEnroll(selectedCourse) ? (
                              <>
                                <Award className="h-4 w-4 mr-2" />
                                Enroll Now
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Prerequisites Required
                              </>
                            )}
                          </Button>
                        )}
                        
                        {selectedCourse.certificate && (
                          <div className="text-center text-sm text-muted-foreground">
                            <Award className="h-4 w-4 inline mr-1" />
                            Certificate of completion available
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}