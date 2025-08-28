import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, TrendingUp, AlertTriangle, CheckCircle, Target } from "lucide-react";
import type { Answer, Question } from "./DataAuditQuiz";

interface ResultsViewProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
  userType?: 'small-business' | 'nonprofit' | null;
}

interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'strong' | 'moderate' | 'needs-focus';
  questions: number;
}

export const ResultsView = ({ answers, questions, onRestart, userType }: ResultsViewProps) => {
  // Calculate scores by category
  const categoryScores: CategoryScore[] = (() => {
    const categories = Array.from(new Set(questions.map(q => q.category)));
    
    return categories.map(category => {
      const categoryQuestions = questions.filter(q => q.category === category);
      const categoryAnswers = answers.filter(a => 
        categoryQuestions.some(q => q.id === a.questionId)
      );
      
      const score = categoryAnswers.reduce((sum, answer) => sum + answer.value, 0);
      const maxScore = categoryQuestions.length * 2; // Max 2 points per question
      const percentage = (score / maxScore) * 100;
      
      let level: 'strong' | 'moderate' | 'needs-focus' = 'needs-focus';
      if (percentage >= 80) level = 'strong';
      else if (percentage >= 50) level = 'moderate';
      
      return {
        category,
        score,
        maxScore,
        percentage,
        level,
        questions: categoryQuestions.length
      };
    });
  })();

  const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);
  const maxTotalScore = questions.length * 2;
  const overallPercentage = (totalScore / maxTotalScore) * 100;

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'strong': return <CheckCircle className="h-5 w-5" />;
      case 'moderate': return <TrendingUp className="h-5 w-5" />;
      case 'needs-focus': return <AlertTriangle className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  const getScoreColor = (level: string) => {
    switch (level) {
      case 'strong': return 'score-strong';
      case 'moderate': return 'score-moderate';
      case 'needs-focus': return 'score-needs-focus';
      default: return 'bg-muted';
    }
  };

  const recommendations = {
    'strong': 'Your strength here is driving results. Consider sharing this success with other areas.',
    'moderate': 'Good foundation with room for optimization. Small improvements here can yield significant returns.',
    'needs-focus': 'High-impact opportunity. Addressing this area should be a priority for immediate results.'
  };

  return (
    <div className="min-h-screen gradient-subtle py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <Card className="shadow-card border-0">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-4">
              Your Data Audit Results
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-4xl font-bold text-foreground">
                {Math.round(overallPercentage)}%
              </div>
              <div className="text-left">
                <p className="text-lg font-medium text-foreground">Overall Score</p>
                <p className="text-sm text-muted-foreground">
                  {totalScore} out of {maxTotalScore} points
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your assessment reveals specific opportunities to unlock hidden revenue and eliminate conversion barriers. 
              Here's what your data is telling you:
            </p>
          </div>
        </Card>

        {/* Category Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {categoryScores.map((category) => (
            <Card key={category.category} className="shadow-card border-0">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {category.category}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.questions} question{category.questions > 1 ? 's' : ''} assessed
                    </p>
                  </div>
                  <Badge className={`${getScoreColor(category.level)} flex items-center gap-1`}>
                    {getScoreIcon(category.level)}
                    {Math.round(category.percentage)}%
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-smooth ${
                        category.level === 'strong' ? 'bg-success' :
                        category.level === 'moderate' ? 'bg-warning' :
                        'bg-destructive'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {recommendations[category.level]}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Next Steps */}
        <Card className="shadow-card border-0">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">
              Ready to Unlock Your Hidden Revenue?
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Priorities
                </h3>
                <div className="space-y-2">
                  {categoryScores
                    .filter(c => c.level === 'needs-focus')
                    .slice(0, 2)
                    .map(category => (
                      <div key={category.category} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-destructive rounded-full" />
                        <span>{category.category}</span>
                        <span className="text-muted-foreground">({Math.round(category.percentage)}%)</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Your Strengths
                </h3>
                <div className="space-y-2">
                  {categoryScores
                    .filter(c => c.level === 'strong')
                    .slice(0, 2)
                    .map(category => (
                      <div key={category.category} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-success rounded-full" />
                        <span>{category.category}</span>
                        <span className="text-muted-foreground">({Math.round(category.percentage)}%)</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This assessment shows you what's possible. A comprehensive CMCD audit reveals exactly 
                how to implement these improvements and measures the revenue impact of each change.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-elegant">
                  Get Your Full CMCD Audit
                </Button>
                <Button variant="outline" size="lg" onClick={onRestart}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Assessment
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by CMCD • Behavioral UX Research & Data-Driven Design</p>
        </div>
      </div>
    </div>
  );
};