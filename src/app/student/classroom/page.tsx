'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Megaphone, ClipboardList, Calendar, BarChart3, Users,
  GraduationCap, User, Video, Brain, FileText, BookOpen, 
  ShoppingBag, Award, Settings, Grid3x3, Clock, AlertCircle,
  CheckCircle, XCircle, Timer, Paperclip, Play, Star, Book,
  Monitor, Target, ChevronLeft, FlaskConical, Cpu, Shield,
  Lock, Wifi, Database, Search, Pin, Eye, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { StudentProfile } from '@/lib/types';

interface Announcement {
  id: string;
  title: string;
  content: string;
  teacher: string;
  timestamp: string;
  priority: 'normal' | 'important' | 'urgent';
  pinned?: boolean;
  attachments: { name: string; type: string }[];
}

interface ClassMember {
  id: string;
  name: string;
  role: 'student' | 'teacher';
  lastActive: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'quiz' | 'assignment' | 'lecture' | 'event';
  day: number;
  fullDate: Date;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'submitted' | 'pending' | 'assigned' | 'graded';
  maxPoints: number;
  earnedPoints?: number;
  percentage?: number;
  fullDueDate: Date;
}

interface SchoolAssignment {
  id: string;
  title: string;
  type: 'quiz' | 'lab' | 'project' | 'assignment';
  subject: string;
  dueDate: string;
  maxPoints: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  questions?: number;
  status: 'available' | 'in-progress' | 'submitted' | 'graded';
  description: string;
}

export default function ClassroomPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [currentTab, setCurrentTab] = useState<'overview' | 'assignments' | 'members' | 'virtual-labs' | 'announcements' | 'calendar' | 'grades'>('overview');
  const [selectedAssignment, setSelectedAssignment] = useState<SchoolAssignment | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const router = useRouter();

  // Define the app menu items for the 9-dots menu
  const appMenuItems = [
    { label: 'Videos', href: '/student/courses', icon: Video, color: 'text-red-400' },
    { label: 'AI Companion', href: '/student/tools/ai-companion', icon: Brain, color: 'text-purple-400' },
    { label: 'Quiz Builder', href: '/student/tools/quiz', icon: FileText, color: 'text-blue-400' },
    { label: 'Flashcards', href: '/student/tools/flashcards', icon: BookOpen, color: 'text-green-400' },
    { label: 'Dashboard', href: '/student/dashboard', icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Shop', href: '/student/shop', icon: ShoppingBag, color: 'text-pink-400' },
    { label: 'Progress', href: '/student/progress', icon: Award, color: 'text-yellow-400' },
    { label: 'Settings', href: '/student/settings', icon: Settings, color: 'text-gray-400' },
    { label: 'Classroom', href: '/student/classroom', icon: Monitor, color: 'text-orange-400' }
  ];

  // Current user info
  const currentUser = {
    name: 'Alex Chen',
    avatar: '👨‍💻',
    role: 'student'
  };

  // Sample classroom data
  const classInfo = {
    code: 'CS6-2024',
    name: 'Cybersecurity Fundamentals',
    teacher: 'Ms. Sarah Johnson',
    students: 24,
    meetingTime: 'Mon, Wed, Fri 2:00 PM - 3:30 PM',
    room: 'Computer Lab B'
  };

  // School assignments for the 9-dots menu
  const schoolAssignments: SchoolAssignment[] = [
    {
      id: 'quiz-1',
      title: 'Network Security Quiz',
      type: 'quiz',
      subject: 'Network Security',
      dueDate: 'Tomorrow',
      maxPoints: 100,
      difficulty: 'medium',
      timeLimit: 30,
      questions: 15,
      status: 'available',
      description: 'Test your knowledge on network security fundamentals including firewalls, VPNs, and intrusion detection.'
    },
    {
      id: 'lab-1',
      title: 'Firewall Configuration Lab',
      type: 'lab',
      subject: 'Network Defense',
      dueDate: 'Feb 5',
      maxPoints: 75,
      difficulty: 'hard',
      timeLimit: 90,
      status: 'available',
      description: 'Hands-on lab to configure and test firewall rules for network protection.'
    },
    {
      id: 'quiz-2',
      title: 'Cryptography Quiz',
      type: 'quiz',
      subject: 'Cryptography',
      dueDate: 'Feb 8',
      maxPoints: 80,
      difficulty: 'medium',
      timeLimit: 25,
      questions: 12,
      status: 'available',
      description: 'Assess your understanding of encryption, hashing, and digital signatures.'
    },
    {
      id: 'lab-2',
      title: 'Penetration Testing Lab',
      type: 'lab',
      subject: 'Ethical Hacking',
      dueDate: 'Feb 12',
      maxPoints: 120,
      difficulty: 'hard',
      timeLimit: 120,
      status: 'available',
      description: 'Practice ethical hacking techniques in a controlled environment.'
    },
    {
      id: 'project-1',
      title: 'Security Risk Assessment',
      type: 'project',
      subject: 'Risk Management',
      dueDate: 'Feb 15',
      maxPoints: 150,
      difficulty: 'hard',
      status: 'available',
      description: 'Comprehensive analysis of security vulnerabilities in a given scenario.'
    },
    {
      id: 'quiz-3',
      title: 'Social Engineering Quiz',
      type: 'quiz',
      subject: 'Human Factors',
      dueDate: 'Feb 18',
      maxPoints: 60,
      difficulty: 'easy',
      timeLimit: 20,
      questions: 10,
      status: 'available',
      description: 'Learn to identify and prevent social engineering attacks.'
    }
  ];

  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Network Security Assessment - Due Tomorrow',
      content: 'Your network security assessment is due tomorrow at 11:59 PM. Please ensure you have completed all sections including the vulnerability analysis and mitigation strategies. Review the rubric posted in our materials section.',
      teacher: 'Ms. Sarah Johnson',
      timestamp: '2 hours ago',
      priority: 'important',
      pinned: true,
      attachments: [
        { name: 'Assessment Rubric.pdf', type: 'pdf' },
        { name: 'Network Diagram Template.docx', type: 'doc' }
      ]
    },
    {
      id: '2',
      title: 'Guest Speaker: Cybersecurity Expert',
      content: 'We are excited to have Maria Rodriguez, Senior Security Analyst at CyberGuard Corp, joining us next Wednesday for a discussion on real-world incident response. Please come prepared with questions about cybersecurity careers.',
      teacher: 'Ms. Sarah Johnson',
      timestamp: '1 day ago',
      priority: 'normal',
      attachments: [
        { name: 'Speaker Biography.pdf', type: 'pdf' },
        { name: 'CyberGuard Company Profile.pptx', type: 'ppt' }
      ]
    },
    {
      id: '3',
      title: 'Lab Equipment Maintenance',
      content: 'The cybersecurity lab will be undergoing routine maintenance this Friday from 1:00 PM to 3:00 PM. Please plan accordingly and ensure any ongoing lab work is saved.',
      teacher: 'Ms. Sarah Johnson',
      timestamp: '2 days ago',
      priority: 'normal',
      attachments: []
    },
    {
      id: '4',
      title: 'Midterm Project Guidelines',
      content: 'The midterm project guidelines have been posted. This project will account for 30% of your semester grade. Teams of 2-3 students will analyze a real-world cybersecurity incident and present their findings.',
      teacher: 'Ms. Sarah Johnson',
      timestamp: '3 days ago',
      priority: 'important',
      attachments: [
        { name: 'Project Guidelines.pdf', type: 'pdf' },
        { name: 'Team Formation Sheet.xlsx', type: 'excel' },
        { name: 'Incident Case Studies.zip', type: 'file' }
      ]
    }
  ];

  const classMembers: ClassMember[] = [
    { id: '1', name: 'Ms. Sarah Johnson', role: 'teacher', lastActive: 'Online now' },
    { id: '2', name: 'You', role: 'student', lastActive: 'Online now' },
    { id: '3', name: 'Alex Chen', role: 'student', lastActive: '10 min ago' },
    { id: '4', name: 'Sarah Miller', role: 'student', lastActive: '15 min ago' },
    { id: '5', name: 'Mike Johnson', role: 'student', lastActive: '20 min ago' },
    { id: '6', name: 'Emily Davis', role: 'student', lastActive: '25 min ago' },
    { id: '7', name: 'David Wilson', role: 'student', lastActive: '30 min ago' },
    { id: '8', name: 'Lisa Brown', role: 'student', lastActive: '1 hour ago' },
    { id: '9', name: 'James Garcia', role: 'student', lastActive: '2 hours ago' },
    { id: '10', name: 'Maria Rodriguez', role: 'student', lastActive: '3 hours ago' },
    { id: '11', name: 'Kevin Lee', role: 'student', lastActive: '4 hours ago' },
    { id: '12', name: 'Anna Martinez', role: 'student', lastActive: '5 hours ago' },
    { id: '13', name: 'Chris Taylor', role: 'student', lastActive: '6 hours ago' },
    { id: '14', name: 'Jessica White', role: 'student', lastActive: '1 day ago' },
    { id: '15', name: 'Ryan Anderson', role: 'student', lastActive: '1 day ago' },
    { id: '16', name: 'Nicole Thomas', role: 'student', lastActive: '2 days ago' },
    { id: '17', name: 'Brandon Clark', role: 'student', lastActive: '3 days ago' },
    { id: '18', name: 'Samantha Lewis', role: 'student', lastActive: '4 days ago' },
    { id: '19', name: 'Tyler Hall', role: 'student', lastActive: '5 days ago' },
    { id: '20', name: 'Ashley Walker', role: 'student', lastActive: '1 week ago' },
    { id: '21', name: 'Jordan Allen', role: 'student', lastActive: '1 week ago' },
    { id: '22', name: 'Taylor Young', role: 'student', lastActive: '1 week ago' },
    { id: '23', name: 'Cameron King', role: 'student', lastActive: '2 weeks ago' },
    { id: '24', name: 'Marcus Johnson', role: 'student', lastActive: '2 weeks ago' }
  ];

  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Network Security Assessment',
      course: 'CS6-2024',
      dueDate: 'Tomorrow',
      status: 'pending',
      maxPoints: 100,
      fullDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
    },
    {
      id: '2',
      title: 'Password Policy Analysis',
      course: 'CS6-2024',
      dueDate: 'Jan 30',
      status: 'graded',
      maxPoints: 75,
      earnedPoints: 68,
      percentage: 91,
      fullDueDate: new Date('2024-01-30')
    },
    {
      id: '3',
      title: 'Firewall Configuration Lab',
      course: 'CS6-2024',
      dueDate: 'Feb 5',
      status: 'assigned',
      maxPoints: 50,
      fullDueDate: new Date('2024-02-05')
    },
    {
      id: '4',
      title: 'Social Engineering Research',
      course: 'CS6-2024',
      dueDate: 'Feb 12',
      status: 'assigned',
      maxPoints: 80,
      fullDueDate: new Date('2024-02-12')
    },
    {
      id: '5',
      title: 'Cryptography Fundamentals Quiz',
      course: 'CS6-2024',
      dueDate: 'Jan 25',
      status: 'graded',
      maxPoints: 60,
      earnedPoints: 54,
      percentage: 90,
      fullDueDate: new Date('2024-01-25')
    }
  ];

  // Enhanced calendar events with full dates
  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Network Security Assessment Due',
      date: 'Tomorrow',
      time: '11:59 PM',
      type: 'assignment',
      day: 25,
      fullDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Guest Speaker: Maria Rodriguez',
      date: 'Jan 26',
      time: '2:00 PM',
      type: 'lecture',
      day: 26,
      fullDate: new Date('2024-01-26')
    },
    {
      id: '3',
      title: 'Lab Session - Room 301',
      date: 'Jan 27',
      time: '3:30 PM',
      type: 'lecture',
      day: 27,
      fullDate: new Date('2024-01-27')
    },
    {
      id: '4',
      title: 'Firewall Configuration Due',
      date: 'Feb 5',
      time: '11:59 PM',
      type: 'assignment',
      day: 5,
      fullDate: new Date('2024-02-05')
    }
  ];

  // Current day for calendar
  const currentDay = new Date().getDate();
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 5;
    return day > 0 && day <= 31 ? day : null;
  });

  // Helper functions
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'important':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'submitted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-red-400';
      case 'assignment':
        return 'bg-orange-400';
      case 'lecture':
        return 'bg-blue-400';
      default:
        return 'bg-purple-400';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'excel':
      case 'xlsx':
        return '📈';
      default:
        return '📎';
    }
  };

  const getAssignmentIcon = (type: string) => {
    switch (type) {
      case 'quiz': return FileText;
      case 'lab': return FlaskConical;
      case 'project': return Target;
      case 'assignment': return BookOpen;
      default: return FileText;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleStartAssignment = (assignment: SchoolAssignment) => {
    setSelectedAssignment(assignment);
    if (assignment.type === 'quiz') {
      // setShowQuizModal(true); // This state is removed, so this will cause an error
    } else {
      // For labs and projects, could redirect to specific pages
      alert(`Starting ${assignment.type}: ${assignment.title}`);
    }
  };

  const startQuiz = () => {
    if (selectedAssignment) {
      // Redirect to quiz page with parameters
      window.location.href = `/student/tools/quiz?assignment=${selectedAssignment.id}&title=${encodeURIComponent(selectedAssignment.title)}`;
    }
  };

  // Helper function to categorize assignments by due date
  const categorizeAssignments = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const dueSoon = assignments.filter(a => 
      a.status !== 'graded' && a.fullDueDate <= tomorrow
    );
    
    const dueThisWeek = assignments.filter(a => 
      a.status !== 'graded' && a.fullDueDate > tomorrow && a.fullDueDate <= nextWeek
    );

    const dueLater = assignments.filter(a => 
      a.status !== 'graded' && a.fullDueDate > nextWeek
    );

    return { dueSoon, dueThisWeek, dueLater };
  };

  const renderHome = () => {
    const { dueSoon, dueThisWeek } = categorizeAssignments();

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Great to see you {currentUser.name}!</h2>
            <p className="text-gray-400">Welcome back to your cybersecurity classroom</p>
          </div>

          {/* Recent Announcements - Scrolling */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-400" />
                Recent Announcements
              </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {announcements.slice(0, 3).map((announcement, index) => (
                <div key={announcement.id} className={`p-6 ${index < 2 ? 'border-b border-gray-700/50' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-white line-clamp-1">{announcement.title}</h4>
                    <Badge className={`${getPriorityColor(announcement.priority)} text-xs`}>
                      {announcement.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">{announcement.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{announcement.teacher} • {announcement.timestamp}</span>
                    {announcement.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3 w-3" />
                        {announcement.attachments.length} attachments
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-700/50">
              <Button 
                onClick={() => setCurrentTab('announcements')}
                variant="outline"
                className="w-full text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
              >
                View All Announcements
              </Button>
            </div>
          </div>

          {/* Due Soon Section */}
          {dueSoon.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Due Soon
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {dueSoon.map((assignment) => (
                  <div key={assignment.id} className="flex items-center gap-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{assignment.title}</h4>
                      <p className="text-sm text-gray-400">{assignment.dueDate} • {assignment.maxPoints} points</p>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Due This Week Section */}
          {dueThisWeek.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-700/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-400" />
                  Due This Week
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {dueThisWeek.map((assignment) => (
                  <div key={assignment.id} className="flex items-center gap-4 p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{assignment.title}</h4>
                      <p className="text-sm text-gray-400">{assignment.dueDate} • {assignment.maxPoints} points</p>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Assignments</span>
                <span className="font-semibold text-white">5/7 completed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Average Grade</span>
                <span className="font-semibold text-green-400">91.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Attendance</span>
                <span className="font-semibold text-blue-400">98%</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {calendarEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getEventTypeColor(event.type)}`} />
                  <div>
                    <p className="font-medium text-white text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setCurrentTab('calendar')}
              variant="outline"
              className="w-full mt-4 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
              size="sm"
            >
              View Full Calendar
            </Button>
          </div>

          {/* Work-To-Do Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Work-To-Do</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-orange-400 rounded"></div>
                <span className="text-sm text-gray-300">Complete network assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-gray-500 rounded"></div>
                <span className="text-sm text-gray-300">Review firewall configurations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-gray-500 rounded"></div>
                <span className="text-sm text-gray-300">Prepare for guest speaker</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'overview':
        return renderHome();
        
      case 'announcements':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-8"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{announcement.title}</h2>
                    <div className="flex items-center gap-3">
                      {announcement.pinned && <Pin className="h-5 w-5 text-orange-500" />}
                      <Badge className={`${getPriorityColor(announcement.priority)} text-sm px-3 py-1`}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">{announcement.teacher} • {announcement.timestamp}</p>
                </div>
                
                <p className="text-gray-300 text-base leading-relaxed mb-6">{announcement.content}</p>
                
                {announcement.attachments.length > 0 && (
                  <div className="border-t border-gray-700/50 pt-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      Attachments ({announcement.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {announcement.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-all cursor-pointer group">
                          <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{attachment.name}</p>
                            <p className="text-gray-400 text-xs uppercase">{attachment.type}</p>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4 text-blue-400 cursor-pointer" />
                            <Download className="h-4 w-4 text-green-400 cursor-pointer" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        );

      case 'assignments':
        return (
          <div className="max-w-4xl mx-auto space-y-4">
            {assignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">{assignment.title}</h3>
                      <p className="text-sm text-gray-400">Due: {assignment.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-gray-700/50 text-gray-300 border-gray-600">
                      {assignment.maxPoints} pts
                    </Badge>
                    <Badge className={`${getStatusColor(assignment.status)} capitalize`}>
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'virtual-labs':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
                <FlaskConical className="h-8 w-8 text-cyan-400" />
                Virtual Labs
              </h2>
              <p className="text-gray-400 text-lg">Practice cybersecurity skills in safe, simulated environments</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 'lab-1',
                  title: 'Network Penetration Testing',
                  description: 'Learn ethical hacking techniques by conducting penetration tests on virtual networks. Practice vulnerability scanning, exploitation, and reporting.',
                  difficulty: 'Hard',
                  duration: '90 minutes',
                  topics: ['Nmap', 'Metasploit', 'Burp Suite', 'Vulnerability Assessment'],
                  icon: Shield,
                  color: 'from-red-500/20 to-orange-500/20',
                  borderColor: 'border-red-500/30',
                  status: 'Available'
                },
                {
                  id: 'lab-2', 
                  title: 'Digital Forensics Investigation',
                  description: 'Investigate cybercrime scenarios using real forensic tools. Analyze digital evidence, recover deleted files, and build timeline of events.',
                  difficulty: 'Medium',
                  duration: '75 minutes',
                  topics: ['Autopsy', 'Volatility', 'Registry Analysis', 'Network Forensics'],
                  icon: Search,
                  color: 'from-blue-500/20 to-cyan-500/20',
                  borderColor: 'border-blue-500/30',
                  status: 'Available'
                },
                {
                  id: 'lab-3',
                  title: 'Secure Network Configuration',
                  description: 'Configure enterprise-level network security including firewalls, VPNs, and intrusion detection systems to protect against cyber threats.',
                  difficulty: 'Medium',
                  duration: '60 minutes', 
                  topics: ['pfSense', 'OpenVPN', 'Snort IDS', 'Network Segmentation'],
                  icon: Wifi,
                  color: 'from-green-500/20 to-emerald-500/20',
                  borderColor: 'border-green-500/30',
                  status: 'Available'
                }
              ].map((lab) => (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br ${lab.color} backdrop-blur-sm border ${lab.borderColor} rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <lab.icon className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${
                        lab.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        lab.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-green-500/20 text-green-300 border-green-500/30'
                      }`}>
                        {lab.difficulty}
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {lab.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {lab.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {lab.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{lab.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FlaskConical className="h-4 w-4" />
                      <span>Virtual Lab</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2">TOOLS & TOPICS:</p>
                    <div className="flex flex-wrap gap-1">
                      {lab.topics.map((topic, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-md">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => router.push(`/student/labs/${lab.id}`)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium group-hover:scale-105 transition-all"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Lab
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <FlaskConical className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">More Labs Coming Soon!</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    We're constantly adding new virtual labs to enhance your cybersecurity learning experience.
                  </p>
                  <Button
                    onClick={() => router.push('/student/tools')}
                    variant="outline"
                    className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    Explore AI Tools
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-blue-400" />
                  January 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-semibold text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const hasEvent = day && calendarEvents.some(event => event.day === day);
                    const isToday = day === currentDay;
                    const eventForDay = calendarEvents.find(event => event.day === day);
                    
                    return (
                      <div
                        key={index}
                        className={`
                          relative h-16 flex flex-col items-center justify-center rounded-lg transition-all cursor-pointer
                          ${day ? 'hover:bg-gray-700/50' : ''}
                          ${isToday ? 'bg-blue-500/20 border-2 border-blue-500' : 'bg-gray-800/30 border border-gray-700'}
                          ${hasEvent ? 'ring-2 ring-orange-500/50' : ''}
                        `}
                      >
                        {day && (
                          <>
                            <span className={`text-sm font-medium ${isToday ? 'text-blue-400' : 'text-white'}`}>
                              {day}
                            </span>
                            {hasEvent && (
                              <div className={`w-2 h-2 rounded-full ${getEventTypeColor(eventForDay?.type || 'event')} mt-1`} />
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Upcoming Events */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Upcoming Events</h3>
                  <div className="space-y-2">
                    {calendarEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                        <div className="flex-1">
                          <p className="text-white font-medium">{event.title}</p>
                          <p className="text-sm text-gray-400">{event.date} at {event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'grades':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Your Grades</h2>
              <p className="text-gray-400">Track your assignment scores and overall progress</p>
            </div>
            
            <div className="space-y-3">
              {assignments.filter(a => a.status === 'graded').map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-sm p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{assignment.title}</h3>
                        <p className="text-sm text-gray-400">Due: {assignment.dueDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${assignment.percentage! >= 90 ? 'text-green-400' : assignment.percentage! >= 80 ? 'text-blue-400' : assignment.percentage! >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {assignment.percentage}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.earnedPoints}/{assignment.maxPoints} pts
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Overall Grade Summary */}
            <Card className="mt-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white">Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">91.3%</div>
                    <div className="text-sm text-gray-400">Current Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">3/5</div>
                    <div className="text-sm text-gray-400">Graded Assignments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">A-</div>
                    <div className="text-sm text-gray-400">Letter Grade</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'members':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Class Members</h2>
              <p className="text-gray-400">24 students enrolled in this class</p>
            </div>
            
            <div className="space-y-0 bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
              {classMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex items-center gap-4 p-4 hover:bg-gray-700/30 transition-all
                    ${index < classMembers.length - 1 ? 'border-b border-gray-700/30' : ''}
                  `}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.lastActive}</p>
                  </div>
                  {member.role === 'teacher' && (
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      Teacher
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header with Profile */}
      <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Home Icon */}
              <Button
                onClick={() => router.push('/student/dashboard')}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-700/50 text-gray-300 hover:text-white"
                title="Go to Dashboard"
              >
                <Home className="h-5 w-5" />
              </Button>
              
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{classInfo.name}</h1>
                <p className="text-gray-400 text-sm">
                  {classInfo.code} • {classInfo.teacher}
                </p>
              </div>
            </div>
            
            {/* User Profile and Universal Apps Menu */}
            <div className="flex items-center gap-4">
              {/* Universal Apps Menu (same as navbar) */}
              <div className="relative">
                <Button
                  onClick={() => setShowAppsMenu(!showAppsMenu)}
                  variant="ghost"
                  size="sm"
                  className="p-3 hover:bg-gray-700/50 mr-2"
                  title="Quick Access"
                >
                  <Grid3x3 className="h-6 w-6 text-gray-300" />
                </Button>
                
                {showAppsMenu && (
                  <div className="absolute right-0 top-full mt-3 w-96 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-6 py-4 border-b border-gray-700/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Grid3x3 className="h-5 w-5 text-blue-400" />
                        Quick Access
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">Navigate to any part of CyberSkill</p>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-3 gap-4">
                        {appMenuItems.map((app) => (
                          <motion.button
                            key={app.label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              router.push(app.href);
                              setShowAppsMenu(false);
                            }}
                            className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-br hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-200 group border border-transparent hover:border-gray-600/50"
                          >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-600/50 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-200">
                              <app.icon className={`h-6 w-6 ${app.color} group-hover:scale-110 transition-transform duration-200`} />
                            </div>
                            <span className="text-xs text-gray-300 font-medium text-center group-hover:text-white transition-colors">{app.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    <div className="px-6 py-3 bg-gray-800/50 border-t border-gray-700/50 text-center">
                      <p className="text-xs text-gray-500">Click outside to close</p>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">{currentUser.name}</p>
                  <p className="text-xs text-gray-400">Student</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'assignments', label: 'Assignments', icon: ClipboardList },
              { id: 'virtual-labs', label: 'Virtual Labs', icon: FlaskConical },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'grades', label: 'Grades', icon: BarChart3 },
              { id: 'members', label: 'Members', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-all font-medium text-sm
                  ${currentTab === tab.id 
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10' 
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600 hover:bg-gray-800/50'
                  }
                `}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </div>

      {/* Quiz/Assignment Details Modal */}
      <AnimatePresence>
        {/* This modal state is removed, so this block will cause an error */}
        {/* {showQuizModal && selectedAssignment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl border border-gray-700 max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = getAssignmentIcon(selectedAssignment.type);
                    return <Icon className="h-6 w-6 text-blue-400" />;
                  })()}
                  <h3 className="text-lg font-semibold text-white">{selectedAssignment.title}</h3>
                </div>
                <Button
                  onClick={() => setShowQuizModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4 mb-6">
                <p className="text-gray-300 text-sm">{selectedAssignment.description}</p>
                
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Subject</p>
                    <p className="text-sm text-white font-medium">{selectedAssignment.subject}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Due Date</p>
                    <p className="text-sm text-white font-medium">{selectedAssignment.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Points</p>
                    <p className="text-sm text-white font-medium">{selectedAssignment.maxPoints} pts</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                    <p className={`text-sm font-medium ${getDifficultyColor(selectedAssignment.difficulty)}`}>
                      {selectedAssignment.difficulty}
                    </p>
                  </div>
                  {selectedAssignment.timeLimit && (
                    <>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Time Limit</p>
                        <p className="text-sm text-white font-medium">{selectedAssignment.timeLimit} min</p>
                      </div>
                    </>
                  )}
                  {selectedAssignment.questions && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Questions</p>
                      <p className="text-sm text-white font-medium">{selectedAssignment.questions}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowQuizModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={startQuiz}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start {selectedAssignment.type}
                </Button>
              </div>
            </motion.div>
          </div>
        )} */}
      </AnimatePresence>

      {/* Click outside to close apps menu */}
      {showAppsMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAppsMenu(false)}
        />
      )}
    </div>
  );
} 