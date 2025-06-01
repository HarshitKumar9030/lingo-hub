import { GoogleGenerativeAI } from '@google/generative-ai';
import { IStory, IScene, IQuizQuestion } from '@/lib/models/Story';
import { nanoid } from 'nanoid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GenerateStoryParams {
  scenario: string;
  difficulty: number;
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
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateStory(params: GenerateStoryParams): Promise<GeneratedStoryData> {
    const prompt = this.buildStoryPrompt(params);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Parse the JSON response
      const storyData = JSON.parse(text);
      
      // Add IDs to scenes and quiz questions
      storyData.scenes = storyData.scenes.map((scene: any, index: number) => ({
        ...scene,
        id: nanoid(),
        order: index,
        choices: scene.choices.map((choice: any) => ({
          ...choice,
          id: nanoid()
        }))
      }));
      
      storyData.quiz = storyData.quiz.map((question: any) => ({
        ...question,
        id: nanoid()
      }));
      
      return storyData;
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story content');
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
    return `Create a German language learning story with the following specifications:

SCENARIO: ${params.scenario}
DIFFICULTY: ${params.difficulty}/5 (1=beginner, 5=advanced)
${params.wordsToIntroduce ? `FOCUS WORDS: ${params.wordsToIntroduce.join(', ')}` : ''}
${params.grammarConcepts ? `GRAMMAR: ${params.grammarConcepts.join(', ')}` : ''}
${params.culturalContext ? `CULTURAL CONTEXT: ${params.culturalContext}` : ''}

Generate a JSON response with this exact structure:

{
  "title": "Story title in English",
  "description": "Brief description of what learners will experience",
  "emoji": "Single relevant emoji",
  "estimatedTime": number_of_minutes,
  "scenes": [
    {
      "content": "German dialogue/narrative text",
      "translation": "English translation",
      "emoji": "Scene emoji (optional)",
      "choices": [
        {
          "text": "German response option",
          "nextSceneId": null,
          "isCorrect": true/false,
          "feedback": "Brief explanation"
        }
      ],
      "vocabulary": [
        {
          "word": "German word",
          "translation": "English translation",
          "ipa": "IPA pronunciation",
          "definition": "Clear definition",
          "difficulty": 1-5,
          "partOfSpeech": "noun/verb/adjective/etc"
        }
      ]
    }
  ],
  "quiz": [
    {
      "type": "multiple-choice" | "fill-blank" | "typing",
      "question": "Question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": "correct option",
      "targetWord": "word being tested",
      "explanation": "Why this is correct",
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
- Each scene should introduce 2-3 new vocabulary words
- Choices should feel natural and affect the story flow
- German text should be appropriate for the difficulty level
- Include cultural context and real-world situations
- Make it engaging like a choose-your-own-adventure
- Quiz should test the vocabulary from the scenes
- Return ONLY valid JSON, no additional text`;
  }
}

export const aiContentService = new AIContentService();
