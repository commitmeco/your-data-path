import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { ResultsView } from "./ResultsView";
import { EmailCapture } from "./EmailCapture";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CMCDBrandMark } from "./CMCDLogo";
import { Brain, Sparkles } from "lucide-react";

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
      category: "Website Analytics",
      question: `How often do you analyze user behavior patterns on your website?`,
      description: `This includes tracking where users engage, navigate, or experience difficulties.`,
      options: [
        { text: "Weekly or more frequently", value: 2 },
        { text: "Monthly or occasionally", value: 1 },
        { text: "Rarely or never", value: 0 }
      ]
    },
    {
      id: 2,
      category: "Brand Messaging",
      question: `How would you rate the consistency of your messaging across all platforms?`,
      description: `Consider your website, social media, email, and print materials.`,
      options: [
        { text: "Very consistent", value: 2 },
        { text: "Mostly consistent", value: 1 },
        { text: "Inconsistent", value: 0 }
      ]
    },
    {
      id: 3,
      category: "Call-to-Action",
      question: userType === 'nonprofit' 
        ? "How would you describe your donation process and buttons?"
        : "How would you describe your call-to-action buttons and processes?",
      description: userType === 'nonprofit'
        ? "Consider the clarity and ease of your giving options."
        : "Consider the clarity and effectiveness of your action prompts.",
      options: [
        { text: "Very clear and easy", value: 2 },
        { text: "Somewhat clear", value: 1 },
        { text: "Unclear or confusing", value: 0 }
      ]
    },
    {
      id: 4,
      category: "Mobile Experience",
      question: `How does your website perform on mobile devices?`,
      description: `Consider loading speed, navigation, and overall user experience.`,
      options: [
        { text: "Excellent performance", value: 2 },
        { text: "Good performance", value: 1 },
        { text: "Poor performance", value: 0 }
      ]
    },
    {
      id: 5,
      category: "Social Proof",
      question: userType === 'nonprofit'
        ? "How prominently do you feature impact stories and testimonials?"
        : "How prominently do you feature customer reviews and testimonials?",
      description: userType === 'nonprofit'
        ? "Consider the visibility and placement of donor stories and impact examples."
        : "Consider the visibility and placement of customer feedback and reviews.",
      options: [
        { text: "Very prominent", value: 2 },
        { text: "Somewhat visible", value: 1 },
        { text: "Not prominent", value: 0 }
      ]
    },
    {
      id: 6,
      category: "User Journey Tracking",
      question: `How well do you track user paths from first visit to ${goalTerm}?`,
      description: `Consider your ability to follow and analyze the complete user journey.`,
      options: [
        { text: "Comprehensive tracking", value: 2 },
        { text: "Basic tracking", value: 1 },
        { text: "Limited tracking", value: 0 }
      ]
    },
    {
      id: 7,
      category: "Exit Analysis", 
      question: `How well do you understand where users leave your website?`,
      description: `Consider your knowledge of exit points and drop-off patterns.`,
      options: [
        { text: "Very clear understanding", value: 2 },
        { text: "Some understanding", value: 1 },
        { text: "Limited understanding", value: 0 }
      ]
    },
    {
      id: 8,
      category: "Content Focus",
      question: `How well does your content address your ${audienceTerm}' primary interests?`,
      description: `Consider whether your content speaks directly to what your audience cares about.`,
      options: [
        { text: `Highly ${audienceTerm}-focused`, value: 2 },
        { text: `Balanced focus`, value: 1 },
        { text: "Organization-focused", value: 0 }
      ]
    },
    {
      id: 9,
      category: "Process Simplicity",
      question: userType === 'nonprofit'
        ? "How would you rate the simplicity of your donation process?"
        : "How would you rate the simplicity of your purchase process?",
      description: `Consider the number of steps and complexity involved.`,
      options: [
        { text: "Very simple", value: 2 },
        { text: "Moderately simple", value: 1 },
        { text: "Complex", value: 0 }
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
        {/* Enhanced CMCD Organic Background Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 organic-blob animate-pulse" />
        <div className="absolute bottom-20 left-20 w-72 h-72 organic-blob-alt animate-pulse" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 organic-blob opacity-50" 
             style={{ animationDelay: '4s' }} />
        
        {/* Floating particles */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-primary opacity-40 animate-bounce" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-2 h-2 rounded-full bg-accent opacity-50 animate-pulse" 
             style={{ animationDelay: '3s' }} />
        
        <div className="w-full max-w-2xl relative z-10">
          <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
            <div className="p-8">
            {/* Enhanced CMCD Header with polished brain */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <CMCDBrandMark />
              </div>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative group">
                  {/* Enhanced brain container */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent shadow-elegant relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse rounded-full blur-sm"></div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <Brain className="h-6 w-6 text-primary-foreground drop-shadow-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent shadow-glow animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-space-grotesk font-bold text-foreground mb-2 leading-tight">
                    YOUR DATA HAS A BRAIN
                  </h1>
                  <p className="text-primary font-medium font-inter">We decode human behavior</p>
                </div>
              </div>
              <p className="text-muted-foreground text-lg font-inter max-w-lg mx-auto">
                Let's see what your behavioral data is telling you about your audience engagement.
              </p>
            </div>

              {/* Enhanced Filter Question */}
              <div className={`transition-smooth ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-space-grotesk font-semibold text-foreground">
                      First, let's understand your organization
                    </h2>
                    <p className="text-muted-foreground font-inter">
                      This helps us tailor our behavioral insights to your specific audience and conversion goals.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Card 
                      className="p-6 cursor-pointer transition-smooth border-2 border-border hover:border-primary/50 hover:shadow-glow hover:bg-card/60 backdrop-blur-sm group"
                      onClick={() => handleUserTypeSelection('small-business')}
                    >
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
                          <Brain className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-space-grotesk font-semibold text-foreground">Small Business Owner</h3>
                        <p className="text-muted-foreground font-inter">
                          You run or manage a small business focused on customer acquisition and revenue growth
                        </p>
                      </div>
                    </Card>

                    <Card 
                      className="p-6 cursor-pointer transition-smooth border-2 border-border hover:border-primary/50 hover:shadow-glow hover:bg-card/60 backdrop-blur-sm group"
                      onClick={() => handleUserTypeSelection('nonprofit')}
                    >
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-smooth">
                          <Brain className="h-8 w-8 text-accent" />
                        </div>
                        <h3 className="text-xl font-space-grotesk font-semibold text-foreground">Nonprofit Leader</h3>
                        <p className="text-muted-foreground font-inter">
                          You're an Executive Director or lead a nonprofit focused on donor engagement and mission impact
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
      {/* Enhanced CMCD Organic Background Elements */}
      <div className="absolute top-10 right-10 w-80 h-80 organic-blob animate-pulse opacity-30" />
      <div className="absolute bottom-10 left-10 w-64 h-64 organic-blob-alt animate-pulse opacity-20" 
           style={{ animationDelay: '3s' }} />
      
      {/* Floating particles */}
      <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-primary opacity-40 animate-bounce" 
           style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-accent opacity-50 animate-pulse" 
           style={{ animationDelay: '2s' }} />
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8">
            {/* Enhanced CMCD Header with polished brain */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <CMCDBrandMark />
              </div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="relative group">
                  {/* Enhanced brain container */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent shadow-elegant relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse rounded-full blur-sm"></div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <Brain className="h-5 w-5 text-primary-foreground drop-shadow-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent shadow-glow animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
                <h1 className="text-3xl font-space-grotesk font-bold text-foreground">
                  YOUR DATA HAS A BRAIN
                </h1>
              </div>
              <p className="text-muted-foreground font-inter">
                We decode human behavior. Let's see what your data is telling you.
              </p>
            </div>

            {/* Enhanced Progress */}
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

            {/* Enhanced Footer */}
            <div className="text-center mt-8">
              <div className="text-sm text-muted-foreground font-inter mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary opacity-60" />
                <span className="text-xs text-muted-foreground font-inter">Psychology-backed insights</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};