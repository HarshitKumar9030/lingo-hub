'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StoryModal } from '@/components/story/StoryModal';
import { FullScreenStoryPlayer } from '@/components/story/FullScreenStoryPlayer';
import { SafeMotionDiv } from '@/components/ui/safe-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  Trophy, 
  BookOpen, 
  Sparkles, 
  Play,
  RefreshCw,
  Star,
  Target,
  Brain,
  Globe,
  TrendingUp,
  ChevronDown,
  CheckCircle,
  Lock,
  Wand2,
  Languages,
  Coffee,
  Plane,
  ShoppingCart,
  Building,
  UtensilsCrossed,
  ShoppingBag,
  Train,
  MapPin,
  User,
  Trees,
  Briefcase,
  Rocket,
  Crown,
  BookMarked,
  Flame,
  PartyPopper
} from 'lucide-react';
import { IStory } from '@/lib/models/Story';

interface EnhancedStory {
  _id: string;
  title: string;
  description: string;
  difficulty: number;
  emoji: string;
  estimatedTime: number;
  scenario: string;
  isPublished: boolean;
  aiGenerated: boolean;
  tags: string[];
  prerequisites?: string[];
  metadata: {
    wordsIntroduced: number;
    grammarConcepts: string[];
  };
  language?: string;
  scenes?: any[];
  userRating?: number;
  completedBy?: number;
  averageScore?: number;
}

interface UserProgress {
  storiesCompleted: string[];
  currentLevel: number;
  totalQuizScore: number;
}

const SCENARIOS = [
  { id: 'all', name: 'All Stories', emoji: '📚', icon: BookOpen },
  { id: 'cafe', name: 'Café', emoji: '☕', icon: Coffee },
  { id: 'airport', name: 'Airport', emoji: '✈️', icon: Plane },
  { id: 'supermarket', name: 'Supermarket', emoji: '🛒', icon: ShoppingCart },
  { id: 'hotel', name: 'Hotel', emoji: '🏨', icon: Building },
  { id: 'restaurant', name: 'Restaurant', emoji: '🍽️', icon: UtensilsCrossed },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', icon: ShoppingBag },
  { id: 'transportation', name: 'Transport', emoji: '🚇', icon: Train },
  { id: 'bank', name: 'Bank', emoji: '🏦', icon: Building },
  { id: 'doctor', name: 'Doctor', emoji: '👩‍⚕️', icon: User },
  { id: 'park', name: 'Park', emoji: '🌳', icon: Trees },
  { id: 'office', name: 'Office', emoji: '💼', icon: Briefcase }
];

const DIFFICULTY_LEVELS = [
  { level: 1, name: 'Beginner', color: 'green', description: 'Basic phrases and vocabulary' },
  { level: 2, name: 'Elementary', color: 'blue', description: 'Simple conversations' },
  { level: 3, name: 'Intermediate', color: 'yellow', description: 'Complex interactions' },
  { level: 4, name: 'Advanced', color: 'orange', description: 'Professional situations' },
  { level: 5, name: 'Expert', color: 'red', description: 'Native-like fluency' }
];

const LANGUAGES = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { code: 'korean', name: 'Korean', flag: '🇰🇷' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳' }
];

export function EnhancedStoriesClient() {
  const { data: session } = useSession();
  const router = useRouter();
  
  // State management
  const [mounted, setMounted] = useState(false);
  const [stories, setStories] = useState<EnhancedStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<EnhancedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStory, setSelectedStory] = useState<IStory | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [showEnhancedPlayer, setShowEnhancedPlayer] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    storiesCompleted: [],
    currentLevel: 1,
    totalQuizScore: 0
  });
  const [generatingStory, setGeneratingStory] = useState(false);
  const [aiLanguage, setAiLanguage] = useState('spanish');
  const [aiScenario, setAiScenario] = useState('cafe');
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  // Helper functions
  const fetchStories = useCallback(async () => {
    try {
      const response = await fetch('/api/stories?limit=50');
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories || []);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProgress = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProgress({
          storiesCompleted: profile.progress?.storiesCompleted || [],
          currentLevel: profile.progress?.currentLevel || 1,
          totalQuizScore: profile.progress?.totalQuizScore || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  }, []);

  const filterStories = useCallback(() => {
    let filtered = [...stories];

    if (searchTerm) {      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedScenario !== 'all') {
      filtered = filtered.filter(story => story.scenario === selectedScenario);
    }

    if (selectedDifficulty !== null) {
      filtered = filtered.filter(story => story.difficulty === selectedDifficulty);
    }    filtered.sort((a, b) => {
      const aCompleted = userProgress.storiesCompleted?.includes(a._id) ?? false;
      const bCompleted = userProgress.storiesCompleted?.includes(b._id) ?? false;
      
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      
      const aDiffScore = Math.abs(a.difficulty - (userProgress.currentLevel ?? 1));
      const bDiffScore = Math.abs(b.difficulty - (userProgress.currentLevel ?? 1));
      
      return aDiffScore - bDiffScore;
    });

    setFilteredStories(filtered);
  }, [stories, searchTerm, selectedScenario, selectedDifficulty, userProgress.storiesCompleted, userProgress.currentLevel]);

  // Effects - properly ordered to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user && mounted) {
      fetchStories();
      fetchUserProgress();
    }
  }, [session, mounted, fetchStories, fetchUserProgress]);

  useEffect(() => {
    if (mounted) {
      filterStories();
    }
  }, [mounted, filterStories]);

  // Event handlers
  const generateNewStory = async () => {
    if (!session?.user) return;
    
    setGeneratingStory(true);
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: aiScenario,
          difficulty: Math.min(5, Math.max(1, userProgress.currentLevel ?? 1)),
          language: aiLanguage
        }),
      });

      if (response.ok) {
        const { story } = await response.json();
        setStories(prev => [story, ...prev]);
        setSelectedStory(story);
        setIsStoryModalOpen(true);
        setShowAiGenerator(false);
      }
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleOpenStory = async (storyId: string) => {
    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId }),
      });

      if (response.ok) {
        const { story } = await response.json();
        setSelectedStory(story);
        setIsStoryModalOpen(true);
      }
    } catch (error) {
      console.error('Error opening story:', error);
    }
  };

  const handleStoryComplete = (xpEarned: number, wordsLearned: string[]) => {
    setIsStoryModalOpen(false);
    setSelectedStory(null);
    
    if (selectedStory) {      setUserProgress(prev => ({
        ...prev,
        storiesCompleted: [...(prev.storiesCompleted ?? []), selectedStory._id],
        totalQuizScore: (prev.totalQuizScore ?? 0) + xpEarned
      }));
    }
    
    fetchStories();
  };
  const handlePlayEnhanced = async (story: EnhancedStory) => {
    try {
      // Fetch complete story data
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ storyId: story._id }),
      });

      if (response.ok) {
        const { story: fullStory } = await response.json();
        setSelectedStory(fullStory);
        setShowEnhancedPlayer(true);
      } else {
        console.error('Failed to fetch complete story data');
      }
    } catch (error) {
      console.error('Error fetching story details:', error);
    }
  };

  const handleEnhancedComplete = (score: number, timeSpent: number, wordsLearned: number, achievements: string[]) => {
    setShowEnhancedPlayer(false);
    setSelectedStory(null);
    
    if (selectedStory) {      setUserProgress(prev => ({
        ...prev,
        storiesCompleted: [...(prev.storiesCompleted ?? []), selectedStory._id],
        totalQuizScore: (prev.totalQuizScore ?? 0) + score
      }));
    }
    
    fetchStories();
  };

  const getDifficultyColor = (difficulty: number) => {
    const config = DIFFICULTY_LEVELS.find(d => d.level === difficulty);
    switch (config?.color) {
      case 'green': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800';
      case 'orange': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'red': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-700';
    }
  };  const isStoryLocked = (story: EnhancedStory) => {
    return story.prerequisites?.some((prereqId: string) => !userProgress.storiesCompleted?.includes(prereqId)) ?? false;
  };
  const isStoryCompleted = (story: EnhancedStory) => {
    return userProgress.storiesCompleted?.includes(story._id) ?? false;
  };

  // Early returns for SSR safety
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading stories...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your personalized language learning stories.
            </p>
            <Button onClick={() => router.push('/auth/signin')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Enhanced Header */}
        <SafeMotionDiv
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                📖 Interactive Stories
              </h1>
              <p className="text-xl text-muted-foreground">
                Master languages through immersive storytelling experiences
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Your Level</div>
                <div className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  {userProgress.currentLevel ?? 1}
                </div>
              </div>
              
              <Button
                onClick={() => setShowAiGenerator(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Create Story
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SafeMotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold">{userProgress.storiesCompleted?.length ?? 0}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </Card>
            </SafeMotionDiv>
            
            <SafeMotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
                <div className="flex items-center gap-3">
                  <Flame className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{(userProgress.totalQuizScore ?? 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total XP</div>
                  </div>
                </div>
              </Card>
            </SafeMotionDiv>
            
            <SafeMotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <div className="flex items-center gap-3">
                  <BookMarked className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stories.length}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                </div>
              </Card>
            </SafeMotionDiv>
            
            <SafeMotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {stories.length > 0 ? Math.round(((userProgress.storiesCompleted?.length ?? 0) / stories.length) * 100) : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                </div>
              </Card>
            </SafeMotionDiv>
          </div>
        </SafeMotionDiv>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search stories by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-12 px-6"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border backdrop-blur-sm">
              {/* Scenario Filter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Scenarios
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {SCENARIOS.map((scenario) => {
                    const IconComponent = scenario.icon;
                    return (
                      <Button
                        key={scenario.id}
                        variant={selectedScenario === scenario.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedScenario(scenario.id)}
                        className="justify-start"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {scenario.name}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Difficulty
                </h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedDifficulty === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(null)}
                    className="w-full justify-start"
                  >
                    All Levels
                  </Button>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <Button
                      key={level.level}
                      variant={selectedDifficulty === level.level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(level.level)}
                      className="w-full justify-start"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Level {level.level} - {level.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stories Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-muted rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-12"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStories.length === 0 ? (
            <Card className="p-12 text-center">
              <PartyPopper className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Stories Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or create a custom story with AI!
              </p>
              <Button onClick={() => setShowAiGenerator(true)}>
                <Wand2 className="w-4 h-4 mr-2" />
                Create Custom Story
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story, index) => {
                const completed = isStoryCompleted(story);
                const locked = isStoryLocked(story);
                
                return (
                  <SafeMotionDiv
                    key={story._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`h-full transition-all duration-300 hover:shadow-xl cursor-pointer group relative overflow-hidden ${
                        completed ? 'ring-2 ring-green-500/30 bg-green-50/50 dark:bg-green-900/10' : ''
                      } ${locked ? 'opacity-60' : ''}`}
                      onClick={() => !locked && handleOpenStory(story._id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <CardHeader className="pb-3 relative z-10">
                        <div className="flex items-start justify-between">
                          <span className="text-4xl">{story.emoji}</span>
                          <div className="flex flex-col gap-2">
                            {completed && <CheckCircle className="w-6 h-6 text-green-500" />}
                            {locked && <Lock className="w-5 h-5 text-muted-foreground" />}
                            {story.aiGenerated && <Sparkles className="w-5 h-5 text-purple-500" />}
                          </div>
                        </div>
                        
                        <CardTitle className={`line-clamp-2 group-hover:text-primary transition-colors ${
                          locked ? 'text-muted-foreground' : ''
                        }`}>
                          {story.title}
                        </CardTitle>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {story.description}
                        </p>
                      </CardHeader>
                      
                      <CardContent className="pt-0 relative z-10">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="outline" 
                              className={getDifficultyColor(story.difficulty)}
                            >
                              Level {story.difficulty}
                            </Badge>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {story.estimatedTime}m
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Brain className="w-3 h-3" />
                              {story.metadata.wordsIntroduced} words
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">                            <div className="flex gap-1">
                              {story.tags?.slice(0, 2).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            {!locked && (
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayEnhanced(story);
                                  }}
                                  className="hover:bg-primary/10"
                                >
                                  <Rocket className="w-4 h-4 mr-1" />
                                  Enhanced
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenStory(story._id);
                                  }}
                                  className="bg-gradient-to-r from-primary to-purple-600"
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  {completed ? 'Replay' : 'Start'}
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          {locked && (
                            <div className="text-xs text-muted-foreground">
                              Complete prerequisites to unlock
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </SafeMotionDiv>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Story Generator Modal */}
      <Dialog open={showAiGenerator} onOpenChange={setShowAiGenerator}>
        <DialogContent className="max-w-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Wand2 className="w-6 h-6 text-purple-500" />
                Create Custom Story
              </h2>
              <p className="text-muted-foreground">
                Generate a personalized language learning story with AI
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Language
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((language) => (
                    <Button
                      key={language.code}
                      variant={aiLanguage === language.code ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAiLanguage(language.code)}
                      className="justify-start"
                    >
                      <span className="mr-2">{language.flag}</span>
                      {language.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Scenario
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {SCENARIOS.filter(s => s.id !== 'all').map((scenario) => {
                    const IconComponent = scenario.icon;
                    return (
                      <Button
                        key={scenario.id}
                        variant={aiScenario === scenario.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAiScenario(scenario.id)}
                        className="justify-start"
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        {scenario.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAiGenerator(false)}>
                Cancel
              </Button>
              <Button 
                onClick={generateNewStory} 
                disabled={generatingStory}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {generatingStory ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Story
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>      {/* Story Modal */}
      {selectedStory && isStoryModalOpen && (
        <StoryModal
          story={selectedStory}
          isOpen={isStoryModalOpen}
          onClose={() => {
            setIsStoryModalOpen(false);
            setSelectedStory(null);
          }}
          onComplete={handleStoryComplete}
          onPlayEnhanced={() => {
            setIsStoryModalOpen(false);
            setShowEnhancedPlayer(true);
          }}
        />
      )}{/* Enhanced Story Player */}
      {selectedStory && showEnhancedPlayer && (
        <FullScreenStoryPlayer
          story={selectedStory}
          onComplete={handleEnhancedComplete}
          onVocabularyLearn={() => {}}
          onExit={() => setShowEnhancedPlayer(false)}
        />
      )}
    </div>
  );
}
