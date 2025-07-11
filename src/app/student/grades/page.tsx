'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BookOpen, TrendingUp, Calculator, Filter,
  ChevronDown, Award, FileText, Target,
  Clock, CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';

interface GradeAssignment {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  type: 'quiz' | 'assignment' | 'project' | 'exam' | 'lab';
  grade: number;
  maxPoints: number;
  submissionDate: string;
  dueDate: string;
  weight: number; // Percentage weight in final grade
}

interface CourseGrades {
  courseCode: string;
  courseName: string;
  assignments: GradeAssignment[];
  average: number;
  creditHours: number;
}

export default function GradesPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading grades...</p>
        </div>
      </div>
    );
  }

  // Sample grade data
  const courseGrades: CourseGrades[] = [
    {
      courseCode: 'CS6-2024',
      courseName: 'Network Security Basics',
      creditHours: 3,
      assignments: [
        {
          id: '1',
          title: 'Password Security Quiz',
          course: 'Network Security Basics',
          courseCode: 'CS6-2024',
          type: 'quiz',
          grade: 85,
          maxPoints: 100,
          submissionDate: '2024-01-15',
          dueDate: '2024-01-15',
          weight: 10
        },
        {
          id: '2',
          title: 'Network Protocols Assignment',
          course: 'Network Security Basics',
          courseCode: 'CS6-2024',
          type: 'assignment',
          grade: 92,
          maxPoints: 100,
          submissionDate: '2024-01-18',
          dueDate: '2024-01-18',
          weight: 15
        },
        {
          id: '3',
          title: 'Firewall Configuration Lab',
          course: 'Network Security Basics',
          courseCode: 'CS6-2024',
          type: 'lab',
          grade: 78,
          maxPoints: 100,
          submissionDate: '2024-01-20',
          dueDate: '2024-01-20',
          weight: 20
        },
        {
          id: '4',
          title: 'Midterm Exam',
          course: 'Network Security Basics',
          courseCode: 'CS6-2024',
          type: 'exam',
          grade: 88,
          maxPoints: 100,
          submissionDate: '2024-01-22',
          dueDate: '2024-01-22',
          weight: 25
        }
      ],
      average: 0 // Will be calculated
    },
    {
      courseCode: 'ACD12-2024',
      courseName: 'Advanced Cyber Defense',
      creditHours: 4,
      assignments: [
        {
          id: '5',
          title: 'Cryptography Fundamentals Quiz',
          course: 'Advanced Cyber Defense',
          courseCode: 'ACD12-2024',
          type: 'quiz',
          grade: 95,
          maxPoints: 100,
          submissionDate: '2024-01-16',
          dueDate: '2024-01-16',
          weight: 10
        },
        {
          id: '6',
          title: 'Ethical Hacking Project',
          course: 'Advanced Cyber Defense',
          courseCode: 'ACD12-2024',
          type: 'project',
          grade: 87,
          maxPoints: 100,
          submissionDate: '2024-01-19',
          dueDate: '2024-01-19',
          weight: 30
        },
        {
          id: '7',
          title: 'Penetration Testing Lab',
          course: 'Advanced Cyber Defense',
          courseCode: 'ACD12-2024',
          type: 'lab',
          grade: 91,
          maxPoints: 100,
          submissionDate: '2024-01-21',
          dueDate: '2024-01-21',
          weight: 25
        },
        {
          id: '8',
          title: 'Security Analysis Assignment',
          course: 'Advanced Cyber Defense',
          courseCode: 'ACD12-2024',
          type: 'assignment',
          grade: 45,
          maxPoints: 100,
          submissionDate: '2024-01-23',
          dueDate: '2024-01-23',
          weight: 20
        }
      ],
      average: 0 // Will be calculated
    }
  ];

  // Calculate weighted averages for each course
  courseGrades.forEach(course => {
    const totalWeight = course.assignments.reduce((sum, assignment) => sum + assignment.weight, 0);
    const weightedSum = course.assignments.reduce((sum, assignment) => {
      return sum + (assignment.grade / assignment.maxPoints * 100) * assignment.weight;
    }, 0);
    course.average = totalWeight > 0 ? weightedSum / totalWeight : 0;
  });

  // Color coding function based on grade percentage
  const getGradeColor = (percentage: number) => {
    if (percentage < 50) return 'text-red-400 bg-red-500/10 border-red-500/30';
    if (percentage >= 60 && percentage <= 79) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    if (percentage >= 80 && percentage <= 89) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (percentage >= 90) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30'; // 50-59 range
  };

  const getGradeIcon = (percentage: number) => {
    if (percentage < 50) return XCircle;
    if (percentage >= 60 && percentage <= 79) return AlertCircle;
    if (percentage >= 80 && percentage <= 89) return CheckCircle;
    if (percentage >= 90) return Award;
    return Clock;
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage < 50) return 'Needs Improvement';
    if (percentage >= 60 && percentage <= 79) return 'Satisfactory';
    if (percentage >= 80 && percentage <= 89) return 'Good';
    if (percentage >= 90) return 'Excellent';
    return 'Below Average';
  };

  // Filter assignments
  const allAssignments = courseGrades.flatMap(course => course.assignments);
  const filteredAssignments = allAssignments.filter(assignment => {
    const courseMatch = selectedCourse === 'all' || assignment.courseCode === selectedCourse;
    const typeMatch = selectedType === 'all' || assignment.type === selectedType;
    return courseMatch && typeMatch;
  });

  // Calculate overall GPA
  const totalCreditHours = courseGrades.reduce((sum, course) => sum + course.creditHours, 0);
  const weightedGPA = courseGrades.reduce((sum, course) => {
    return sum + (course.average / 100 * 4.0) * course.creditHours;
  }, 0);
  const overallGPA = totalCreditHours > 0 ? weightedGPA / totalCreditHours : 0;

  const assignmentTypes = [
    { id: 'all', label: 'All Types', icon: FileText },
    { id: 'quiz', label: 'Quizzes', icon: FileText },
    { id: 'assignment', label: 'Assignments', icon: BookOpen },
    { id: 'project', label: 'Projects', icon: Target },
    { id: 'exam', label: 'Exams', icon: Award },
    { id: 'lab', label: 'Labs', icon: Calculator }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Grades & Performance</h1>
                <p className="text-gray-400">Track your academic progress and achievements</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">GPA: {overallGPA.toFixed(2)}</div>
              <div className={`text-sm ${getGradeColor(overallGPA * 25)}`}>
                {getGradeLabel(overallGPA * 25)}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Course Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {courseGrades.map((course) => {
            const IconComponent = getGradeIcon(course.average);
            return (
              <Card key={course.courseCode} className={`border ${getGradeColor(course.average)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-6 w-6" />
                      <div>
                        <CardTitle className="text-lg text-white">{course.courseName}</CardTitle>
                        <CardDescription className="text-gray-400">{course.courseCode} • {course.creditHours} Credits</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{course.average.toFixed(1)}%</div>
                      <Badge className={`${getGradeColor(course.average)} border text-xs`}>
                        {getGradeLabel(course.average)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Course Progress</span>
                      <span className="text-white">{course.assignments.length} assignments</span>
                    </div>
                    <Progress value={course.average} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter by:</span>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
          >
            <option value="all">All Courses</option>
            {courseGrades.map((course) => (
              <option key={course.courseCode} value={course.courseCode}>
                {course.courseName}
              </option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
          >
            {assignmentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Assignments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Assignment Details</CardTitle>
              <CardDescription className="text-gray-400">
                Complete breakdown of all assignments and grades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredAssignments.map((assignment) => {
                  const percentage = (assignment.grade / assignment.maxPoints) * 100;
                  const IconComponent = getGradeIcon(percentage);
                  
                  return (
                    <div
                      key={assignment.id}
                      className={`p-4 rounded-lg border ${getGradeColor(percentage)} transition-all duration-200 hover:bg-opacity-80`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <IconComponent className="h-5 w-5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-semibold text-white">{assignment.title}</h3>
                              <Badge className="bg-gray-700/50 text-gray-300 text-xs">
                                {assignment.type}
                              </Badge>
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                {assignment.weight}% weight
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{assignment.course} • {assignment.courseCode}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Submitted: {new Date(assignment.submissionDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {assignment.grade}/{assignment.maxPoints}
                          </div>
                          <div className={`text-sm font-medium ${getGradeColor(percentage).split(' ')[0]}`}>
                            {percentage.toFixed(1)}%
                          </div>
                          <Badge className={`${getGradeColor(percentage)} border text-xs mt-1`}>
                            {getGradeLabel(percentage)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredAssignments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No assignments found for the selected filters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
} 