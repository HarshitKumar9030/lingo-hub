import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Story from "@/lib/models/Story";
import User from "@/lib/models/User";
import { aiContentService } from "@/lib/services/ai-content";
import { nanoid } from "nanoid";

// Language mappings for AI generation
const LANGUAGE_CODES: { [key: string]: string } = {
  en: "English",
  de: "German",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese",
  ar: "Arabic",
  hi: "Hindi",
  nl: "Dutch",
};

// Scenario descriptions for better AI generation
const SCENARIO_DESCRIPTIONS: { [key: string]: string } = {
  airport: "Navigating through an airport, checking in, security, and boarding",
  cafe: "Ordering coffee and food at a local café, casual conversation",
  supermarket: "Shopping for groceries, asking for help, paying at checkout",
  hotel: "Checking into a hotel, asking about amenities, room service",
  restaurant: "Making reservations, ordering food, asking about menu items",
  shopping: "Buying clothes, asking about sizes, prices, and recommendations",
  park: "Walking in a park, talking about nature, meeting people",
  office: "Professional conversations, meetings, workplace interactions",
  bank: "Opening an account, asking about services, financial transactions",
  pharmacy: "Buying medicine, asking about prescriptions, health advice",
  transportation:
    "Using public transport, asking for directions, buying tickets",
  doctor: "Medical appointments, describing symptoms, health discussions",
};

// AI story generation function using Gemini-2.0-Flash
async function generateStoryWithAI(prompt: {
  language: { from: string; to: string };
  difficulty: number;
  scenario: string;
  userLevel: number;
}): Promise<any> {
  try {
    const fromLanguage = LANGUAGE_CODES[prompt.language.from] || "English";
    const toLanguage = LANGUAGE_CODES[prompt.language.to] || "German";
    const scenarioDescription =
      SCENARIO_DESCRIPTIONS[prompt.scenario] || prompt.scenario;

    // Generate appropriate vocabulary and grammar concepts based on difficulty
    const wordsToIntroduce = Math.min(15, 5 + prompt.difficulty * 2);
    const grammarConcepts = getGrammarConceptsForLevel(
      prompt.difficulty,
      prompt.language.to
    );
    const storyData = await aiContentService.generateStory({
      scenario: `${scenarioDescription} (Target: ${toLanguage}, Native: ${fromLanguage})`,
      difficulty: prompt.difficulty,
      targetLanguage: prompt.language.to,
      nativeLanguage: prompt.language.from,
      wordsToIntroduce: [], // Let AI choose appropriate words
      grammarConcepts,
      culturalContext: `Authentic ${toLanguage} cultural context appropriate for ${scenarioDescription}`,
    });

    // Transform the AI response to match our Story model
    return {
      title: storyData.title,
      description: storyData.description,
      scenario: prompt.scenario,
      difficulty: prompt.difficulty,
      emoji: storyData.emoji,
      estimatedTime: storyData.estimatedTime,
      scenes: storyData.scenes.map((scene, index) => ({
        ...scene,
        id: nanoid(),
        order: index + 1,
        choices: scene.choices.map((choice) => ({
          ...choice,
          id: nanoid(),
        })),
      })),
      quiz: storyData.quiz.map((question) => ({
        ...question,
        id: nanoid(),
      })),
      tags: ["ai-generated", prompt.scenario, `level-${prompt.difficulty}`],
      prerequisites: [],
      aiGenerated: true,
      cached: false,
      language: prompt.language,
      metadata: {
        wordsIntroduced: storyData.metadata.wordsIntroduced,
        grammarConcepts: storyData.metadata.grammarConcepts,
        culturalContext: storyData.metadata.culturalContext,
      },
      isPublished: true,
    };
  } catch (error) {
    console.error("AI story generation failed:", error);

    // Fallback to a basic story structure if AI fails
    return createFallbackStory(prompt);
  }
}

// Grammar concepts based on difficulty level
function getGrammarConceptsForLevel(
  difficulty: number,
  language: string
): string[] {
  const concepts: { [key: number]: string[] } = {
    1: ["present tense", "basic nouns", "articles", "simple sentences"],
    2: ["past tense", "adjectives", "possessives", "question formation"],
    3: ["future tense", "modal verbs", "prepositions", "compound sentences"],
    4: ["perfect tenses", "conditional", "relative clauses", "passive voice"],
    5: ["subjunctive", "complex sentences", "idioms", "advanced grammar"],
  };

  return concepts[difficulty] || concepts[1];
}

// Fallback story if AI generation fails
function createFallbackStory(prompt: any) {
  const emojis = {
    airport: "✈️",
    cafe: "☕",
    supermarket: "🛒",
    hotel: "🏨",
    restaurant: "🍽️",
    shopping: "🛍️",
    park: "🌳",
    office: "💼",
  };

  return {
    title: `${
      prompt.scenario.charAt(0).toUpperCase() + prompt.scenario.slice(1)
    } Adventure`,
    description: `A ${prompt.difficulty}-level interactive story about visiting a ${prompt.scenario}`,
    scenario: prompt.scenario,
    difficulty: prompt.difficulty,
    emoji: emojis[prompt.scenario as keyof typeof emojis] || "📚",
    estimatedTime: 5 + prompt.difficulty * 2,
    scenes: [
      {
        id: nanoid(),
        content:
          "This is a basic story scene. Please check your Gemini API configuration.",
        translation:
          "Dies ist eine grundlegende Story-Szene. Bitte überprüfen Sie Ihre Gemini-API-Konfiguration.",
        emoji: "🎬",
        order: 1,
        choices: [
          {
            id: nanoid(),
            text: "Continue",
            nextSceneId: null,
            isCorrect: true,
            feedback: "Story completed!",
          },
        ],
        vocabulary: [
          {
            word: "story",
            translation: "Geschichte",
            ipa: "/ˈstɔːri/",
            definition: "A narrative account of events",
            difficulty: prompt.difficulty,
            partOfSpeech: "noun",
          },
        ],
      },
    ],
    quiz: [
      {
        id: nanoid(),
        type: "multiple-choice" as const,
        question: "What does 'story' mean in German?",
        options: ["Geschichte", "Buch", "Film", "Spiel"],
        correctAnswer: "Geschichte",
        targetWord: "story",
        explanation: "Story translates to Geschichte in German",
        points: 10,
      },
    ],
    tags: ["fallback", prompt.scenario],
    prerequisites: [],
    aiGenerated: false,
    cached: false,
    language: prompt.language,
    metadata: {
      wordsIntroduced: 1,
      grammarConcepts: ["basic vocabulary"],
      culturalContext: "General language learning",
    },
    isPublished: true,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const difficulty = searchParams.get("difficulty");
    const scenario = searchParams.get("scenario");
    const page = parseInt(searchParams.get("page") || "1");
    const forceAI = searchParams.get("forceAI") === "true";
    const skip = (page - 1) * limit;

    await connectDB();

    // Get user to determine language preferences and level
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build query for cached stories
    const query: any = {
      isPublished: true,
      cached: true,
      "language.from": user.nativeLanguage || "en",
      "language.to": user.targetLanguage || "de",
    };

    if (difficulty) {
      query.difficulty = parseInt(difficulty);
    }

    if (scenario) {
      query.scenario = scenario;
    } // Try to get cached stories first
    const stories = await Story.find(query)
      .select(
        "title description scenario difficulty emoji estimatedTime tags isPublished createdAt language metadata"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Story.countDocuments(query);
    const storyResults = [...stories];

    // If we don't have enough cached stories or forceAI is true, generate with AI
    if (storyResults.length < limit || forceAI) {
      const storiesNeeded = Math.max(1, limit - storyResults.length);
      const scenarios = [
        "airport",
        "cafe",
        "supermarket",
        "hotel",
        "restaurant",
        "shopping",
        "park",
        "office",
      ];

      console.log(`Generating ${storiesNeeded} stories with AI...`);

      for (let i = 0; i < storiesNeeded; i++) {
        const selectedScenario =
          scenario || scenarios[Math.floor(Math.random() * scenarios.length)];
        const selectedDifficulty = difficulty
          ? parseInt(difficulty)
          : Math.min(5, Math.max(1, user.progress.currentLevel));

        try {
          const aiStoryData = await generateStoryWithAI({
            language: {
              from: user.nativeLanguage || "en",
              to: user.targetLanguage || "de",
            },
            difficulty: selectedDifficulty,
            scenario: selectedScenario,
            userLevel: user.progress.currentLevel,
          });

          // Cache the AI-generated story in database
          const newStory = new Story({
            ...aiStoryData,
            cached: true,
          });

          await newStory.save();

          storyResults.push(newStory.toObject());
        } catch (error) {
          console.error("Failed to generate AI story:", error);
        }
      }
    }

    const updatedTotal = total + Math.max(0, limit - storyResults.length);

    return NextResponse.json({
      stories: storyResults.slice(0, limit),
      pagination: {
        page,
        limit,
        total: updatedTotal,
        pages: Math.ceil(updatedTotal / limit),
      },
      userLanguages: {
        from: user.nativeLanguage,
        to: user.targetLanguage,
      },
      userLevel: user.progress.currentLevel,
    });
  } catch (error) {
    console.error("Stories fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storyId } = await request.json();
    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 });
    }

    await connectDB();

    const story = await Story.findById(storyId).lean();
    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error("Story fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch story" },
      { status: 500 }
    );
  }
}
