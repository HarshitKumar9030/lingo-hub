import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiContentService } from '@/lib/services/ai-content';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { targetLanguage = 'de', nativeLanguage = 'en', scenario = 'cafe' } = await request.json();

    // Test the AI service with a simple story generation
    console.log('Testing Gemini AI integration...');
    
    const testStory = await aiContentService.generateStory({
      scenario: `A simple visit to a ${scenario}`,
      difficulty: 2,
      targetLanguage,
      nativeLanguage,
      grammarConcepts: ['present tense', 'basic nouns'],
      culturalContext: 'Casual everyday interaction'
    });

    return NextResponse.json({
      success: true,
      message: 'Gemini AI integration working correctly!',
      testData: {
        title: testStory.title,
        description: testStory.description,
        scenesCount: testStory.scenes?.length || 0,
        quizCount: testStory.quiz?.length || 0,
        estimatedTime: testStory.estimatedTime,
        wordsIntroduced: testStory.metadata?.wordsIntroduced || 0
      }
    });

  } catch (error) {
    console.error('Gemini AI test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: {
        apiKeySet: !!process.env.GEMINI_API_KEY,
        apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        suggestions: [
          'Check if GEMINI_API_KEY is set in .env.local',
          'Verify your Gemini API key is valid',
          'Ensure you have billing enabled in Google Cloud',
          'Check if the Generative AI API is enabled'
        ]
      }
    }, { status: 500 });
  }
}
