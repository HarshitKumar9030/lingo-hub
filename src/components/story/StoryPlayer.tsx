'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Volume2, BookOpen, Trophy } from 'lucide-react';
import { IStory, IScene, IChoice, ISceneVocabulary } from '@/lib/models/Story';

interface StoryPlayerProps {
  story: IStory;
  onComplete: (score: number) => void;
  onVocabularyLearn: (vocabulary: ISceneVocabulary[]) => void;
}

export function StoryPlayer({ story, onComplete, onVocabularyLearn }: StoryPlayerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [visitedScenes, setVisitedScenes] = useState<Set<string>>(new Set());
  const [learnedVocabulary, setLearnedVocabulary] = useState<Set<string>>(new Set());
  const [showTranslation, setShowTranslation] = useState(false);

  const currentScene = story.scenes[currentSceneIndex];
  const progress = ((currentSceneIndex + 1) / story.scenes.length) * 100;

  useEffect(() => {
    if (currentScene) {
      setVisitedScenes(prev => new Set([...prev, currentScene.id]));
    }
  }, [currentScene]);

  const handleChoiceClick = (choice: IChoice) => {
    // Find next scene
    const nextSceneIndex = story.scenes.findIndex(scene => scene.id === choice.nextSceneId);
    
    if (nextSceneIndex !== -1) {
      setCurrentSceneIndex(nextSceneIndex);
    } else {
      // Story completed, move to quiz
      onComplete(calculateScore());
    }
  };

  const handleVocabularyClick = (vocab: ISceneVocabulary) => {
    if (!learnedVocabulary.has(vocab.word)) {
      setLearnedVocabulary(prev => new Set([...prev, vocab.word]));
      onVocabularyLearn([vocab]);
    }
  };

  const calculateScore = () => {
    return visitedScenes.size * 10 + learnedVocabulary.size * 5;
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const renderTextWithVocabulary = (text: string, vocabulary: ISceneVocabulary[]) => {
    let renderedText = text;
    
    vocabulary.forEach((vocab) => {
      const regex = new RegExp(`\\b${vocab.word}\\b`, 'gi');
      renderedText = renderedText.replace(regex, `<span class="vocabulary-word" data-word="${vocab.word}">${vocab.word}</span>`);
    });

    return { __html: renderedText };
  };

  if (!currentScene) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Story Complete!</h2>
          <p className="text-muted-foreground">Ready for the quiz?</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{story.emoji}</span>
          <div>
            <h1 className="text-xl font-semibold">{story.title}</h1>
            <p className="text-sm text-muted-foreground">{story.scenario}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            <BookOpen className="w-3 h-3 mr-1" />
            {learnedVocabulary.size} words
          </Badge>
          <Badge variant="outline">
            <Trophy className="w-3 h-3 mr-1" />
            {calculateScore()} pts
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Scene {currentSceneIndex + 1} of {story.scenes.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Scene Content */}
      <Card>
        <CardHeader className="pb-4">
          {currentScene.emoji && (
            <span className="text-3xl mb-2 block">{currentScene.emoji}</span>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* German Text */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speakText(currentScene.content)}
                className="h-8"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className="h-8 text-xs"
              >
                {showTranslation ? 'Hide' : 'Show'} Translation
              </Button>
            </div>
            
            <div 
              className="text-lg leading-relaxed"
              dangerouslySetInnerHTML={renderTextWithVocabulary(currentScene.content, currentScene.vocabulary)}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('vocabulary-word')) {
                  const word = target.dataset.word;
                  const vocab = currentScene.vocabulary.find(v => v.word === word);
                  if (vocab) {
                    handleVocabularyClick(vocab);
                  }
                }
              }}
            />

            {showTranslation && (
              <p className="text-muted-foreground italic border-l-2 border-muted pl-4">
                {currentScene.translation}
              </p>
            )}
          </div>

          {/* Vocabulary */}
          {currentScene.vocabulary.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                New Vocabulary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentScene.vocabulary.map((vocab, index) => (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <Button
                        variant={learnedVocabulary.has(vocab.word) ? "default" : "outline"}
                        className="justify-start h-auto p-3 text-left"
                        onClick={() => handleVocabularyClick(vocab)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{vocab.word}</span>
                            <span className="text-xs text-muted-foreground">
                              /{vocab.ipa}/
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vocab.translation}
                          </p>
                        </div>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{vocab.word}</h4>
                          <Badge variant="secondary">{vocab.partOfSpeech}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(vocab.word)}
                          >
                            <Volume2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-sm">
                          <strong>IPA:</strong> /{vocab.ipa}/
                        </p>
                        <p className="text-sm">
                          <strong>Definition:</strong> {vocab.definition}
                        </p>
                        <p className="text-sm">
                          <strong>Difficulty:</strong> {vocab.difficulty}/5
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </div>
          )}

          {/* Choices */}
          {currentScene.choices.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                👉 What do you say?
              </h3>
              <div className="space-y-2">
                {currentScene.choices.map((choice, index) => (
                  <Button
                    key={choice.id}
                    variant="outline"
                    className="w-full justify-start h-auto p-4 text-left hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleChoiceClick(choice)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          {index + 1}
                        </span>
                        <span>{choice.text}</span>
                      </div>
                      {choice.feedback && (
                        <p className="text-xs text-muted-foreground">
                          {choice.feedback}
                        </p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
