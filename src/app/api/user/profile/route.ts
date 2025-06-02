import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    await client.connect();
    const users = client.db().collection('users');
    
    // Find user by email since that's more reliable than ID matching
    const user = await users.findOne(
      { email: session.user.email },
      {
        projection: {
          password: 0,
          hashedPassword: 0
        }
      }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }    // Transform the user data to match our interface
    const profileData = {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || null,
      nativeLanguage: user.nativeLanguage || null,
      targetLanguage: user.targetLanguage || null,
      progress: {
        wordsLearned: user.progress?.wordsLearned || 0,
        storiesCompleted: user.progress?.storiesCompleted || [],
        currentLevel: user.progress?.currentLevel || 1,
        streakDays: user.progress?.streakDays || 0,
        totalQuizScore: user.progress?.totalQuizScore || 0,
        scenesCompleted: user.progress?.scenesCompleted || [],
        lastLoginDate: user.progress?.lastLoginDate || user.createdAt
      },
      vocabulary: user.vocabulary || [],
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    };

    console.log('User found in DB:', user.name, user.email);
    console.log('Sending profile data:', profileData);

    return NextResponse.json(profileData);

  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, nativeLanguage, targetLanguage } = body;

    // Validate input
    if (name && (typeof name !== 'string' || name.trim().length < 1)) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }    await client.connect();
    const users = client.db().collection('users');

    const updateData: any = {
      updatedAt: new Date()
    };    if (name) updateData.name = name.trim();
    if (nativeLanguage) updateData.nativeLanguage = nativeLanguage;
    if (targetLanguage) {
      updateData.targetLanguage = targetLanguage;
      // Reset progress when switching languages
      updateData.progress = {
        wordsLearned: 0,
        storiesCompleted: [],
        currentLevel: 1,
        streakDays: 0,
        totalQuizScore: 0,
        scenesCompleted: [],
        lastLoginDate: new Date().toISOString()
      };
      updateData.vocabulary = [];
    }// Use email for update since it's more reliable
    const result = await users.updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch updated user data
    const updatedUser = await users.findOne(
      { email: session.user.email },
      {
        projection: {
          password: 0,
          hashedPassword: 0
        }
      }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }    const profileData = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar || null,
      nativeLanguage: updatedUser.nativeLanguage || null,
      targetLanguage: updatedUser.targetLanguage || null,
      progress: {
        wordsLearned: updatedUser.progress?.wordsLearned || 0,
        storiesCompleted: updatedUser.progress?.storiesCompleted || [],
        currentLevel: updatedUser.progress?.currentLevel || 1,
        streakDays: updatedUser.progress?.streakDays || 0,
        totalQuizScore: updatedUser.progress?.totalQuizScore || 0,
        scenesCompleted: updatedUser.progress?.scenesCompleted || [],
        lastLoginDate: updatedUser.progress?.lastLoginDate || updatedUser.createdAt
      },
      vocabulary: updatedUser.vocabulary || [],
      createdAt: updatedUser.createdAt || new Date().toISOString(),
      updatedAt: updatedUser.updatedAt || new Date().toISOString()
    };

    return NextResponse.json(profileData);

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
