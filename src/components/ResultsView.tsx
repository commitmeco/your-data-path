import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, TrendingUp, AlertTriangle, CheckCircle, Target, Download, Users, Award } from "lucide-react";
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
  // Get contextual terms based on user type
  const audienceTerm = userType === 'nonprofit' ? 'donors' : 'customers';
  const conversionTerm = userType === 'nonprofit' ? 'donations' : 'sales';
  const revenueTerms = userType === 'nonprofit' 
    ? { revenue: 'Hidden Funding', impact: 'Mission Impact' }
    : { revenue: 'Hidden Revenue', impact: 'Business Growth' };
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

  // Industry benchmarking data
  const industryBenchmarks = {
    'Data Collection': { average: 65, strong: 80 },
    'Customer Behavior Analysis': { average: 58, strong: 75 },
    'Conversion Optimization': { average: 62, strong: 78 },
    'Personalization': { average: 55, strong: 72 },
    'User Experience': { average: 68, strong: 82 },
    'Analytics Implementation': { average: 60, strong: 76 }
  };

  const downloadInfographic = () => {
    // Create a simple HTML representation for download
    const infographicHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CMCD Behavioral Audit Results</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; padding: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { color: #06b6d4; font-size: 24px; font-weight: 600; margin-bottom: 20px; }
        .title { font-size: 36px; font-weight: bold; margin-bottom: 10px; }
        .score { font-size: 72px; font-weight: bold; color: #06b6d4; margin: 20px 0; text-shadow: 0 0 30px rgba(6, 182, 212, 0.5); }
        .categories { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 40px 0; }
        .category { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; border-left: 4px solid #06b6d4; }
        .category-name { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
        .category-score { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
        .benchmark { font-size: 12px; opacity: 0.8; }
        .footer { text-align: center; margin-top: 40px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">CMCD BEHAVIORAL AUDIT</div>
            <h1 class="title">Your Data Decoded</h1>
            <div class="score">${Math.round(overallPercentage)}%</div>
            <p>Overall Score: ${totalScore} out of ${maxTotalScore} points</p>
        </div>
        
        <div class="categories">
            ${categoryScores.map(cat => {
              const benchmark = industryBenchmarks[cat.category];
              return `
            <div class="category">
                <div class="category-name">${cat.category}</div>
                <div class="category-score">${Math.round(cat.percentage)}%</div>
                ${benchmark ? `<div class="benchmark">Industry Average: ${benchmark.average}% | Top Performers: ${benchmark.strong}%</div>` : ''}
            </div>`;
            }).join('')}
        </div>
        
        <div class="footer">
            <p>Powered by Commit Me Co Design</p>
            <p>www.commitmeco.design</p>
        </div>
    </div>
</body>
</html>`;
    
    const blob = new Blob([infographicHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CMCD-Audit-Results-${Math.round(overallPercentage)}%.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen gradient-subtle py-8 px-4 relative overflow-hidden">
      {/* Organic Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 organic-blob animate-pulse opacity-20" />
      <div className="absolute bottom-32 left-16 w-72 h-72 organic-blob-alt animate-pulse opacity-15" 
           style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 organic-blob opacity-10" 
           style={{ animationDelay: '6s' }} />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 rounded-full bg-primary mr-3" />
              <span className="text-primary font-medium text-lg tracking-wider">CMCD BEHAVIORAL AUDIT</span>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Data Decoded
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-5xl font-bold text-primary shadow-glow">
                {Math.round(overallPercentage)}%
              </div>
              <div className="text-left">
                <p className="text-xl font-medium text-foreground">Overall Score</p>
                <p className="text-muted-foreground">
                  {totalScore} out of {maxTotalScore} points
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your assessment reveals specific opportunities to unlock {conversionTerm} and eliminate barriers keeping {audienceTerm} from supporting you. 
              Here's what your behavioral data is telling you:
            </p>
          </div>
        </Card>

        {/* Social Proof */}
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-semibold text-foreground">94%</div>
                  <div className="text-sm text-muted-foreground">Recommend This Tool</div>
                </div>
              </div>
              <div className="hidden sm:block text-sm text-muted-foreground italic max-w-xs">
                "This audit helped us identify exactly where we were losing customers in our funnel."
              </div>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <div className="grid gap-6 md:grid-cols-2">
          {categoryScores.map((category) => {
            const benchmark = industryBenchmarks[category.category];
            return (
              <Card key={category.category} className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-lg">
                        {category.category}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.questions} question{category.questions > 1 ? 's' : ''} assessed
                      </p>
                      {benchmark && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Industry avg: {benchmark.average}% • Top performers: {benchmark.strong}%
                        </p>
                      )}
                    </div>
                    <Badge className={`${getScoreColor(category.level)} flex items-center gap-1 shadow-sm`}>
                      {getScoreIcon(category.level)}
                      {Math.round(category.percentage)}%
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden relative">
                      {benchmark && (
                        <>
                          <div 
                            className="absolute top-0 w-0.5 h-full bg-muted-foreground/40 z-10"
                            style={{ left: `${benchmark.average}%` }}
                            title={`Industry Average: ${benchmark.average}%`}
                          />
                          <div 
                            className="absolute top-0 w-0.5 h-full bg-muted-foreground/60 z-10"
                            style={{ left: `${benchmark.strong}%` }}
                            title={`Top Performers: ${benchmark.strong}%`}
                          />
                        </>
                      )}
                      <div
                        className={`h-full rounded-full transition-smooth shadow-sm ${
                          category.level === 'strong' ? 'bg-success shadow-glow' :
                          category.level === 'moderate' ? 'bg-warning' :
                          'bg-destructive'
                        }`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {recommendations[category.level]}
                      {benchmark && category.percentage > benchmark.strong && (
                        <span className="text-success font-medium"> You're outperforming top industry performers!</span>
                      )}
                      {benchmark && category.percentage < benchmark.average && (
                        <span className="text-warning font-medium"> Focus here to reach industry standards.</span>
                      )}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Next Steps */}
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 rounded-full bg-primary mr-3" />
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Unlock Your {revenueTerms.revenue}?
              </h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-xl">
                  <Target className="h-6 w-6 text-primary" />
                  Priority Areas
                </h3>
                <div className="space-y-3">
                  {categoryScores
                    .filter(c => c.level === 'needs-focus')
                    .slice(0, 2)
                    .map(category => (
                      <div key={category.category} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-3 h-3 bg-destructive rounded-full" />
                        <span className="font-medium">{category.category}</span>
                        <span className="text-muted-foreground">({Math.round(category.percentage)}%)</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2 text-xl">
                  <CheckCircle className="h-6 w-6 text-success" />
                  Your Strengths
                </h3>
                <div className="space-y-3">
                  {categoryScores
                    .filter(c => c.level === 'strong')
                    .slice(0, 2)
                    .map(category => (
                      <div key={category.category} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-3 h-3 bg-success rounded-full shadow-glow" />
                        <span className="font-medium">{category.category}</span>
                        <span className="text-muted-foreground">({Math.round(category.percentage)}%)</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="text-center space-y-6">
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                This behavioral assessment shows you what's possible. A comprehensive CMCD audit reveals exactly 
                how to implement these improvements and measures the {revenueTerms.impact.toLowerCase()} impact of each change.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth"
                  onClick={() => window.open('https://www.commitmeco.design/signal-sync', '_blank')}
                >
                  Get Your Full CMCD Audit
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={downloadInfographic}
                  className="border-primary/50 hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Infographic
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => {
                    const subject = encodeURIComponent(`My CMCD Behavioral Audit Results - ${Math.round(overallPercentage)}% Score`);
                    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your CMCD Behavioral Audit Results</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .score { font-size: 48px; font-weight: bold; margin: 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
        .category { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #0891b2; }
        .category-title { font-weight: 600; font-size: 18px; margin-bottom: 8px; }
        .score-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .strong { background: #dcfce7; color: #166534; }
        .moderate { background: #fef3c7; color: #92400e; }
        .needs-focus { background: #fee2e2; color: #991b1b; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #0891b2, #06b6d4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; box-shadow: 0 4px 15px rgba(8, 145, 178, 0.3); }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .logo { color: #0891b2; font-weight: 600; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Your CMCD Behavioral Audit Results</h1>
        <div class="score">${Math.round(overallPercentage)}%</div>
        <p>Overall Score: ${totalScore} out of ${maxTotalScore} points</p>
    </div>
    
    <div class="content">
        <p><strong>Hello!</strong></p>
        <p>You just completed the CMCD Behavioral Audit. Your assessment reveals specific opportunities to unlock ${conversionTerm} and eliminate barriers keeping ${audienceTerm} from supporting ${userType === 'nonprofit' ? 'your mission' : 'your business'}.</p>
        
        <h2>📊 Category Breakdown</h2>
        ${categoryScores.map(cat => `
        <div class="category">
            <div class="category-title">${cat.category}</div>
            <span class="score-badge ${cat.level === 'strong' ? 'strong' : cat.level === 'moderate' ? 'moderate' : 'needs-focus'}">${Math.round(cat.percentage)}% - ${cat.level.replace('-', ' ').toUpperCase()}</span>
            <p style="margin-top: 10px; color: #64748b;">${
              cat.level === 'strong' ? 'Your strength here is driving results. Consider sharing this success with other areas.' :
              cat.level === 'moderate' ? 'Good foundation with room for optimization. Small improvements here can yield significant returns.' :
              'High-impact opportunity. Addressing this area should be a priority for immediate results.'
            }</p>
        </div>
        `).join('')}
        
        ${categoryScores.filter(c => c.level === 'needs-focus').length > 0 ? `
        <h2>🎯 Priority Areas for Improvement</h2>
        <ul>
        ${categoryScores.filter(c => c.level === 'needs-focus').map(cat => `<li><strong>${cat.category}</strong> (${Math.round(cat.percentage)}%)</li>`).join('')}
        </ul>
        ` : ''}
        
        ${categoryScores.filter(c => c.level === 'strong').length > 0 ? `
        <h2>✅ Your Strengths</h2>
        <ul>
        ${categoryScores.filter(c => c.level === 'strong').map(cat => `<li><strong>${cat.category}</strong> (${Math.round(cat.percentage)}%)</li>`).join('')}
        </ul>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
            <p><strong>Ready to unlock your ${userType === 'nonprofit' ? 'hidden funding' : 'hidden revenue'}?</strong></p>
            <p>This behavioral assessment shows you what's possible. A comprehensive CMCD audit reveals exactly how to implement these improvements and measures the ${userType === 'nonprofit' ? 'mission impact' : 'business growth'} of each change.</p>
            <a href="https://www.commitmeco.design/signal-sync" class="cta-button">Get Your Full CMCD Audit</a>
        </div>
        
        <div class="footer">
            <p>Powered by <span class="logo">Commit Me Co Design</span><br>
            Behavioral UX Research & Data-Driven Design</p>
            <p><a href="https://www.commitmeco.design" style="color: #0891b2;">www.commitmeco.design</a></p>
        </div>
    </div>
</body>
</html>`;
                    const body = encodeURIComponent(htmlBody);
                    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
                  }} 
                  className="border-primary/50 hover:bg-primary/10"
                >
                  Email Results to Myself
                </Button>
                <Button variant="ghost" size="lg" onClick={onRestart} className="hover:bg-primary/10">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Assessment
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <button
              onClick={() => window.open('https://www.commitmeco.design', '_blank')}
              className="text-primary font-medium hover:text-primary/80 transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Commit Me Co Design
            </button>
            {' '}• Behavioral UX Research & Data-Driven Design
          </p>
        </div>
      </div>
    </div>
  );
};