// Level system and XP calculations for LingoHub
export const LEVEL_CONFIG = {
  // Base XP required for level 1, scales exponentially
  BASE_XP: 100,
  // XP multiplier for each level
  MULTIPLIER: 1.5,
  // Maximum level (for display purposes)
  MAX_LEVEL: 50
};

export const XP_REWARDS = {
  // Story completion
  STORY_SCENE: 10,
  STORY_COMPLETE: 50,
  PERFECT_STORY: 25, // Bonus for completing story without mistakes
  
  // Quiz performance
  QUIZ_CORRECT: 5,
  QUIZ_PERFECT: 20, // Bonus for 100% quiz score
  
  // Vocabulary
  NEW_WORD: 3,
  WORD_MASTERY: 15, // When a word reaches mastery level 5
  
  // Streaks
  DAILY_LOGIN: 10,
  WEEKLY_STREAK: 50,
  MONTHLY_STREAK: 200,
  
  // Achievements
  FIRST_STORY: 30,
  TENTH_STORY: 100,
  HUNDREDTH_WORD: 75,
  PERFECT_WEEK: 150
};

export interface LevelInfo {
  level: number;
  currentXP: number;
  xpForThisLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  title: string;
  description: string;
}

export function calculateLevel(totalXP: number): LevelInfo {
  let level = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = LEVEL_CONFIG.BASE_XP;
  
  // Find the current level
  while (totalXP >= xpForNextLevel && level < LEVEL_CONFIG.MAX_LEVEL) {
    level++;
    xpForCurrentLevel = xpForNextLevel;
    xpForNextLevel = Math.floor(LEVEL_CONFIG.BASE_XP * Math.pow(LEVEL_CONFIG.MULTIPLIER, level - 1));
  }
  
  const currentLevelXP = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = level === LEVEL_CONFIG.MAX_LEVEL ? 100 : 
    Math.floor((currentLevelXP / xpNeededForNext) * 100);
  
  return {
    level,
    currentXP: currentLevelXP,
    xpForThisLevel: xpForCurrentLevel,
    xpForNextLevel: level === LEVEL_CONFIG.MAX_LEVEL ? xpForNextLevel : xpForNextLevel,
    progressPercent,
    title: getLevelTitle(level),
    description: getLevelDescription(level)
  };
}

export function getLevelTitle(level: number): string {
  if (level >= 40) return "Polyglot Master";
  if (level >= 35) return "Language Virtuoso";
  if (level >= 30) return "Fluency Expert";
  if (level >= 25) return "Advanced Speaker";
  if (level >= 20) return "Conversation Pro";
  if (level >= 15) return "Language Explorer";
  if (level >= 10) return "Word Collector";
  if (level >= 5) return "Rising Linguist";
  return "Language Beginner";
}

export function getLevelDescription(level: number): string {
  if (level >= 40) return "You've mastered the art of language learning!";
  if (level >= 35) return "You're approaching native-level fluency!";
  if (level >= 30) return "You can handle complex conversations with ease!";
  if (level >= 25) return "You're comfortable in most language situations!";
  if (level >= 20) return "You can engage in meaningful conversations!";
  if (level >= 15) return "You're exploring advanced language concepts!";
  if (level >= 10) return "You're building a solid vocabulary foundation!";
  if (level >= 5) return "You're making great progress in your language journey!";
  return "Welcome to your language learning adventure!";
}

export function calculateXPReward(
  action: keyof typeof XP_REWARDS,
  multipliers: { streak?: number; accuracy?: number; difficulty?: number } = {}
): number {
  let baseXP = XP_REWARDS[action];
  
  // Apply multipliers
  if (multipliers.streak) {
    baseXP = Math.floor(baseXP * (1 + (multipliers.streak - 1) * 0.1)); // +10% per streak day
  }
  
  if (multipliers.accuracy) {
    baseXP = Math.floor(baseXP * multipliers.accuracy); // Accuracy percentage as multiplier
  }
  
  if (multipliers.difficulty) {
    baseXP = Math.floor(baseXP * (0.5 + (multipliers.difficulty * 0.3))); // Difficulty scaling
  }
  
  return Math.max(1, baseXP); // Minimum 1 XP
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  condition: (userStats: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_story',
    title: 'First Steps',
    description: 'Complete your first story',
    emoji: '🎯',
    xpReward: XP_REWARDS.FIRST_STORY,
    condition: (stats) => stats.storiesCompleted >= 1
  },
  {
    id: 'story_master',
    title: 'Story Master',
    description: 'Complete 10 stories',
    emoji: '📚',
    xpReward: XP_REWARDS.TENTH_STORY,
    condition: (stats) => stats.storiesCompleted >= 10
  },
  {
    id: 'word_collector',
    title: 'Word Collector',
    description: 'Learn 100 new words',
    emoji: '📖',
    xpReward: XP_REWARDS.HUNDREDTH_WORD,
    condition: (stats) => stats.wordsLearned >= 100
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    emoji: '🔥',
    xpReward: XP_REWARDS.WEEKLY_STREAK,
    condition: (stats) => stats.streakDays >= 7
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Maintain a 30-day learning streak',
    emoji: '👑',
    xpReward: XP_REWARDS.MONTHLY_STREAK,
    condition: (stats) => stats.streakDays >= 30
  }
];

export function checkAchievements(userStats: any, earnedAchievements: string[] = []): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => 
    !earnedAchievements.includes(achievement.id) && 
    achievement.condition(userStats)
  );
}
