import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsView } from "./ResultsView";
import { Card } from "@/components/ui/card";

export interface Question {
  id: number;
  category: string;
  question: string;
  description: string;
  options: {
    text: string;
    value: number;
  }[];
}

export interface Answer {
  questionId: number;
  value: number;
}

const questions: Question[] = [
  {
    id: 1,
    category: "Behavioral Signals",
    question: "How often do you analyze user behavior patterns like rage clicks or bounce rates?",
    description: "Understanding where users get frustrated reveals critical conversion barriers.",
    options: [
      { text: "Regularly track and analyze patterns", value: 2 },
      { text: "Occasionally review basic metrics", value: 1 },
      { text: "Not currently tracking", value: 0 }
    ]
  },
  {
    id: 2,
    category: "Content & Voice",
    question: "How consistent is your messaging across all customer touchpoints?",
    description: "Inconsistent voice creates confusion and reduces trust in your brand.",
    options: [
      { text: "Very consistent with clear guidelines", value: 2 },
      { text: "Mostly consistent with some gaps", value: 1 },
      { text: "Inconsistent or unclear messaging", value: 0 }
    ]
  },
  {
    id: 3,
    category: "Conversion Pathways",
    question: "How clear and optimized are your calls-to-action?",
    description: "Weak CTAs are conversion killers - even small changes can double results.",
    options: [
      { text: "Highly optimized and tested", value: 2 },
      { text: "Clear but not extensively tested", value: 1 },
      { text: "Unclear or poorly positioned", value: 0 }
    ]
  },
  {
    id: 4,
    category: "User Experience",
    question: "How well does your site perform on mobile devices?",
    description: "Poor mobile experience can cost you 60%+ of potential conversions.",
    options: [
      { text: "Fully optimized and fast", value: 2 },
      { text: "Good but could be improved", value: 1 },
      { text: "Poor mobile performance", value: 0 }
    ]
  },
  {
    id: 5,
    category: "Trust & Credibility",
    question: "How prominent is your social proof and credibility indicators?",
    description: "Trust signals can increase conversions by 15-30% when properly displayed.",
    options: [
      { text: "Strong, visible social proof", value: 2 },
      { text: "Some testimonials or reviews", value: 1 },
      { text: "Limited or no social proof", value: 0 }
    ]
  },
  {
    id: 6,
    category: "Measurement",
    question: "How well can you track user journeys from first touch to conversion?",
    description: "Without proper tracking, you're flying blind on what actually drives results.",
    options: [
      { text: "Comprehensive tracking setup", value: 2 },
      { text: "Basic analytics in place", value: 1 },
      { text: "Limited or no tracking", value: 0 }
    ]
  },
  {
    id: 7,
    category: "Behavioral Signals",
    question: "Do you know which pages cause users to abandon their journey?",
    description: "Identifying drop-off points is crucial for fixing conversion leaks.",
    options: [
      { text: "Clear understanding of drop-offs", value: 2 },
      { text: "Some awareness but not detailed", value: 1 },
      { text: "No clear visibility", value: 0 }
    ]
  },
  {
    id: 8,
    category: "Content & Voice",
    question: "How well does your content address actual user concerns and questions?",
    description: "User-centered content converts 3x better than feature-focused copy.",
    options: [
      { text: "Highly user-focused content", value: 2 },
      { text: "Mix of user and feature focus", value: 1 },
      { text: "Mostly feature-focused content", value: 0 }
    ]
  },
  {
    id: 9,
    category: "Conversion Pathways",
    question: "How streamlined is your conversion funnel?",
    description: "Every extra step or friction point reduces conversions by 10-20%.",
    options: [
      { text: "Highly streamlined process", value: 2 },
      { text: "Reasonably smooth with some steps", value: 1 },
      { text: "Complex or confusing process", value: 0 }
    ]
  }
];

export const DataAuditQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswer: Answer = {
      questionId: questions[currentQuestion].id,
      value
    };

    const updatedAnswers = answers.filter(a => a.questionId !== newAnswer.questionId);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    if (currentQuestion < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setIsTransitioning(false);
  };

  if (showResults) {
    return <ResultsView answers={answers} questions={questions} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-card border-0">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">
                CMCD Data Audit
              </h1>
              <p className="text-muted-foreground">
                Your data already knows the way. Decode it here.
              </p>
            </div>

            {/* Progress */}
            <ProgressBar 
              current={currentQuestion + 1} 
              total={questions.length} 
              className="mb-8"
            />

            {/* Question */}
            <div className={`transition-smooth ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <QuestionCard
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
                onPrevious={currentQuestion > 0 ? handlePrevious : undefined}
                selectedValue={answers.find(a => a.questionId === questions[currentQuestion].id)?.value}
              />
            </div>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};