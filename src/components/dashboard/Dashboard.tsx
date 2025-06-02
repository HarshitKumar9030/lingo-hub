"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Flame, 
  Users, 
  Globe,
  Calendar,
  TrendingUp,
  Clock,
  Star,
  Award,
  Zap,
  Book,
  Play,
  ChevronRight,
  Brain,
  Volume2,
  BarChart3,
  ChevronDown,
  Check
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserProfile {
  name: string;
  email: string;
  avatar?: { url: string };
  nativeLanguage: string;
  targetLanguage: string;
  progress: {
    wordsLearned: number;
    storiesCompleted: string[];
    currentLevel: number;
    streakDays: number;
    totalQuizScore: number;
    scenesCompleted: string[];
    lastLoginDate: string;
  };
  vocabulary: Array<{
    word: string;
    translation: string;
    masteryLevel: number;
    needsReview: boolean;
  }>;
  createdAt: string;
}

interface Story {
  _id: string;
  title: string;
  description: string;
  difficulty: number;
  emoji: string;
  estimatedTime: number;
  scenario: string;
  isPublished: boolean;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Available languages for learning
  const availableLanguages = [
    { code: 'de', name: 'German', emoji: '🇩🇪', flag: 'DE' },
    { code: 'es', name: 'Spanish', emoji: '🇪🇸', flag: 'ES' },
    { code: 'fr', name: 'French', emoji: '🇫🇷', flag: 'FR' },
    { code: 'it', name: 'Italian', emoji: '🇮🇹', flag: 'IT' },
    { code: 'pt', name: 'Portuguese', emoji: '🇵🇹', flag: 'PT' },
    { code: 'ru', name: 'Russian', emoji: '🇷🇺', flag: 'RU' },
    { code: 'ja', name: 'Japanese', emoji: '🇯🇵', flag: 'JP' },
    { code: 'ko', name: 'Korean', emoji: '🇰🇷', flag: 'KR' },
    { code: 'zh', name: 'Chinese', emoji: '🇨🇳', flag: 'CN' },
    { code: 'ar', name: 'Arabic', emoji: '🇸🇦', flag: 'SA' },
    { code: 'hi', name: 'Hindi', emoji: '🇮🇳', flag: 'IN' },
    { code: 'nl', name: 'Dutch', emoji: '🇳🇱', flag: 'NL' },
  ];
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user profile
        const profileResponse = await fetch('/api/user/profile');
        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          setUserProfile(profile);
          setSelectedLanguage(profile.targetLanguage || 'de');
        }

        // Fetch recommended stories
        const storiesResponse = await fetch('/api/stories?limit=6');
        if (storiesResponse.ok) {
          const storiesData = await storiesResponse.json();
          setStories(storiesData.stories || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  // Close language selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLanguageSelector && !target.closest('.language-selector')) {
        setShowLanguageSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageSelector]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin" />
          <span className="text-[#888]">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">Unable to load dashboard</h2>
          <p className="text-[#888] mb-4">Please try refreshing the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 3: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 4: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 5: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Beginner';
      case 2: return 'Elementary';
      case 3: return 'Intermediate';
      case 4: return 'Advanced';
      case 5: return 'Expert';
      default: return 'Unknown';
    }
  };
  const getStreakIcon = (days: number) => {
    if (days >= 30) return <Award className="w-5 h-5 text-purple-600" />;
    if (days >= 14) return <Trophy className="w-5 h-5 text-yellow-600" />;
    if (days >= 7) return <Flame className="w-5 h-5 text-orange-600" />;
    return <Zap className="w-5 h-5 text-blue-600" />;
  };

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === selectedLanguage) return;
    
    setIsChangingLanguage(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage: languageCode,
        }),
      });

      if (response.ok) {
        setSelectedLanguage(languageCode);
        setUserProfile(prev => prev ? {
          ...prev,
          targetLanguage: languageCode,
          // Reset progress for new language
          progress: {
            ...prev.progress,
            wordsLearned: 0,
            storiesCompleted: [],
            currentLevel: 1,
            totalQuizScore: 0,
            scenesCompleted: []
          },
          vocabulary: []
        } : null);
        
        // Refresh dashboard data for new language
        window.location.reload();
      }
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsChangingLanguage(false);
      setShowLanguageSelector(false);
    }
  };

  const getCurrentLanguage = () => {
    return availableLanguages.find(lang => lang.code === selectedLanguage) || 
           availableLanguages.find(lang => lang.code === 'de');
  };

  const vocabularyNeedingReview = userProfile.vocabulary.filter(v => v.needsReview).length;
  const totalXP = userProfile.progress.totalQuizScore;
  const levelProgress = ((totalXP % 1000) / 1000) * 100; // Each level requires 1000 XP
  return (
    <div className="min-h-screen mt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {userProfile.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Continue your {userProfile.targetLanguage.toUpperCase()} learning journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getStreakIcon(userProfile.progress.streakDays)}
              <div className="text-right">
                <div className="text-xl font-bold text-foreground">
                  {userProfile.progress.streakDays}
                </div>
                <div className="text-sm text-muted-foreground">day streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-8">
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Learning Language</h3>
                  <p className="text-sm text-muted-foreground">Switch between languages to track progress separately</p>
                </div>
                <div className="relative language-selector">
                  <Button
                    variant="outline"
                    className="flex items-center gap-3 min-w-[200px] justify-between border-border hover:bg-muted"
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    disabled={isChangingLanguage}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getCurrentLanguage()?.emoji}</span>
                      <span className="font-medium text-foreground">
                        {getCurrentLanguage()?.name}
                      </span>
                    </div>
                    {isChangingLanguage ? (
                      <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>

                  {showLanguageSelector && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                      {availableLanguages.map((language) => (
                        <button
                          key={language.code}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => handleLanguageChange(language.code)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{language.emoji}</span>
                            <span className="font-medium text-foreground">
                              {language.name}
                            </span>
                          </div>
                          {selectedLanguage === language.code && (
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userProfile.progress.currentLevel}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress to Level {userProfile.progress.currentLevel + 1}</span>
                  <span className="text-muted-foreground">{Math.round(levelProgress)}%</span>
                </div>
                <Progress value={levelProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Words Learned</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userProfile.progress.wordsLearned}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              {vocabularyNeedingReview > 0 && (
                <div className="mt-4">
                  <Badge variant="outline" className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                    {vocabularyNeedingReview} need review
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stories Completed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {userProfile.progress.storiesCompleted.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                  <p className="text-2xl font-bold text-foreground">
                    {totalXP.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Jump back into your learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button 
                    asChild 
                    className="h-20 flex-col gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <Link href="/stories">
                      <Play className="w-6 h-6" />
                      <span>Continue Story</span>
                    </Link>
                  </Button>
                  
                  {vocabularyNeedingReview > 0 && (
                    <Button 
                      asChild 
                      variant="outline" 
                      className="h-20 flex-col gap-2 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Link href="/vocabulary/review">
                        <Volume2 className="w-6 h-6" />
                        <span>Review Words</span>
                      </Link>
                    </Button>
                  )}
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    className="h-20 flex-col gap-2 border-border hover:bg-muted"
                  >
                    <Link href="/profile">
                      <BarChart3 className="w-6 h-6" />
                      <span>View Stats</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Stories */}
            <Card className="border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Recommended Stories</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Perfect for your current level
                  </CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/stories" className="flex items-center gap-1">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {stories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stories.slice(0, 4).map((story) => (
                      <div
                        key={story._id}
                        className="p-4 border border-border rounded-lg hover:shadow-md dark:hover:shadow-lg transition-shadow cursor-pointer group"
                      >
                        <Link href={`/stories/${story._id}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{story.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                {story.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {story.description}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <Badge 
                                  variant="outline" 
                                  className={getDifficultyColor(story.difficulty)}
                                >
                                  {getDifficultyLabel(story.difficulty)}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {story.estimatedTime}m
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No stories available at the moment</p>
                    <Button asChild variant="outline">
                      <Link href="/stories">Browse All Stories</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Streak */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Learning Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {userProfile.progress.streakDays}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {userProfile.progress.streakDays === 1 ? 'day' : 'days'} in a row
                  </p>
                  {userProfile.progress.streakDays > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Keep it up! 🔥
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground">Progress Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scenes Completed</span>
                  <span className="font-semibold text-foreground">
                    {userProfile.progress.scenesCompleted.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vocabulary Size</span>
                  <span className="font-semibold text-foreground">
                    {userProfile.vocabulary.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Age</span>
                  <span className="font-semibold text-foreground">
                    {Math.ceil((Date.now() - new Date(userProfile.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Language Info */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Native</span>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                      {userProfile.nativeLanguage.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Learning</span>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                      {userProfile.targetLanguage.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}