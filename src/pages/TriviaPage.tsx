import { useState, useEffect } from 'react';
import { getRandomQuestions, TriviaQuestion } from '@/data/triviaQuestions';
import Leaderboard from '@/components/Leaderboard';
import { cn } from '@/lib/utils';

interface TriviaState {
  currentIndex: number;
  answers: { [key: string]: string };
  submitted: { [key: string]: boolean };
  score: number;
  questions: TriviaQuestion[];
}

const SCORE_PER_CORRECT = 1;

const initialPlayers = [
  { id: "p2", name: "Sebastian", score: 4 },
  { id: "p3", name: "Fernando", score: 3 },
  { id: "p4", name: "Lewis", score: 2 },
  { id: "p5", name: "Max", score: 1 }
];

export default function TriviaPage() {
  const [triviaState, setTriviaState] = useState<TriviaState>({
    currentIndex: 0,
    answers: {},
    submitted: {},
    score: 0,
    questions: getRandomQuestions(5)
  });

  const [players] = useState(initialPlayers);
  const [alonsosExplanation, setAlonsosExplanation] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = triviaState.questions[triviaState.currentIndex];
  const isAnswered = triviaState.answers[currentQuestion.id];
  const isSubmitted = triviaState.submitted[currentQuestion.id];
  const progress = ((triviaState.currentIndex + (isSubmitted ? 1 : 0)) / triviaState.questions.length) * 100;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const selectOption = (qid: string, oid: string) => {
    if (triviaState.submitted[qid]) return;
    
    setTriviaState(prev => ({
      ...prev,
      answers: { ...prev.answers, [qid]: oid }
    }));
  };

  const submitAnswer = () => {
    const q = currentQuestion;
    if (triviaState.submitted[q.id]) return;
    
    const chosen = triviaState.answers[q.id];
    const isCorrect = chosen === q.correct;
    
    setTriviaState(prev => ({
      ...prev,
      submitted: { ...prev.submitted, [q.id]: true },
      score: isCorrect ? prev.score + SCORE_PER_CORRECT : prev.score
    }));

    // Generate Alonso's response
    let explanation = '';
    if (isCorrect) {
      explanation = `¡Muy bien! That's correct! ${q.explanation || 'Great racing knowledge!'}`;
    } else {
      explanation = `Ah, not quite right, my friend. ${q.explanation || 'Keep learning - that is how we improve!'}`;
    }
    
    setAlonsosExplanation(explanation);
    setShowExplanation(true);
    speakText(explanation);
  };

  const nextQuestion = () => {
    if (triviaState.currentIndex < triviaState.questions.length - 1) {
      setTriviaState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1
      }));
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (triviaState.currentIndex > 0) {
      setTriviaState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
      setShowExplanation(false);
    }
  };

  const restart = () => {
    setTriviaState({
      currentIndex: 0,
      answers: {},
      submitted: {},
      score: 0,
      questions: getRandomQuestions(5)
    });
    setShowExplanation(false);
  };

  const leaderboardEntries = [
    { id: "you", name: "You", score: triviaState.score, isUser: true },
    ...players
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="racing-title text-4xl">Green-Light Trivia</h1>
          <p className="mt-1 text-sm text-muted-foreground">Test your racing knowledge</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground" id="question-progress">
            Q{triviaState.currentIndex + 1} / {triviaState.questions.length}
          </div>
          <div className="mt-2 inline-flex items-center gap-3 racing-card px-3 py-2">
            <div className="text-xs text-foreground">Score:</div>
            <div className="text-sm font-semibold text-primary">
              {triviaState.score} AMF1
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-3 mb-6 border border-border">
        <div 
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Card */}
        <div className="lg:col-span-2">
          <div className="racing-card p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-block bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-medium">
                  {currentQuestion.category}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Question {triviaState.currentIndex + 1}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {isSubmitted ? (
                  triviaState.answers[currentQuestion.id] === currentQuestion.correct ? (
                    <span className="text-primary font-semibold">✓ Correct</span>
                  ) : (
                    <span className="text-racing-red font-semibold">✕ Incorrect</span>
                  )
                ) : ''}
              </div>
            </div>

            {/* Question */}
            <h2 className="text-2xl font-bold leading-snug mb-6">
              {currentQuestion.title}
            </h2>

            {/* Options */}
            <div className="space-y-4 mb-6">
              {Object.entries(currentQuestion.options).map(([oid, text]) => {
                const selected = triviaState.answers[currentQuestion.id] === oid;
                const isCorrect = isSubmitted && oid === currentQuestion.correct;
                const isWrong = isSubmitted && selected && oid !== currentQuestion.correct;

                return (
                  <label
                    key={oid}
                    className={cn(
                      "flex items-center gap-4 cursor-pointer p-4 rounded-lg border transition-all duration-200",
                      "hover:border-primary/50",
                      selected ? "border-primary bg-primary/10" : "border-border",
                      isCorrect && "ring-2 ring-primary bg-primary/20",
                      isWrong && "ring-2 ring-racing-red bg-racing-red/10",
                      isSubmitted && "cursor-default"
                    )}
                    onClick={() => selectOption(currentQuestion.id, oid)}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold",
                      selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                    )}>
                      {oid.toUpperCase()}
                    </div>
                    <div className="flex-1 text-sm font-medium">{text}</div>
                    {isCorrect && <div className="text-primary font-bold">✓</div>}
                    {isWrong && <div className="text-racing-red font-bold">✕</div>}
                  </label>
                );
              })}
            </div>

            {/* Alonso's Explanation */}
            {showExplanation && alonsosExplanation && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                    FA
                  </div>
                  <span className="text-sm font-semibold text-primary">Ai.lonso explains:</span>
                </div>
                <p className="text-sm">{alonsosExplanation}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={restart}
                className="racing-button-secondary px-4 py-2"
              >
                Restart
              </button>
              
              <button
                onClick={submitAnswer}
                disabled={!isAnswered || isSubmitted}
                className={cn(
                  "racing-button-primary px-5 py-2",
                  (!isAnswered || isSubmitted) && "opacity-50 cursor-not-allowed"
                )}
              >
                Submit
              </button>

              {isSubmitted && triviaState.currentIndex < triviaState.questions.length - 1 && (
                <button
                  onClick={nextQuestion}
                  className="racing-button-accent px-4 py-2"
                >
                  Next Question →
                </button>
              )}

              <div className="ml-auto flex items-center gap-2 text-sm">
                <button
                  onClick={prevQuestion}
                  disabled={triviaState.currentIndex === 0}
                  className="racing-button-secondary px-3 py-2 disabled:opacity-50"
                >
                  ← Prev
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={triviaState.currentIndex === triviaState.questions.length - 1}
                  className="racing-button-secondary px-3 py-2 disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Each correct answer awards {SCORE_PER_CORRECT} AMF1 point(s).
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <Leaderboard entries={leaderboardEntries} />
          
          <div className="racing-card p-4">
            <h4 className="racing-subtitle mb-3">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Answered:</span>
                <span className="font-semibold">
                  {Object.keys(triviaState.submitted).length} / {triviaState.questions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AMF1 Score:</span>
                <span className="font-semibold text-primary">{triviaState.score}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}