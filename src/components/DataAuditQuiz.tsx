import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsView } from "./ResultsView";
import { EmailCapture } from "./EmailCapture";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

const getQuestions = (userType: 'small-business' | 'nonprofit'): Question[] => {
  const audienceTerm = userType === 'nonprofit' ? 'donors' : 'customers';
  const conversionTerm = userType === 'nonprofit' ? 'donations' : 'sales';
  const goalTerm = userType === 'nonprofit' ? 'support your mission' : 'purchase';
  
  return [
    {
      id: 1,
      category: "Behavioral Signals",
      question: `How often do you analyze where ${audienceTerm} get frustrated on your website?`,
      description: `Understanding where ${audienceTerm} struggle reveals critical barriers to ${conversionTerm}.`,
      options: [
        { text: "Regularly track and analyze patterns", value: 2 },
        { text: "Occasionally review basic metrics", value: 1 },
        { text: "Not currently tracking", value: 0 }
      ]
    },
    {
      id: 2,
      category: "Content & Voice",
      question: `How consistent is your messaging across all ${audienceTerm} touchpoints?`,
      description: `Inconsistent messaging creates confusion and reduces ${audienceTerm}' trust in your organization.`,
      options: [
        { text: "Very consistent with clear guidelines", value: 2 },
        { text: "Mostly consistent with some gaps", value: 1 },
        { text: "Inconsistent or unclear messaging", value: 0 }
      ]
    },
    {
      id: 3,
      category: "Conversion Pathways",
      question: userType === 'nonprofit' 
        ? "How clear are your donation buttons and giving process?"
        : "How clear and optimized are your calls-to-action?",
      description: userType === 'nonprofit'
        ? "Unclear donation processes can reduce giving by 50%+ - even small improvements make major impact."
        : "Weak CTAs are conversion killers - even small changes can double results.",
      options: [
        { text: "Highly optimized and tested", value: 2 },
        { text: "Clear but not extensively tested", value: 1 },
        { text: "Unclear or poorly positioned", value: 0 }
      ]
    },
    {
      id: 4,
      category: "User Experience",
      question: `How well does your website perform on mobile for ${audienceTerm}?`,
      description: `Poor mobile experience can cost you 60%+ of potential ${conversionTerm}.`,
      options: [
        { text: "Fully optimized and fast", value: 2 },
        { text: "Good but could be improved", value: 1 },
        { text: "Poor mobile performance", value: 0 }
      ]
    },
    {
      id: 5,
      category: "Trust & Credibility",
      question: userType === 'nonprofit'
        ? "How prominently do you display impact stories and donor testimonials?"
        : "How prominent is your social proof and customer reviews?",
      description: userType === 'nonprofit'
        ? "Impact stories and testimonials can increase donations by 15-30% when properly showcased."
        : "Trust signals can increase conversions by 15-30% when properly displayed.",
      options: [
        { text: "Strong, visible social proof", value: 2 },
        { text: "Some testimonials or stories", value: 1 },
        { text: "Limited or no social proof", value: 0 }
      ]
    },
    {
      id: 6,
      category: "Measurement",
      question: `How well can you track ${audienceTerm} journeys from first visit to ${goalTerm}?`,
      description: `Without proper tracking, you can't see what actually motivates ${audienceTerm} to ${goalTerm}.`,
      options: [
        { text: "Comprehensive tracking setup", value: 2 },
        { text: "Basic analytics in place", value: 1 },
        { text: "Limited or no tracking", value: 0 }
      ]
    },
    {
      id: 7,
      category: "Behavioral Signals",
      question: `Do you know which pages cause ${audienceTerm} to leave without acting?`,
      description: `Identifying where ${audienceTerm} drop off is crucial for fixing ${conversionTerm} leaks.`,
      options: [
        { text: "Clear understanding of drop-offs", value: 2 },
        { text: "Some awareness but not detailed", value: 1 },
        { text: "No clear visibility", value: 0 }
      ]
    },
    {
      id: 8,
      category: "Content & Voice",
      question: `How well does your content address what ${audienceTerm} actually care about?`,
      description: userType === 'nonprofit'
        ? "Mission-focused content that connects emotionally converts 3x better than generic copy."
        : "Customer-centered content converts 3x better than feature-focused copy.",
      options: [
        { text: `Highly ${audienceTerm}-focused content`, value: 2 },
        { text: `Mix of ${audienceTerm} and organizational focus`, value: 1 },
        { text: "Mostly organization-focused content", value: 0 }
      ]
    },
    {
      id: 9,
      category: "Conversion Pathways",
      question: userType === 'nonprofit'
        ? "How streamlined is your donation process?"
        : "How streamlined is your purchase process?",
      description: `Every extra step or friction point reduces ${conversionTerm} by 10-20%.`,
      options: [
        { text: "Highly streamlined process", value: 2 },
        { text: "Reasonably smooth with some steps", value: 1 },
        { text: "Complex or confusing process", value: 0 }
      ]
    }
  ];
};

export const DataAuditQuiz = () => {
  const [userType, setUserType] = useState<'small-business' | 'nonprofit' | null>(null);
  const [showFilter, setShowFilter] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get questions based on user type
  const questions = userType ? getQuestions(userType) : [];

  const handleUserTypeSelection = (type: 'small-business' | 'nonprofit') => {
    setUserType(type);
    setIsTransitioning(true);
    setTimeout(() => {
      setShowFilter(false);
      setIsTransitioning(false);
    }, 300);
  };

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
        setShowEmailCapture(true);
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

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setShowEmailCapture(false);
    setShowResults(true);
  };

  const handleRestart = () => {
    setUserType(null);
    setShowFilter(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowEmailCapture(false);
    setShowResults(false);
    setUserEmail("");
    setIsTransitioning(false);
  };

  if (showResults) {
    return <ResultsView answers={answers} questions={questions} onRestart={handleRestart} userType={userType} userEmail={userEmail} />;
  }

  if (showEmailCapture) {
    const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
    const maxTotalScore = questions.length * 2;
    const overallPercentage = (totalScore / maxTotalScore) * 100;
    
    return <EmailCapture overallScore={overallPercentage} onEmailSubmit={handleEmailSubmit} userType={userType} />;
  }

  // Filter Screen
  if (showFilter) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
        {/* Organic Background Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 organic-blob animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 organic-blob-alt animate-pulse" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 organic-blob opacity-50" 
             style={{ animationDelay: '4s' }} />
        
        <div className="w-full max-w-2xl relative z-10">
          <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-primary mr-3" />
                  <span className="text-primary font-medium text-lg tracking-wider">COMMIT ME CO DESIGN</span>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-3 leading-tight">
                  YOUR DATA HAS A BRAIN
                </h1>
                <p className="text-muted-foreground text-lg">
                  We decode human behavior. Let's see what your data is telling you.
                </p>
              </div>

              {/* Filter Question */}
              <div className={`transition-smooth ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-2xl font-semibold text-foreground">
                      First, let's understand your organization
                    </h2>
                    <p className="text-muted-foreground">
                      This helps us tailor our behavioral insights to your specific audience and goals.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card 
                      className="p-6 cursor-pointer transition-smooth border-2 border-border hover:border-primary/50 hover:shadow-glow hover:bg-card/60 backdrop-blur-sm"
                      onClick={() => handleUserTypeSelection('small-business')}
                    >
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Small Business Owner</h3>
                        <p className="text-muted-foreground">
                          You run or manage a small business focused on customer acquisition and growth
                        </p>
                      </div>
                    </Card>

                    <Card 
                      className="p-6 cursor-pointer transition-smooth border-2 border-border hover:border-primary/50 hover:shadow-glow hover:bg-card/60 backdrop-blur-sm"
                      onClick={() => handleUserTypeSelection('nonprofit')}
                    >
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">Nonprofit Leader</h3>
                        <p className="text-muted-foreground">
                          You're an Executive Director or lead a nonprofit focused on donor engagement and impact
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Organic Background Elements */}
      <div className="absolute top-10 right-10 w-80 h-80 organic-blob animate-pulse opacity-30" />
      <div className="absolute bottom-10 left-10 w-64 h-64 organic-blob-alt animate-pulse opacity-20" 
           style={{ animationDelay: '3s' }} />
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 rounded-full bg-primary mr-3" />
                <span className="text-primary font-medium text-lg tracking-wider">CMCD DATA AUDIT</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                YOUR DATA HAS A BRAIN
              </h1>
              <p className="text-muted-foreground">
                We decode human behavior. Let's see what your data is telling you.
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