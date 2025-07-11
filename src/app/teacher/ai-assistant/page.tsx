'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, MessageSquare, Send, Upload, Plus, Search, 
  Trash2, Edit, Download, FileText, BookOpen, Users,
  ArrowLeft, Save, ChevronRight, Sparkles, Zap,
  Clock, Star, Pin, Archive, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/shared/Navbar';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'teacher' | 'ai';
  timestamp: Date;
  isTyping?: boolean;
}

interface SavedChat {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
  pinned?: boolean;
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return <span className="whitespace-pre-wrap">{displayText}</span>;
};

export default function AIAssistantPage() {
  const [user, setUser] = useState<any>(null);
  const [currentChatId, setCurrentChatId] = useState<string>('chat-1');
  const [savedChats, setSavedChats] = useState<SavedChat[]>([
    {
      id: 'chat-1',
      title: 'Quiz Generation Help',
      preview: 'I can help you create a quiz! Here are some sample questions...',
      timestamp: new Date(Date.now() - 3600000),
      messageCount: 8,
      pinned: true
    },
    {
      id: 'chat-2', 
      title: 'Student Analytics',
      preview: 'Based on your class analytics, here are some insights...',
      timestamp: new Date(Date.now() - 7200000),
      messageCount: 12
    },
    {
      id: 'chat-3',
      title: 'Curriculum Planning',
      preview: 'I can help you create engaging assignments! Here are some ideas...',
      timestamp: new Date(Date.now() - 86400000),
      messageCount: 5
    }
  ]);

  const [chats, setChats] = useState<{[key: string]: ChatMessage[]}>({
    'chat-1': [
      {
        id: '1',
        content: 'How do I make a good quiz on something',
        sender: 'teacher',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        content: `I can help you create a quiz! Here are some sample questions for cybersecurity:

**Multiple Choice:**
1. What is the primary purpose of a firewall?
   a) Speed up internet connection
   b) Filter network traffic based on security rules ✓
   c) Store user passwords
   d) Encrypt data

**True/False:**
2. SSL and TLS are the same protocol. (False)

**Essay:**
3. Explain the difference between symmetric and asymmetric encryption.

Would you like me to generate more questions or help you create a complete quiz?`,
        sender: 'ai',
        timestamp: new Date(Date.now() - 3590000)
      },
      {
        id: '3',
        content: 'Yeah please, that would be nice',
        sender: 'teacher',
        timestamp: new Date(Date.now() - 3580000)
      },
      {
        id: '4',
        content: `I'm your AI teaching assistant! I can help you with:

📚 **Curriculum Development**
- Generate quiz questions and answers
- Create lab scenarios and instructions
- Design project rubrics

👥 **Student Management** 
- Analyze class performance
- Identify struggling students
- Suggest intervention strategies

📊 **Assessment Tools**
- Create diverse question types
- Generate explanations and feedback
- Design difficulty-appropriate content`,
        sender: 'ai',
        timestamp: new Date(Date.now() - 3570000)
      }
    ]
  });

  const [currentMessage, setCurrentMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'teacher') {
        setUser({ ...userData, name: 'Sarah Johnson' });
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats[currentChatId]]);

  const generateAiResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('quiz') || lowerMessage.includes('question')) {
      return `I can help you create a quiz! Here are some sample questions for cybersecurity:

**Multiple Choice:**
1. What is the primary purpose of a firewall?
   a) Speed up internet connection
   b) Filter network traffic based on security rules ✓
   c) Store user passwords
   d) Encrypt data

**True/False:**
2. SSL and TLS are the same protocol. (False)

**Essay:**
3. Explain the difference between symmetric and asymmetric encryption.

Would you like me to generate more questions or help you create a complete quiz?`;
    }
    
    if (lowerMessage.includes('student') || lowerMessage.includes('grade')) {
      return `Based on your class analytics, here are some insights:

📊 **Class Overview:**
- Average grade: 83%
- Students struggling: 1 (Michael Rodriguez - 67%)
- Top performer: Sarah Johnson (92%)
- Missing assignments: 7 total across all students

🎯 **Recommendations:**
- Consider offering extra help to Michael
- Create a peer tutoring system
- Send reminders for missing assignments

Would you like me to create personalized learning plans for struggling students?`;
    }
    
    return `I'm your AI teaching assistant! I can help you with:

📚 **Curriculum Development**
- Generate quiz questions and answers
- Create lab scenarios and instructions
- Design project rubrics

👥 **Student Management** 
- Analyze class performance
- Identify struggling students
- Suggest intervention strategies

📊 **Assessment Tools**
- Create diverse question types
- Generate explanations and feedback
- Design difficulty-appropriate content

What would you like help with today?`;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'teacher',
      timestamp: new Date()
    };

    setChats(prev => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMessage]
    }));

    setCurrentMessage('');
    setIsAiTyping(true);

    // Update saved chat
    setSavedChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messageCount: chat.messageCount + 1, timestamp: new Date() }
        : chat
    ));

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAiResponse(currentMessage),
        sender: 'ai',
        timestamp: new Date(),
        isTyping: true
      };

      setChats(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), aiResponse]
      }));

      setIsAiTyping(false);
    }, 1500);
  };

  const createNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    const newChat: SavedChat = {
      id: newChatId,
      title: 'New Chat',
      preview: 'Start a new conversation...',
      timestamp: new Date(),
      messageCount: 0
    };

    setSavedChats(prev => [newChat, ...prev]);
    setChats(prev => ({ ...prev, [newChatId]: [] }));
    setCurrentChatId(newChatId);
  };

  const deleteChat = (chatId: string) => {
    if (savedChats.length <= 1) return;
    
    setSavedChats(prev => prev.filter(chat => chat.id !== chatId));
    setChats(prev => {
      const newChats = { ...prev };
      delete newChats[chatId];
      return newChats;
    });
    
    if (currentChatId === chatId) {
      setCurrentChatId(savedChats.find(chat => chat.id !== chatId)?.id || savedChats[0].id);
    }
  };

  const filteredChats = savedChats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navbar user={user} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-r border-slate-700/50 flex flex-col"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    AI Assistant
                  </h2>
                  <Button
                    onClick={createNewChat}
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chats..."
                    className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-2">
                  {filteredChats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg cursor-pointer transition-all group relative ${
                        currentChatId === chat.id
                          ? 'bg-purple-500/20 border border-purple-500/30'
                          : 'bg-slate-800/30 hover:bg-slate-700/30 border border-transparent'
                      }`}
                      onClick={() => setCurrentChatId(chat.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {chat.pinned && <Pin className="h-3 w-3 text-yellow-400" />}
                            <h3 className={`font-medium text-sm truncate ${
                              currentChatId === chat.id ? 'text-white' : 'text-gray-200'
                            }`}>
                              {chat.title}
                            </h3>
                          </div>
                          <p className="text-xs text-gray-400 truncate">{chat.preview}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {chat.timestamp.toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {chat.messageCount}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteChat(chat.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-b border-slate-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowSidebar(!showSidebar)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-white">AI Teaching Assistant</h1>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      File Upload Ready
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-slate-900/20 to-slate-800/20">
            <div className="max-w-4xl mx-auto space-y-6">
              {(!chats[currentChatId] || chats[currentChatId].length === 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-10 w-10 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">AI Teaching Assistant</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Upload curriculum files, ask questions about teaching, or request quiz generation to get started!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                    <Card className="bg-slate-800/30 border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors">
                      <CardContent className="p-4 text-center">
                        <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium mb-1">Generate Quiz</h4>
                        <p className="text-gray-400 text-sm">Create questions and assessments</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/30 border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors">
                      <CardContent className="p-4 text-center">
                        <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium mb-1">Analyze Students</h4>
                        <p className="text-gray-400 text-sm">Get performance insights</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/30 border-slate-700/50 cursor-pointer hover:bg-slate-700/30 transition-colors">
                      <CardContent className="p-4 text-center">
                        <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium mb-1">Plan Curriculum</h4>
                        <p className="text-gray-400 text-sm">Design learning materials</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              )}

              {chats[currentChatId]?.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender === 'teacher' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                      : 'bg-gradient-to-r from-slate-700/80 to-slate-800/80 text-gray-100'
                  } rounded-2xl p-4 shadow-lg backdrop-blur-sm border ${
                    message.sender === 'teacher' 
                      ? 'border-blue-400/30' 
                      : 'border-slate-600/30'
                  }`}>
                    <div className="text-sm leading-relaxed">
                      {message.isTyping ? (
                        <TypewriterText text={message.content} speed={20} />
                      ) : (
                        message.content
                      )}
                    </div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isAiTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-slate-700/80 to-slate-800/80 text-gray-100 rounded-2xl p-4 shadow-lg backdrop-blur-sm border border-slate-600/30">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Ask for quiz generation, curriculum help, student analytics, or teaching advice..."
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-gray-400 text-base py-3"
                  disabled={isAiTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isAiTyping}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 px-6"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <span className="text-xs text-gray-500">PDF, DOCX, TXT supported</span>
                </div>
                <div className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 