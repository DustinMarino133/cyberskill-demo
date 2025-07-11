import type { ComponentType } from 'react';
import { 
  Palette, Target, Brain, Shield, Star, Zap, Trophy, Crown, 
  Sword, Heart, Coins, Gem, Diamond, Skull, Rocket,
  Sun, Moon, Eye, Flame, Snowflake, Leaf, Droplets, Wind,
  Mountain, Coffee, Book, Music, Gamepad2, Glasses
} from 'lucide-react';
import { ColorTheme } from '@/contexts/ThemeContext';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: ComponentType;
  category: 'weapon' | 'armor' | 'accessory' | 'boost' | 'cosmetic' | 'theme';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effect?: string;
  owned?: boolean;
  equipped?: boolean;
  themeId?: ColorTheme;
}

export interface UserInventory {
  coins: number;
  items: ShopItem[];
  equippedItems: string[];
  equippedTheme: ColorTheme;
}

// Shop Items
export const shopItems: ShopItem[] = [
  // Theme Items
  {
    id: 'theme-purple-pink',
    name: 'Purple Pink Theme',
    description: 'Default cyberpunk purple and pink color scheme',
    price: 0,
    icon: Palette,
    category: 'theme',
    rarity: 'common',
    effect: 'Changes the entire site color scheme',
    themeId: 'purple-pink',
    owned: true,
    equipped: true
  },
  {
    id: 'theme-blue-cyan',
    name: 'Ocean Blue Theme',
    description: 'Cool ocean blues with cyan accents',
    price: 500,
    icon: Droplets,
    category: 'theme',
    rarity: 'common',
    effect: 'Changes the entire site color scheme',
    themeId: 'blue-cyan'
  },
  {
    id: 'theme-green-emerald',
    name: 'Forest Green Theme',
    description: 'Natural greens with emerald highlights',
    price: 500,
    icon: Leaf,
    category: 'theme',
    rarity: 'common',
    effect: 'Changes the entire site color scheme',
    themeId: 'green-emerald'
  },
  {
    id: 'theme-orange-red',
    name: 'Sunset Fire Theme',
    description: 'Warm oranges and fiery reds',
    price: 750,
    icon: Flame,
    category: 'theme',
    rarity: 'rare',
    effect: 'Changes the entire site color scheme',
    themeId: 'orange-red'
  },
  {
    id: 'theme-yellow-amber',
    name: 'Golden Sun Theme',
    description: 'Bright yellows with amber glow',
    price: 750,
    icon: Sun,
    category: 'theme',
    rarity: 'rare',
    effect: 'Changes the entire site color scheme',
    themeId: 'yellow-amber'
  },
  {
    id: 'theme-teal-blue',
    name: 'Tropical Waters Theme',
    description: 'Tropical teal and ocean blue',
    price: 1000,
    icon: Mountain,
    category: 'theme',
    rarity: 'epic',
    effect: 'Changes the entire site color scheme',
    themeId: 'teal-blue'
  },
  {
    id: 'theme-indigo-purple',
    name: 'Midnight Sky Theme',
    description: 'Deep indigo with purple mystique',
    price: 1000,
    icon: Moon,
    category: 'theme',
    rarity: 'epic',
    effect: 'Changes the entire site color scheme',
    themeId: 'indigo-purple'
  },
  {
    id: 'theme-rose-pink',
    name: 'Rose Garden Theme',
    description: 'Elegant roses with soft pink',
    price: 1250,
    icon: Heart,
    category: 'theme',
    rarity: 'epic',
    effect: 'Changes the entire site color scheme',
    themeId: 'rose-pink'
  },
  {
    id: 'theme-lime-green',
    name: 'Electric Lime Theme',
    description: 'High-energy lime with electric green',
    price: 1500,
    icon: Zap,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'lime-green'
  },
  {
    id: 'theme-violet-purple',
    name: 'Royal Violet Theme',
    description: 'Majestic violet with royal purple',
    price: 1500,
    icon: Crown,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'violet-purple'
  },
  {
    id: 'theme-cyan-teal',
    name: 'Arctic Ice Theme',
    description: 'Cool cyan with icy teal',
    price: 1750,
    icon: Snowflake,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'cyan-teal'
  },
  {
    id: 'theme-amber-orange',
    name: 'Autumn Blaze Theme',
    description: 'Warm amber with blazing orange',
    price: 1750,
    icon: Coffee,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'amber-orange'
  },
  {
    id: 'theme-emerald-green',
    name: 'Emerald Forest Theme',
    description: 'Rich emerald with forest depth',
    price: 2000,
    icon: Gem,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'emerald-green'
  },
  {
    id: 'theme-slate-gray',
    name: 'Steel Gray Theme',
    description: 'Industrial slate with steel gray',
    price: 2000,
    icon: Shield,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'slate-gray'
  },
  {
    id: 'theme-crimson-red',
    name: 'Crimson Flame Theme',
    description: 'Bold crimson with flame red',
    price: 2500,
    icon: Skull,
    category: 'theme',
    rarity: 'legendary',
    effect: 'Changes the entire site color scheme',
    themeId: 'crimson-red'
  },

  // Original Items
  {
    id: 'cyber-sword',
    name: 'Cyber Sword',
    description: 'A high-tech blade that increases learning speed',
    price: 1200,
    icon: Sword,
    category: 'weapon',
    rarity: 'epic',
    effect: '+25% XP gain'
  },
  {
    id: 'neural-shield',
    name: 'Neural Shield',
    description: 'Protects against incorrect answers',
    price: 800,
    icon: Shield,
    category: 'armor',
    rarity: 'rare',
    effect: 'First wrong answer doesn\'t count'
  },
  {
    id: 'focus-glasses',
    name: 'Focus Glasses',
    description: 'Enhances concentration during study sessions',
    price: 600,
    icon: Glasses,
    category: 'accessory',
    rarity: 'rare',
    effect: '+15% quiz accuracy'
  },
  {
    id: 'xp-booster',
    name: 'XP Booster',
    description: 'Doubles XP gain for 1 hour',
    price: 300,
    icon: Rocket,
    category: 'boost',
    rarity: 'common',
    effect: '2x XP for 60 minutes'
  },
  {
    id: 'memory-crystal',
    name: 'Memory Crystal',
    description: 'Crystallized knowledge that boosts retention',
    price: 1000,
    icon: Diamond,
    category: 'accessory',
    rarity: 'epic',
    effect: '+30% flashcard efficiency'
  },
  {
    id: 'streak-multiplier',
    name: 'Streak Multiplier',
    description: 'Maintains your learning streak even when you miss a day',
    price: 500,
    icon: Star,
    category: 'boost',
    rarity: 'rare',
    effect: 'Streak protection for 3 days'
  },
  {
    id: 'golden-crown',
    name: 'Golden Crown',
    description: 'Shows your mastery over cybersecurity',
    price: 2000,
    icon: Crown,
    category: 'cosmetic',
    rarity: 'legendary',
    effect: 'Cosmetic prestige item'
  },
  {
    id: 'energy-drink',
    name: 'Cyber Energy Drink',
    description: 'Increases focus for extended study sessions',
    price: 150,
    icon: Coffee,
    category: 'boost',
    rarity: 'common',
    effect: '+10% concentration for 30 minutes'
  },
  {
    id: 'skill-book',
    name: 'Advanced Skill Book',
    description: 'Unlocks additional learning paths',
    price: 1500,
    icon: Book,
    category: 'accessory',
    rarity: 'epic',
    effect: 'Access to premium courses'
  },
  {
    id: 'gaming-controller',
    name: 'Elite Gaming Controller',
    description: 'Makes learning feel like gaming',
    price: 750,
    icon: Gamepad2,
    category: 'accessory',
    rarity: 'rare',
    effect: 'Enhanced interactive elements'
  }
];

// Default user inventory with 9999 coins
export const defaultInventory: UserInventory = {
  coins: 9999,
  items: [
    // User starts with the default theme
    {
      ...shopItems.find(item => item.id === 'theme-purple-pink')!,
      owned: true,
      equipped: true
    }
  ],
  equippedItems: ['theme-purple-pink'],
  equippedTheme: 'purple-pink'
};

// Helper functions
export const getItemById = (id: string): ShopItem | undefined => {
  return shopItems.find(item => item.id === id);
};

export const getItemsByCategory = (category: ShopItem['category']): ShopItem[] => {
  return shopItems.filter(item => item.category === category);
};

export const getItemsByRarity = (rarity: ShopItem['rarity']): ShopItem[] => {
  return shopItems.filter(item => item.rarity === rarity);
};

export const getRarityColor = (rarity: ShopItem['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'rare': return 'text-blue-400';
    case 'epic': return 'text-purple-400';
    case 'legendary': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

export const getRarityBorderColor = (rarity: ShopItem['rarity']): string => {
  switch (rarity) {
    case 'common': return 'border-gray-500';
    case 'rare': return 'border-blue-500';
    case 'epic': return 'border-purple-500';
    case 'legendary': return 'border-yellow-500';
    default: return 'border-gray-500';
  }
};

export const getCategoryIcon = (category: ShopItem['category']): ComponentType => {
  switch (category) {
    case 'weapon': return Sword;
    case 'armor': return Shield;
    case 'accessory': return Star;
    case 'boost': return Zap;
    case 'cosmetic': return Crown;
    case 'theme': return Palette;
    default: return Star;
  }
}; 