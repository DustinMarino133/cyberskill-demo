'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Palette, Zap, MousePointer, Crown,
  Lock, Check, ChevronRight, Search, Star,
  Award, Clock, Users, Download, Target,
  Shield, Sparkles, Gem, Heart, Eye,
  Gift, TrendingUp, Calendar, Flame,
  Swords, Map, Compass, Monitor, RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/shared/Navbar';
import { StudentProfile } from '@/lib/types';
import { demoStudent } from '@/lib/demo-data';
import { useShopEffects } from '@/contexts/ShopEffectsContext';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  category: 'cursor' | 'theme' | 'booster' | 'premium';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  features: string[];
  owned: boolean;
  equipped?: boolean;
  themeId?: string;
  boostAmount?: number;
  duration?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'achievement';
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
  icon: React.ComponentType<any>;
}

const SHOP_ITEMS: ShopItem[] = [
  // Default Options (Free)
  {
    id: 'cursor-default',
    title: 'Default Cursor',
    description: 'Classic CyberSkill cursor - clean and professional.',
    category: 'cursor',
    price: 0,
    rarity: 'common',
    features: ['Default style', 'Always available', 'Clean design'],
    owned: true,
    equipped: true
  },
  {
    id: 'theme-default',
    title: 'Default Theme',
    description: 'Classic CyberSkill blue theme - the original experience.',
    category: 'theme',
    price: 0,
    rarity: 'common',
    features: ['Blue gradient', 'Original design', 'Always available'],
    owned: true,
    equipped: true,
    themeId: 'default'
    },
    
    // Cursors
    {
    id: 'cursor-cyber',
    title: 'Cyber Cursor',
    description: 'A sleek cyberpunk-styled cursor with neon glow effects.',
    category: 'cursor',
    price: 250,
      rarity: 'common',
    features: ['Neon glow', 'Smooth animations', 'Cyberpunk style'],
    owned: false
  },
  {
    id: 'cursor-flame',
    title: 'Flame Cursor',
    description: 'Blazing cursor that leaves fire trails behind your clicks.',
    category: 'cursor',
    price: 500,
      rarity: 'rare',
    features: ['Fire trail effects', 'Heat distortion', 'Animated flames'],
    owned: false
  },
  {
    id: 'cursor-lightning',
    title: 'Lightning Cursor',
    description: 'Electric cursor with crackling lightning effects.',
    category: 'cursor',
    price: 750,
      rarity: 'epic',
    features: ['Lightning bolts', 'Electric sparks', 'Storm sounds'],
    owned: false
  },
  {
    id: 'cursor-galaxy',
    title: 'Galaxy Cursor',
    description: 'Cosmic cursor with swirling galaxy patterns and star effects.',
    category: 'cursor',
    price: 1500,
    rarity: 'legendary',
    features: ['Galaxy swirls', 'Twinkling stars', 'Cosmic dust', 'Space sounds'],
    owned: false
    },

    // Themes
    {
    id: 'theme-ocean',
    title: 'Ocean Depths',
    description: 'Cool blue and teal colors inspired by deep ocean waters.',
    category: 'theme',
    price: 400,
      rarity: 'common',
    features: ['Blue gradient', 'Ocean waves', 'Calming effect'],
    owned: false,
    themeId: 'blue-cyan'
    },
    {
      id: 'theme-forest',
    title: 'Emerald Forest',
    description: 'Rich green theme with natural earth tones.',
    category: 'theme',
    price: 600,
    rarity: 'rare',
    features: ['Green palette', 'Nature sounds', 'Forest vibes'],
    owned: false,
    themeId: 'green-emerald'
    },
    {
      id: 'theme-sunset',
    title: 'Sunset Blaze',
    description: 'Warm orange and red gradients like a beautiful sunset.',
    category: 'theme',
    price: 800,
      rarity: 'epic',
    features: ['Sunset colors', 'Warm glow', 'Dynamic gradient'],
    owned: false,
    themeId: 'orange-red'
  },
  {
    id: 'theme-crimson',
    title: 'Crimson Flame',
    description: 'Bold crimson and flame red for the ultimate warrior.',
    category: 'theme',
    price: 2000,
    rarity: 'legendary',
    features: ['Crimson fire', 'Flame effects', 'Warrior spirit', 'Exclusive'],
    owned: false,
    themeId: 'crimson-red'
  },

  // XP Boosters
  {
    id: 'booster-small',
    title: 'XP Boost (Small)',
    description: 'Increase XP gain by 25% for 1 hour.',
    category: 'booster',
    price: 100,
    rarity: 'common',
    features: ['+25% XP', '1 hour duration', 'All activities'],
    owned: false,
    boostAmount: 25,
    duration: '1 hour'
  },
  {
    id: 'booster-medium',
    title: 'XP Boost (Medium)',
    description: 'Increase XP gain by 50% for 2 hours.',
    category: 'booster',
      price: 200,
      rarity: 'rare',
    features: ['+50% XP', '2 hour duration', 'All activities'],
    owned: false,
    boostAmount: 50,
    duration: '2 hours'
  },
  {
    id: 'booster-large',
    title: 'XP Boost (Large)',
    description: 'Increase XP gain by 100% for 4 hours.',
    category: 'booster',
    price: 400,
      rarity: 'epic',
    features: ['+100% XP', '4 hour duration', 'All activities'],
    owned: false,
    boostAmount: 100,
    duration: '4 hours'
  },
  {
    id: 'booster-mega',
    title: 'Mega XP Boost',
    description: 'Triple XP gain for 24 hours! Ultimate power boost.',
    category: 'booster',
    price: 1000,
    rarity: 'legendary',
    features: ['+200% XP', '24 hour duration', 'All activities', 'Stack with others'],
    owned: false,
    boostAmount: 200,
    duration: '24 hours'
  },

  // Premium Items
  {
    id: 'premium-vip',
    title: 'VIP Membership',
    description: 'Unlock exclusive content and premium features.',
    category: 'premium',
    price: 2500,
    rarity: 'legendary',
    features: ['Exclusive courses', 'Priority support', 'Special badges', 'Monthly rewards'],
    owned: false
  },
  {
    id: 'premium-crown',
    title: 'Golden Crown',
    description: 'Show off your status with this prestigious crown icon.',
    category: 'premium',
    price: 5000,
      rarity: 'legendary',
    features: ['Crown icon', 'Special title', 'Prestige status', 'Exclusive color'],
    owned: false
  }
];

const MISSIONS: Mission[] = [
  // Daily Missions
  {
    id: 'daily-quiz',
    title: 'Daily Quiz Master',
    description: 'Complete 3 quizzes today',
    type: 'daily',
    progress: 1,
    target: 3,
    reward: 50,
    completed: false,
    icon: Target
  },
  {
    id: 'daily-streak',
    title: 'Keep the Streak',
    description: 'Maintain your learning streak',
    type: 'daily',
    progress: 1,
    target: 1,
    reward: 25,
    completed: true,
    icon: Flame
  },
  {
    id: 'daily-study',
    title: 'Study Session',
    description: 'Study for 30 minutes',
    type: 'daily',
    progress: 18,
    target: 30,
    reward: 40,
    completed: false,
    icon: Clock
  },

  // Weekly Missions
  {
    id: 'weekly-courses',
    title: 'Course Completion',
    description: 'Complete 2 courses this week',
    type: 'weekly',
    progress: 1,
    target: 2,
    reward: 200,
    completed: false,
    icon: Award
  },
  {
    id: 'weekly-perfect',
    title: 'Perfect Scores',
    description: 'Get 5 perfect quiz scores',
    type: 'weekly',
    progress: 3,
    target: 5,
    reward: 150,
    completed: false,
    icon: Star
  },
  {
    id: 'weekly-skills',
    title: 'Skill Diversification',
    description: 'Learn 3 new skills',
    type: 'weekly',
    progress: 2,
    target: 3,
    reward: 180,
    completed: false,
    icon: TrendingUp
  },

  // Achievement Missions
  {
    id: 'achievement-level',
    title: 'Level Up Warrior',
    description: 'Reach level 10',
    type: 'achievement',
    progress: 8,
    target: 10,
    reward: 500,
    completed: false,
    icon: Crown
  },
  {
    id: 'achievement-xp',
    title: 'XP Champion',
    description: 'Earn 20,000 total XP',
    type: 'achievement',
    progress: 12847,
    target: 20000,
    reward: 800,
    completed: false,
    icon: Sparkles
  },
  {
    id: 'achievement-community',
    title: 'Community Helper',
    description: 'Help 25 fellow students',
    type: 'achievement',
    progress: 7,
    target: 25,
    reward: 300,
    completed: false,
    icon: Users
  }
];

export default function ShopPage() {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [coins, setCoins] = useState(4850);
  const [ownedItems, setOwnedItems] = useState<string[]>(['cursor-default', 'theme-default']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('shop');
  const [showResetMessage, setShowResetMessage] = useState(false);
  const router = useRouter();
  const { 
    equippedItems, 
    updateEquippedItems, 
    applyXPBooster, 
    equipShopTheme, 
    setCursor,
    activeBooster,
    resetToDefaults
  } = useShopEffects();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      if (userData.role === 'student') {
        setUser(demoStudent);
        // Load saved data
        const savedPurchases = localStorage.getItem('shopPurchases');
        if (savedPurchases) {
          try {
            const purchases = JSON.parse(savedPurchases);
            setOwnedItems(Array.isArray(purchases) ? purchases : ['cursor-default', 'theme-default']);
          } catch {
            setOwnedItems(['cursor-default', 'theme-default']);
          }
        }
        // Equipped items are now managed by ShopEffectsContext
        // No need to load them here as the context handles it
        const savedCoins = localStorage.getItem('userCoins');
        if (savedCoins) {
          setCoins(parseInt(savedCoins) || 4850);
        }
      } else {
        router.push('/auth/login');
      }
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const purchaseItem = (item: ShopItem) => {
    if (coins >= item.price && !ownedItems.includes(item.id)) {
      const newCoins = coins - item.price;
      const newOwnedItems = [...ownedItems, item.id];
      
      setCoins(newCoins);
      setOwnedItems(newOwnedItems);
      
      // Save to localStorage
      localStorage.setItem('userCoins', newCoins.toString());
      localStorage.setItem('shopPurchases', JSON.stringify(newOwnedItems));
    }
  };

  const equipItem = (item: ShopItem) => {
    if (ownedItems.includes(item.id)) {
      let newEquippedItems = [...equippedItems];
      
      // Handle different item types
      if (item.category === 'theme') {
        // Unequip other themes
        newEquippedItems = newEquippedItems.filter(id => !id.startsWith('theme-'));
        // Apply theme through context
        if (item.themeId) {
          equipShopTheme(item.id);
        }
      } else if (item.category === 'cursor') {
        // Unequip other cursors
        newEquippedItems = newEquippedItems.filter(id => !id.startsWith('cursor-'));
        // Apply cursor through context
        setCursor(item.id);
      } else if (item.category === 'booster') {
        // Apply XP booster
        if (item.boostAmount && item.duration) {
          const durationHours = item.duration.includes('24') ? 24 : 
                               item.duration.includes('4') ? 4 :
                               item.duration.includes('2') ? 2 : 1;
          applyXPBooster(item.id, item.boostAmount, durationHours);
        }
        // Don't add boosters to equipped items as they're consumable
        return;
      }
      
      // Add this item if not already equipped
      if (!newEquippedItems.includes(item.id)) {
        newEquippedItems.push(item.id);
      }
      
      // Update equipped items through context
      updateEquippedItems(newEquippedItems);
    }
  };

  const handleResetToDefaults = () => {
    resetToDefaults();
    // Show reset message
    setShowResetMessage(true);
    setTimeout(() => setShowResetMessage(false), 3000);
  };

  const claimMissionReward = (mission: Mission) => {
    if (mission.progress >= mission.target && !mission.completed) {
      const newCoins = coins + mission.reward;
      setCoins(newCoins);
      localStorage.setItem('userCoins', newCoins.toString());
      
      // Mark mission as completed (would normally update in backend)
      mission.completed = true;
    }
  };

  const filteredItems = SHOP_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Items', icon: ShoppingBag },
    { id: 'cursor', label: 'Cursors', icon: MousePointer },
    { id: 'theme', label: 'Themes', icon: Palette },
    { id: 'booster', label: 'XP Boosters', icon: Zap },
    { id: 'premium', label: 'Premium', icon: Crown }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cursor': return MousePointer;
      case 'theme': return Palette;
      case 'booster': return Zap;
      case 'premium': return Crown;
      default: return ShoppingBag;
    }
  };

  const getMissionTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return Calendar;
      case 'weekly': return TrendingUp;
      case 'achievement': return Award;
      default: return Target;
    }
  };

  const getMissionTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'weekly': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'achievement': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-400">Loading shop...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
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
      </div>

      <Navbar user={user} />
          
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                <ShoppingBag className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Cyber Shop
                </h1>
                <p className="text-gray-400">Upgrade your cyberskill experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleResetToDefaults}
                className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 hover:text-white border border-gray-500/30"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
              {activeBooster && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-4 py-2 rounded-lg border border-green-500/30">
                  <Zap className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-bold text-green-400">
                    +{Math.floor(activeBooster.multiplier * 100)}% XP
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.floor((activeBooster.expiresAt - Date.now()) / (1000 * 60 * 60))}h left
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
                <Gem className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-bold text-yellow-400">{coins.toLocaleString()}</span>
                <span className="text-sm text-gray-400">Coins</span>
              </div>
            </div>
              </div>
          </motion.div>

        {/* Reset Message */}
        {showResetMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500/20 text-green-400 px-6 py-3 rounded-lg border border-green-500/30 backdrop-blur-sm shadow-lg z-50"
          >
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Successfully reset to defaults!</span>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="grid w-full grid-cols-2 bg-gray-800/50 border border-blue-500/20 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('shop')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-l-lg transition-all ${
                activeTab === 'shop' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Shop</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-r-lg transition-all ${
                activeTab === 'inventory' 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Shield className="h-4 w-4" />
              <span>Inventory</span>
            </button>
          </div>

          {/* Shop Tab */}
          {activeTab === 'shop' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800/50 border-blue-500/20 text-white placeholder-gray-400"
              />
            </div>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
              <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`whitespace-nowrap ${
                          selectedCategory === category.id
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-gray-800/50 text-gray-400 border-gray-600/30 hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
              </Button>
                    );
                  })}
                </div>
              </div>

          {/* Items Grid */}
          <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {filteredItems.map((item, index) => {
                  const Icon = getCategoryIcon(item.category);
                  const isOwned = ownedItems.includes(item.id);
                  const isEquipped = equippedItems.includes(item.id);
                  
                  return (
                <motion.div
                  key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-blue-500/20 hover:border-blue-400/30 transition-all duration-300 h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="h-6 w-6 text-blue-400" />
                            <Badge className={`${getRarityColor(item.rarity)} border font-medium`}>
                              {item.rarity}
                          </Badge>
                      </div>
                          <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400 text-sm">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1">
                              {item.features.slice(0, 3).map((feature) => (
                                <span
                                  key={feature}
                                  className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-1">
                                <Gem className="h-4 w-4 text-yellow-400" />
                                <span className="font-bold text-yellow-400">{item.price}</span>
                              </div>
                              
                              {isOwned ? (
                                isEquipped ? (
                                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                                    <Check className="h-3 w-3 mr-1" />
                                    Equipped
                                  </Badge>
                                ) : (
                                  <Button
                                    onClick={() => equipItem(item)}
                                    size="sm"
                                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                                  >
                                    Equip
                                  </Button>
                                )
                              ) : (
                                <Button
                                  onClick={() => purchaseItem(item)}
                                  disabled={coins < item.price}
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {coins >= item.price ? 'Buy' : 'Need more coins'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Your Inventory</h3>
                <p className="text-gray-400 mb-6">Manage your purchased items and equipment</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {ownedItems.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No items purchased yet. Visit the shop to get started!</p>
                    </div>
                  ) : (
                    SHOP_ITEMS.filter(item => ownedItems.includes(item.id)).map((item) => {
                      const Icon = getCategoryIcon(item.category);
                      const isEquipped = equippedItems.includes(item.id);
                      
                      return (
                        <Card key={item.id} className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-blue-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                              <Icon className="h-5 w-5 text-blue-400" />
                              <div className="flex-1">
                                <h4 className="font-medium text-white">{item.title}</h4>
                                <Badge className={`${getRarityColor(item.rarity)} border text-xs`}>
                                  {item.rarity}
                                </Badge>
                        </div>
                      </div>

                            {isEquipped ? (
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 w-full justify-center">
                                <Check className="h-3 w-3 mr-1" />
                                Equipped
                              </Badge>
                            ) : (
                            <Button
                              onClick={() => equipItem(item)}
                                size="sm"
                                className="w-full bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                              >
                                  Equip
                            </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                      </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
} 