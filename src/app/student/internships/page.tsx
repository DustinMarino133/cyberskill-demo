'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Briefcase, MapPin, Clock, DollarSign, Users, Building,
  ChevronLeft, Heart, ExternalLink, Filter, Search,
  Star, Award, Calendar, CheckCircle, AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { toast } from 'react-hot-toast';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  duration: string;
  stipend?: string;
  description: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  posted: string;
  deadline: string;
  logo?: string;
  rating: number;
  applications: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

export default function InternshipsPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [savedInternships, setSavedInternships] = useState<string[]>([]);
  const [appliedInternships, setAppliedInternships] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        loadInternships();
        loadUserData();
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const loadInternships = () => {
    const internshipData: Internship[] = [
      {
        id: 'cyber-intern-1',
        title: 'Cybersecurity Analyst Intern',
        company: 'TechGuard Solutions',
        location: 'New York, NY',
        type: 'hybrid',
        duration: '3 months',
        stipend: '$2,000/month',
        description: 'Join our cybersecurity team to learn threat analysis, incident response, and security monitoring.',
        requirements: ['Basic cybersecurity knowledge', 'Strong analytical skills', 'Team collaboration'],
        skills: ['Network Security', 'Threat Analysis', 'Incident Response'],
        benefits: ['Mentorship program', 'Certificate upon completion', 'Full-time offer potential'],
        posted: '2024-02-01',
        deadline: '2024-03-15',
        rating: 4.8,
        applications: 45,
        difficulty: 'intermediate',
        featured: true
      },
      {
        id: 'cyber-intern-2',
        title: 'Junior Security Researcher',
        company: 'CyberLabs Inc',
        location: 'Remote',
        type: 'remote',
        duration: '6 months',
        stipend: '$1,800/month',
        description: 'Research emerging cyber threats and develop security solutions under expert guidance.',
        requirements: ['Programming skills (Python/Java)', 'Research experience', 'Self-motivated'],
        skills: ['Malware Analysis', 'Vulnerability Research', 'Python Programming'],
        benefits: ['Research publication opportunities', 'Conference attendance', 'Flexible schedule'],
        posted: '2024-02-05',
        deadline: '2024-03-20',
        rating: 4.6,
        applications: 32,
        difficulty: 'advanced',
        featured: true
      },
      {
        id: 'cyber-intern-3',
        title: 'SOC Analyst Trainee',
        company: 'SecureNet Corp',
        location: 'Austin, TX',
        type: 'onsite',
        duration: '4 months',
        stipend: '$2,200/month',
        description: 'Monitor security events, analyze alerts, and support incident response activities.',
        requirements: ['Basic networking knowledge', 'Attention to detail', 'Willingness to learn'],
        skills: ['SIEM Tools', 'Log Analysis', 'Incident Response'],
        benefits: ['Industry certifications', 'Hands-on experience', 'Career mentorship'],
        posted: '2024-02-08',
        deadline: '2024-03-25',
        rating: 4.7,
        applications: 28,
        difficulty: 'beginner',
        featured: false
      }
    ];

    setInternships(internshipData);
    setFilteredInternships(internshipData);
  };

  const loadUserData = () => {
    const saved = localStorage.getItem('savedInternships');
    const applied = localStorage.getItem('appliedInternships');
    
    if (saved) setSavedInternships(JSON.parse(saved));
    if (applied) setAppliedInternships(JSON.parse(applied));
  };

  useEffect(() => {
    let filtered = internships;

    if (searchQuery) {
      filtered = filtered.filter(internship =>
        internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        internship.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(internship => internship.type === locationFilter);
    }

    setFilteredInternships(filtered);
  }, [internships, searchQuery, locationFilter, typeFilter]);

  const saveInternship = (internshipId: string) => {
    const newSaved = savedInternships.includes(internshipId)
      ? savedInternships.filter(id => id !== internshipId)
      : [...savedInternships, internshipId];
    
    setSavedInternships(newSaved);
    localStorage.setItem('savedInternships', JSON.stringify(newSaved));
    
    if (newSaved.includes(internshipId)) {
      toast.success('Internship saved! 💾');
    } else {
      toast.success('Internship removed from saved list');
    }
  };

  const applyToInternship = (internship: Internship) => {
    if (appliedInternships.includes(internship.id)) {
      toast.error('You have already applied to this internship');
      return;
    }

    const newApplied = [...appliedInternships, internship.id];
    setAppliedInternships(newApplied);
    localStorage.setItem('appliedInternships', JSON.stringify(newApplied));
    
    toast.success(`Application submitted to ${internship.company}! 🎉`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
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
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Briefcase className="h-8 w-8 mr-3 text-cyber-green" />
                Cybersecurity Internships
              </h1>
              <p className="text-muted-foreground mt-1">
                Launch your cybersecurity career with real-world experience
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search internships, companies, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-input text-foreground"
              >
                <option value="all">All Types</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Application Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-cyber-green mb-2">
                {filteredInternships.length}
              </div>
              <div className="text-sm text-muted-foreground">Available Internships</div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-cyber-blue mb-2">
                {appliedInternships.length}
              </div>
              <div className="text-sm text-muted-foreground">Applications Submitted</div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-cyber-purple mb-2">
                {savedInternships.length}
              </div>
              <div className="text-sm text-muted-foreground">Saved for Later</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Internship Listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredInternships.map((internship) => (
            <Card key={internship.id} className={`cyber-card ${internship.featured ? 'border-2 border-cyber-green/30' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {internship.featured && (
                        <Badge className="bg-cyber-green text-black">Featured</Badge>
                      )}
                      <Badge className={`${getDifficultyColor(internship.difficulty)} text-white`}>
                        {internship.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{internship.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-primary">
                      {internship.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveInternship(internship.id)}
                      className={savedInternships.includes(internship.id) ? 'text-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 ${savedInternships.includes(internship.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{internship.stipend || 'Unpaid'}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{internship.applications} applicants</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground">
                  {internship.description}
                </p>

                {/* Skills */}
                <div>
                  <div className="text-sm font-medium mb-2">Skills you'll learn:</div>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <div className="text-sm font-medium mb-2">Benefits:</div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {internship.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-cyber-green" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Posted: {new Date(internship.posted).toLocaleDateString()} • 
                    Deadline: {new Date(internship.deadline).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      onClick={() => applyToInternship(internship)}
                      disabled={appliedInternships.includes(internship.id)}
                      className={`${
                        appliedInternships.includes(internship.id)
                          ? 'bg-gray-500 hover:bg-gray-500'
                          : 'bg-cyber-green hover:bg-cyber-green/90 text-black'
                      }`}
                      size="sm"
                    >
                      {appliedInternships.includes(internship.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Applied
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Career Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Internship Success Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Before Applying</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-cyber-green mt-0.5" />
                      Complete relevant CyberSkill courses
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-cyber-green mt-0.5" />
                      Build a portfolio of projects
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-cyber-green mt-0.5" />
                      Practice technical interview questions
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">During Application</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-cyber-green mt-0.5" />
                      Tailor your resume to each position
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-cyber-green mt-0.5" />
                      Write a compelling cover letter
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-cyber-green mt-0.5" />
                      Apply early to increase your chances
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
} 