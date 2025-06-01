import mongoose, { Schema, Document, Model } from 'mongoose';

// Choice interface for story scenes
export interface IChoice {
  id: string;
  text: string;
  nextSceneId: string | null;
  isCorrect?: boolean;
  feedback?: string;
}

// Vocabulary word in scene
export interface ISceneVocabulary {
  word: string;
  translation: string;
  ipa: string;
  definition: string;
  difficulty: number; // 1-5
  partOfSpeech: string;
}

// Scene interface
export interface IScene {
  id: string;
  content: string; // German text for now
  translation: string; // English translation
  emoji?: string;
  choices: IChoice[];
  vocabulary: ISceneVocabulary[];
  audioUrl?: string;
  order: number;
}

// Quiz question interface
export interface IQuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'typing' | 'pronunciation';
  question: string;
  options?: string[];
  correctAnswer: string;
  targetWord: string;
  explanation?: string;
  points: number;
}

// Story interface
export interface IStory extends Document {
  _id: string;
  title: string;
  description: string;
  scenario: string; // "airport", "cafe", "supermarket", etc.
  difficulty: number; // 1-5
  emoji: string;
  estimatedTime: number; // minutes
  scenes: IScene[];
  quiz: IQuizQuestion[];
  tags: string[];
  prerequisites: string[]; // story IDs that should be completed first
  aiGenerated: boolean;
  cached: boolean;
  language: {
    from: string; // native language
    to: string;   // target language
  };
  metadata: {
    wordsIntroduced: number;
    grammarConcepts: string[];
    culturalContext?: string;
  };
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Story schema
const StorySchema = new Schema<IStory>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  scenario: { type: String, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  emoji: { type: String, required: true },
  estimatedTime: { type: Number, required: true },
  scenes: [{
    id: { type: String, required: true },
    content: { type: String, required: true },
    translation: { type: String, required: true },
    emoji: { type: String },
    choices: [{
      id: { type: String, required: true },
      text: { type: String, required: true },
      nextSceneId: { type: String },
      isCorrect: { type: Boolean },
      feedback: { type: String }
    }],
    vocabulary: [{
      word: { type: String, required: true },
      translation: { type: String, required: true },
      ipa: { type: String, required: true },
      definition: { type: String, required: true },
      difficulty: { type: Number, required: true, min: 1, max: 5 },
      partOfSpeech: { type: String, required: true }
    }],
    audioUrl: { type: String },
    order: { type: Number, required: true }
  }],
  quiz: [{
    id: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['multiple-choice', 'fill-blank', 'typing', 'pronunciation'] 
    },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    targetWord: { type: String, required: true },
    explanation: { type: String },
    points: { type: Number, default: 10 }
  }],
  tags: [{ type: String }],
  prerequisites: [{ type: String }],
  aiGenerated: { type: Boolean, default: true },
  cached: { type: Boolean, default: false },
  language: {
    from: { type: String, required: true, default: 'en' },
    to: { type: String, required: true, default: 'de' }
  },
  metadata: {
    wordsIntroduced: { type: Number, default: 0 },
    grammarConcepts: [{ type: String }],
    culturalContext: { type: String }
  },
  isPublished: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes for better performance
StorySchema.index({ scenario: 1, difficulty: 1 });
StorySchema.index({ 'language.from': 1, 'language.to': 1 });
StorySchema.index({ isPublished: 1, difficulty: 1 });

const Story: Model<IStory> = mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);

export default Story;
