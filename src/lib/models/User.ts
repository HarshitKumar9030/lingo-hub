import mongoose, { Schema, Document, Model } from 'mongoose';

// Vocabulary item interface
export interface IVocabularyItem {
  word: string;
  translation: string;
  ipa: string;
  definition: string;
  exampleSentence: string;
  masteryLevel: number; // 0-5 scale
  lastReviewed: Date;
  timesEncountered: number;
  needsReview: boolean;
}

// User progress interface
export interface IUserProgress {
  scenesCompleted: string[];
  storiesCompleted: string[];
  wordsLearned: number;
  totalQuizScore: number;
  currentLevel: number;
  streakDays: number;
  lastLoginDate: Date;
}

// User interface
export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  hashedPassword: string;
  nativeLanguage: string;
  targetLanguage: string;
  progress: IUserProgress;
  vocabulary: IVocabularyItem[];
  preferences: {
    showTranslations: boolean;
    showIPA: boolean;
    autoPlay: boolean;
    difficultyLevel: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  nativeLanguage: { type: String, default: 'en' },
  targetLanguage: { type: String, default: 'de' },
  progress: {
    scenesCompleted: [{ type: String }],
    storiesCompleted: [{ type: String }],
    wordsLearned: { type: Number, default: 0 },
    totalQuizScore: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
    streakDays: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: Date.now }
  },
  vocabulary: [{
    word: { type: String, required: true },
    translation: { type: String, required: true },
    ipa: { type: String, required: true },
    definition: { type: String, required: true },
    exampleSentence: { type: String, required: true },
    masteryLevel: { type: Number, default: 0, min: 0, max: 5 },
    lastReviewed: { type: Date, default: Date.now },
    timesEncountered: { type: Number, default: 1 },
    needsReview: { type: Boolean, default: false }
  }],
  preferences: {
    showTranslations: { type: Boolean, default: true },
    showIPA: { type: Boolean, default: true },
    autoPlay: { type: Boolean, default: false },
    difficultyLevel: { type: Number, default: 1, min: 1, max: 5 }
  }
}, {
  timestamps: true
});

// Prevent re-compilation during development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
