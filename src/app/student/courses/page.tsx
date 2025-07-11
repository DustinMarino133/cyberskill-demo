'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, Clock, ChevronRight, Filter,
  Search, CheckCircle, Lock, BarChart, Play,
  Users, Star, Shield, Monitor, Video
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface Unit {
  id: string;
  title: string;
  description: string;
  duration: string;
  progress: number;
  lessons: number;
  completed: boolean;
}

interface GradeBook {
  id: string;
  grade: string;
  bookTitle: string;
  description: string;
  totalUnits: number;
  completedUnits: number;
  progress: number;
  estimatedTime: string;
  instructor: string;
  enrolled: boolean;
  units: Unit[];
  coverColor: string;
}

const GRADE_BOOKS: GradeBook[] = [
  {
    id: 'grade-6-cyber-basics',
    grade: '6',
    bookTitle: 'Drew Weizman',
    description: 'Learn the essential basics of staying safe in the digital world. Perfect introduction to cybersecurity concepts for middle school students.',
    totalUnits: 8,
    completedUnits: 3,
    progress: 38,
    estimatedTime: '12 weeks',
    instructor: 'Ms. Sarah Johnson',
    enrolled: true,
    coverColor: 'from-blue-500 to-cyan-500',
    units: [
      {
        id: 'unit-1',
        title: 'Introduction to Digital Safety',
        description: 'Understanding what cybersecurity means and why it matters in our daily lives.',
        duration: '2 weeks',
        progress: 100,
        lessons: 6,
        completed: true
      },
      {
        id: 'unit-2',
        title: 'Password Protection',
        description: 'Creating strong passwords and keeping your accounts secure.',
        duration: '1.5 weeks',
        progress: 100,
        lessons: 5,
        completed: true
      },
      {
        id: 'unit-3',
        title: 'Safe Internet Browsing',
        description: 'How to identify safe websites and avoid dangerous downloads.',
        duration: '2 weeks',
        progress: 75,
        lessons: 7,
        completed: false
      },
      {
        id: 'unit-4',
        title: 'Email and Message Safety',
        description: 'Recognizing suspicious emails and messages from strangers.',
        duration: '1.5 weeks',
        progress: 0,
        lessons: 5,
        completed: false
      },
      {
        id: 'unit-5',
        title: 'Social Media Privacy',
        description: 'Protecting your personal information on social platforms.',
        duration: '2 weeks',
        progress: 0,
        lessons: 6,
        completed: false
      },
      {
        id: 'unit-6',
        title: 'Digital Citizenship',
        description: 'Being a responsible and respectful digital citizen online.',
        duration: '1.5 weeks',
        progress: 0,
        lessons: 4,
        completed: false
      },
      {
        id: 'unit-7',
        title: 'Cyberbullying Prevention',
        description: 'Understanding cyberbullying and how to respond to it properly.',
        duration: '1 week',
        progress: 0,
        lessons: 4,
        completed: false
      },
      {
        id: 'unit-8',
        title: 'Digital Footprint Awareness',
        description: 'Learning about your digital footprint and its long-term impact.',
        duration: '1 week',
        progress: 0,
        lessons: 3,
        completed: false
      }
    ]
  },
  {
    id: 'grade-12-advanced-cyber',
    grade: '12',
    bookTitle: 'Advanced Cybersecurity Principles',
    description: 'Comprehensive cybersecurity education covering ethical hacking, network security, and career preparation for college and beyond.',
    totalUnits: 12,
    completedUnits: 7,
    progress: 58,
    estimatedTime: '18 weeks',
    instructor: 'Dr. Michael Chen',
    enrolled: true,
    coverColor: 'from-purple-600 to-pink-600',
    units: [
      {
        id: 'unit-1',
        title: 'Network Security Fundamentals',
        description: 'Understanding network architecture, protocols, and security measures.',
        duration: '2 weeks',
        progress: 100,
        lessons: 8,
        completed: true
      },
      {
        id: 'unit-2',
        title: 'Cryptography and Encryption',
        description: 'Mathematical foundations of encryption and modern cryptographic systems.',
        duration: '2.5 weeks',
        progress: 100,
        lessons: 10,
        completed: true
      },
      {
        id: 'unit-3',
        title: 'Ethical Hacking Principles',
        description: 'Introduction to penetration testing and ethical hacking methodologies.',
        duration: '3 weeks',
        progress: 100,
        lessons: 12,
        completed: true
      },
      {
        id: 'unit-4',
        title: 'Web Application Security',
        description: 'Securing web applications and understanding common vulnerabilities.',
        duration: '2 weeks',
        progress: 100,
        lessons: 9,
        completed: true
      },
      {
        id: 'unit-5',
        title: 'Digital Forensics',
        description: 'Investigating cybercrime and analyzing digital evidence.',
        duration: '2.5 weeks',
        progress: 100,
        lessons: 10,
        completed: true
      },
      {
        id: 'unit-6',
        title: 'Risk Assessment and Management',
        description: 'Evaluating and managing cybersecurity risks in organizations.',
        duration: '2 weeks',
        progress: 100,
        lessons: 8,
        completed: true
      },
      {
        id: 'unit-7',
        title: 'Incident Response',
        description: 'Developing and executing incident response plans and procedures.',
        duration: '1.5 weeks',
        progress: 85,
        lessons: 7,
        completed: false
      },
      {
        id: 'unit-8',
        title: 'Cloud Security',
        description: 'Understanding security challenges and solutions in cloud computing.',
        duration: '2 weeks',
        progress: 0,
        lessons: 9,
        completed: false
      },
      {
        id: 'unit-9',
        title: 'Mobile Device Security',
        description: 'Securing smartphones, tablets, and IoT devices.',
        duration: '1.5 weeks',
        progress: 0,
        lessons: 6,
        completed: false
      },
      {
        id: 'unit-10',
        title: 'Compliance and Regulations',
        description: 'Understanding cybersecurity laws, regulations, and compliance requirements.',
        duration: '1.5 weeks',
        progress: 0,
        lessons: 6,
        completed: false
      },
      {
        id: 'unit-11',
        title: 'Career Preparation',
        description: 'Cybersecurity career paths, certifications, and industry preparation.',
        duration: '1 week',
        progress: 0,
        lessons: 5,
        completed: false
      },
      {
        id: 'unit-12',
        title: 'Capstone Project',
        description: 'Complete a comprehensive cybersecurity project demonstrating learned skills.',
        duration: '2 weeks',
        progress: 0,
        lessons: 4,
        completed: false
      }
    ]
  }
];

export default function CoursesPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<GradeBook | null>(null);
  const [showUnits, setShowUnits] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.role === 'student') {
          setUser(demoStudent);
        } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleBookClick = (book: GradeBook) => {
    setSelectedBook(book);
    setShowUnits(true);
  };

  const handleUnitClick = (unit: Unit) => {
    // Navigate to the existing course watching format
    router.push(`/student/courses/${selectedBook?.id}?unit=${unit.id}`);
  };

  const filteredBooks = GRADE_BOOKS.filter(book => {
    const matchesGrade = selectedGrade === 'all' || book.grade === selectedGrade;
    const matchesSearch = book.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-blue-400 font-medium">Loading your video library...</p>
        </div>
      </div>
    );
  }

  if (showUnits && selectedBook) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button and Book Header */}
          <div className="mb-8">
            <Button
              onClick={() => setShowUnits(false)}
              variant="outline"
              className="mb-6 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Video Library
            </Button>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-8">
              <div className="flex items-start gap-6">
                <div className={`w-24 h-32 bg-gradient-to-br ${selectedBook.coverColor} rounded-lg flex items-center justify-center shadow-lg`}>
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      Grade {selectedBook.grade}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Enrolled
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-white mb-3">
                    {selectedBook.bookTitle}
                  </h1>
                  
                  <p className="text-gray-300 text-lg mb-6">
                    {selectedBook.description}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BookOpen className="h-4 w-4" />
                      <span>{selectedBook.totalUnits} units</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>{selectedBook.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{selectedBook.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <BarChart className="h-4 w-4" />
                      <span>{selectedBook.progress}% complete</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-white">
                        Progress: {selectedBook.completedUnits}/{selectedBook.totalUnits} units
                </span>
                      <span className="text-gray-400">{selectedBook.progress}%</span>
                    </div>
                    <Progress value={selectedBook.progress} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedBook.units.map((unit, index) => (
        <motion.div
                key={unit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all hover:shadow-md backdrop-blur-sm ${
                    unit.completed ? 'bg-green-500/20 border-green-500/30' : 
                    unit.progress > 0 ? 'bg-blue-500/20 border-blue-500/30' : 
                    'bg-gray-800/50 border-gray-700/50'
                  }`}
                  onClick={() => handleUnitClick(unit)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                        Unit {index + 1}
                      </Badge>
                      {unit.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : unit.progress > 0 ? (
                        <Play className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Lock className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight text-white">{unit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{unit.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {unit.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {unit.duration}
                        </span>
                      </div>
                      
                      {unit.progress > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-300">Progress</span>
                            <span className="text-xs text-gray-400">{unit.progress}%</span>
                          </div>
                          <Progress value={unit.progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Video Library</h1>
          <p className="text-gray-400">
            Comprehensive cybersecurity education organized by grade level
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search video courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedGrade('all')}
                variant={selectedGrade === 'all' ? 'default' : 'outline'}
                className={selectedGrade === 'all' ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'}
              >
                All Grades
              </Button>
              <Button
                onClick={() => setSelectedGrade('6')}
                variant={selectedGrade === '6' ? 'default' : 'outline'}
                className={selectedGrade === '6' ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'}
              >
                Grade 6
              </Button>
              <Button
                onClick={() => setSelectedGrade('12')}
                variant={selectedGrade === '12' ? 'default' : 'outline'}
                className={selectedGrade === '12' ? 
                  'bg-blue-500 hover:bg-blue-600 text-white' : 
                  'border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white'}
              >
                Grade 12
              </Button>
            </div>
          </div>
          </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50"
                onClick={() => handleBookClick(book)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Book Cover */}
                    <div className={`w-20 h-28 bg-gradient-to-br ${book.coverColor} rounded-lg flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <BookOpen className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Book Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Grade {book.grade}
                        </Badge>
                        {book.enrolled && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Enrolled
                    </Badge>
                        )}
                  </div>
                  
                      <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                        {book.bookTitle}
                      </h3>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {book.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{book.totalUnits} units</span>
                    </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{book.estimatedTime}</span>
                    </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{book.instructor}</span>
                    </div>
                        <div className="flex items-center gap-1">
                          <BarChart className="h-4 w-4" />
                          <span>{book.progress}% complete</span>
                    </div>
                  </div>

                      {book.enrolled && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-white">
                              Progress: {book.completedUnits}/{book.totalUnits} units
                            </span>
                            <span className="text-gray-400">{book.progress}%</span>
                  </div>
                          <Progress value={book.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </main>
    </div>
  );
} 