import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Story from '@/lib/models/Story';
import { calculateLevel, checkAchievements } from '@/lib/level-system';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      storyId,
      xpEarned,
      wordsLearned,
      scenesCompleted,
      accuracy,
      timeSpent,
      mistakes
    } = await request.json();

    if (!storyId || typeof xpEarned !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get user and story
    const [user, story] = await Promise.all([
      User.findOne({ email: session.user.email }),
      Story.findById(storyId)
    ]);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    // Check if story was already completed
    const alreadyCompleted = user.progress.storiesCompleted.includes(storyId);

    // Update user progress
    const updatedProgress = { ...user.progress };

    // Add story to completed if not already there
    if (!alreadyCompleted) {
      updatedProgress.storiesCompleted.push(storyId);
    }

    // Add scenes to completed
    if (scenesCompleted && Array.isArray(scenesCompleted)) {
      const newScenes = scenesCompleted.filter(
        sceneId => !updatedProgress.scenesCompleted.includes(sceneId)
      );
      updatedProgress.scenesCompleted.push(...newScenes);
    }

    // Update XP and level
    const oldTotalXP = updatedProgress.totalXP || 0;
    const newTotalXP = oldTotalXP + xpEarned;
    updatedProgress.totalXP = newTotalXP;

    // Calculate new level
    const levelInfo = calculateLevel(newTotalXP);
    const leveledUp = levelInfo.level > updatedProgress.currentLevel;
    updatedProgress.currentLevel = levelInfo.level;

    // Update words learned
    if (wordsLearned && Array.isArray(wordsLearned)) {
      const newWordCount = wordsLearned.length;
      updatedProgress.wordsLearned += newWordCount;

      // Add new vocabulary to user's vocabulary list
      const newVocabulary = wordsLearned.map(word => ({
        word: word,
        translation: '', // TODO: Get from story vocabulary
        ipa: '',
        definition: '',
        masteryLevel: 0,
        lastReviewed: new Date(),
        timesEncountered: 1,
        needsReview: false
      }));

      user.vocabulary.push(...newVocabulary);
    }

    // Update daily and weekly progress
    updatedProgress.dailyProgress += xpEarned;
    updatedProgress.weeklyStats.xpEarned += xpEarned;
    if (!alreadyCompleted) {
      updatedProgress.weeklyStats.storiesCompleted += 1;
    }
    if (wordsLearned) {
      updatedProgress.weeklyStats.wordsLearned += wordsLearned.length;
    }

    // Update streak
    const today = new Date();
    const lastLogin = new Date(updatedProgress.lastLoginDate);
    const daysDiff = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      updatedProgress.streakDays += 1;
    } else if (daysDiff > 1) {
      // Streak broken - reset to 1
      updatedProgress.streakDays = 1;
    }
    // If daysDiff === 0, it's the same day, don't change streak

    updatedProgress.lastLoginDate = today;

    // Check for new achievements
    const currentAchievements = updatedProgress.achievements || [];
    const userStats = {
      storiesCompleted: updatedProgress.storiesCompleted.length,
      wordsLearned: updatedProgress.wordsLearned,
      streakDays: updatedProgress.streakDays,
      totalXP: updatedProgress.totalXP
    };
    
    const newAchievements = checkAchievements(userStats, currentAchievements);
    if (newAchievements.length > 0) {
      updatedProgress.achievements.push(...newAchievements.map(a => a.id));
      // Add achievement XP
      const achievementXP = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);
      updatedProgress.totalXP += achievementXP;
      
      // Recalculate level with achievement XP
      const finalLevelInfo = calculateLevel(updatedProgress.totalXP);
      updatedProgress.currentLevel = finalLevelInfo.level;
    }

    // Save user updates
    user.progress = updatedProgress;
    await user.save();

    // Prepare response
    const response = {
      success: true,
      xpEarned: xpEarned + (newAchievements.reduce((sum, a) => sum + a.xpReward, 0)),
      newLevel: updatedProgress.currentLevel,
      leveledUp,
      newAchievements: newAchievements.map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        emoji: a.emoji,
        xpReward: a.xpReward
      })),
      levelInfo: calculateLevel(updatedProgress.totalXP),
      streakDays: updatedProgress.streakDays,
      totalStoriesCompleted: updatedProgress.storiesCompleted.length,
      totalWordsLearned: updatedProgress.wordsLearned,
      dailyProgress: updatedProgress.dailyProgress,
      dailyGoal: updatedProgress.dailyGoal
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Story completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete story' },
      { status: 500 }
    );
  }
}
