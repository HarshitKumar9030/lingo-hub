import { GoogleGenerativeAI } from '@google/generative-ai';
import { IStory, IScene, IQuizQuestion } from '@/lib/models/Story';
import { nanoid } from 'nanoid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GenerateStoryParams {
  scenario: string;
  difficulty: number;
  targetLanguage: string; // Language code (e.g., 'de', 'es', 'fr')
  nativeLanguage: string; // Language code (e.g., 'en')
  wordsToIntroduce?: string[];
  grammarConcepts?: string[];
  culturalContext?: string;
}

export interface GeneratedStoryData {
  title: string;
  description: string;
  emoji: string;
  estimatedTime: number;
  scenes: Omit<IScene, 'id'>[];
  quiz: Omit<IQuizQuestion, 'id'>[];
  metadata: {
    wordsIntroduced: number;
    grammarConcepts: string[];
    culturalContext?: string;
  };
}

class AIContentService {
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  async generateStory(params: GenerateStoryParams): Promise<GeneratedStoryData> {
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      throw new Error('AI service not configured. Please set GEMINI_API_KEY environment variable.');
    }

    const prompt = this.buildStoryPrompt(params);
    
    console.log('Generating story with Gemini AI:', {
      scenario: params.scenario,
      difficulty: params.difficulty,
      targetLanguage: params.targetLanguage,
      nativeLanguage: params.nativeLanguage
    });
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      console.log('Gemini AI response received, parsing JSON...');
      
      // Clean the response text to ensure it's valid JSON
      const cleanedText = text.trim().replace(/```json\n?/, '').replace(/\n?```/, '');
      
      let storyData;
      try {
        storyData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        console.log('Raw response:', text);
        throw new Error('AI returned invalid JSON format');
      }
      
      // Validate required fields
      if (!storyData.title || !storyData.scenes || !Array.isArray(storyData.scenes)) {
        console.error('AI response missing required fields:', storyData);
        throw new Error('AI response missing required story structure');
      }
      
      // Add IDs to scenes and quiz questions
      storyData.scenes = storyData.scenes.map((scene: any, index: number) => ({
        ...scene,
        id: nanoid(),
        order: index,
        choices: scene.choices?.map((choice: any) => ({
          ...choice,
          id: nanoid()
        })) || []
      }));
      
      storyData.quiz = (storyData.quiz || []).map((question: any) => ({
        ...question,
        id: nanoid()
      }));
      
      console.log('Story generated successfully:', {
        title: storyData.title,
        scenesCount: storyData.scenes.length,
        quizCount: storyData.quiz.length
      });
      
      return storyData;
    } catch (error) {
      console.error('Error generating story with Gemini AI:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.');
        }
        if (error.message.includes('quota')) {
          throw new Error('Gemini API quota exceeded. Please check your usage or billing.');
        }
        if (error.message.includes('blocked')) {
          throw new Error('Content was blocked by safety filters. Try a different scenario.');
        }
      }
      
      throw new Error('Failed to generate story content: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async translateText(text: string, from: string = 'de', to: string = 'en'): Promise<string> {
    const prompt = `Translate the following text from ${from} to ${to}. Only return the translation, no additional text:

"${text}"`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Error translating text:', error);
      throw new Error('Failed to translate text');
    }
  }

  async getWordAnalysis(word: string, language: string = 'de'): Promise<{
    ipa: string;
    definition: string;
    partOfSpeech: string;
    difficulty: number;
    exampleSentence: string;
  }> {
    const prompt = `Analyze the ${language} word "${word}" and provide a JSON response with:
- ipa: IPA pronunciation
- definition: definition in English
- partOfSpeech: grammatical category
- difficulty: difficulty level 1-5 (1=beginner, 5=advanced)
- exampleSentence: simple example sentence in ${language}

Return only valid JSON.`;

    try {
      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error analyzing word:', error);
      throw new Error('Failed to analyze word');
    }
  }
  private buildStoryPrompt(params: GenerateStoryParams): string {
    const languageNames: { [key: string]: string } = {
      'en': 'English', 'de': 'German', 'es': 'Spanish', 'fr': 'French',
      'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
      'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi', 'nl': 'Dutch'
    };
    
    const targetLang = languageNames[params.targetLanguage] || 'German';
    const nativeLang = languageNames[params.nativeLanguage] || 'English';
    
    return `Create a ${targetLang} language learning story with the following specifications:

SCENARIO: ${params.scenario}
TARGET LANGUAGE: ${targetLang}
NATIVE LANGUAGE: ${nativeLang}
DIFFICULTY: ${params.difficulty}/5 (1=beginner, 5=advanced)
${params.wordsToIntroduce ? `FOCUS WORDS: ${params.wordsToIntroduce.join(', ')}` : ''}
${params.grammarConcepts ? `GRAMMAR: ${params.grammarConcepts.join(', ')}` : ''}
${params.culturalContext ? `CULTURAL CONTEXT: ${params.culturalContext}` : ''}

Generate a JSON response with this exact structure:

{
  "title": "Story title in ${nativeLang}",
  "description": "Brief description of what learners will experience in ${nativeLang}",
  "emoji": "Single relevant emoji",
  "estimatedTime": number_of_minutes,
  "scenes": [
    {
      "content": "${targetLang} dialogue/narrative text",
      "translation": "${nativeLang} translation",
      "emoji": "Scene emoji (optional)",
      "choices": [
        {
          "text": "${targetLang} response option",
          "nextSceneId": null,
          "isCorrect": true/false,
          "feedback": "Brief explanation in ${nativeLang}"
        }
      ],
      "vocabulary": [
        {
          "word": "${targetLang} word",
          "translation": "${nativeLang} translation",
          "ipa": "IPA pronunciation",
          "definition": "Clear definition in ${nativeLang}",
          "difficulty": 1-5,
          "partOfSpeech": "noun/verb/adjective/etc"
        }
      ]
    }
  ],
  "quiz": [
    {
      "type": "multiple-choice" | "fill-blank" | "typing",
      "question": "Question text in ${nativeLang}",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option",
      "targetWord": "word being tested",
      "explanation": "Why this is correct in ${nativeLang}",
      "points": 10
    }
  ],
  "metadata": {
    "wordsIntroduced": number,
    "grammarConcepts": ["concept1", "concept2"],
    "culturalContext": "description"
  }
}

REQUIREMENTS:
- Create 4-6 scenes that tell a coherent story
- Each scene should introduce 2-3 new vocabulary words in ${targetLang}
- Choices should feel natural and affect the story flow
- ${targetLang} text should be appropriate for the difficulty level
- Include cultural context and real-world situations specific to ${targetLang}-speaking countries
- Make it engaging like a choose-your-own-adventure
- Quiz should test the vocabulary from the scenes
- All explanations and descriptions should be in ${nativeLang}
- ${targetLang} content should use authentic, natural language
- Return ONLY valid JSON, no additional text`;
  }
}

export const aiContentService = new AIContentService();
