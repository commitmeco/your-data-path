import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, TrendingUp, AlertTriangle, CheckCircle, Target, Download, Users, Award, Brain, Sparkles, Zap } from "lucide-react";
import type { Answer, Question } from "./DataAuditQuiz";
import { CMCDBrandMark } from "./CMCDLogo";

interface ResultsViewProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
  userType?: 'small-business' | 'nonprofit' | null;
  userEmail?: string;
}

interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: 'strong' | 'moderate' | 'needs-focus';
  questions: number;
}

export const ResultsView = ({ answers, questions, onRestart, userType, userEmail }: ResultsViewProps) => {
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

  // Generate personalized action plan based on user's specific results
  const getPersonalizedActionPlan = () => {
    const weakCategories = categoryScores.filter(c => c.level === 'needs-focus').sort((a, b) => a.percentage - b.percentage);
    const strongCategories = categoryScores.filter(c => c.level === 'strong');
    const moderateCategories = categoryScores.filter(c => c.level === 'moderate');
    
    const actions = [];

    // Priority actions based on weakest areas
    if (weakCategories.length > 0) {
      const weakest = weakCategories[0];
      
      if (weakest.category === 'Behavioral Signals') {
        actions.push({
          priority: 1,
          title: `Track ${audienceTerm} Drop-off Points`,
          description: `Set up heatmaps and analytics to identify where ${audienceTerm} get frustrated and leave. Focus on your highest-traffic pages first.`,
          impact: 'High',
          timeframe: '1-2 weeks',
          category: 'Behavioral Signals'
        });
      } else if (weakest.category === 'Conversion Pathways') {
        actions.push({
          priority: 1,
          title: userType === 'nonprofit' ? 'Simplify Your Donation Process' : 'Streamline Your Checkout Process',
          description: userType === 'nonprofit' 
            ? 'Remove unnecessary steps from your donation flow. Test one-click donation options and ensure mobile optimization.'
            : 'Reduce checkout steps and eliminate form fields. Test guest checkout and mobile payment options.',
          impact: 'High',
          timeframe: '2-3 weeks',
          category: 'Conversion Pathways'
        });
      } else if (weakest.category === 'Trust & Credibility') {
        actions.push({
          priority: 1,
          title: userType === 'nonprofit' ? 'Showcase Impact Stories' : 'Add Social Proof',
          description: userType === 'nonprofit'
            ? 'Create compelling donor testimonials and impact stories. Place them prominently on your donation pages.'
            : 'Add customer reviews, testimonials, and trust badges to your key conversion pages.',
          impact: 'High',
          timeframe: '1-2 weeks',
          category: 'Trust & Credibility'
        });
      } else if (weakest.category === 'Content & Voice') {
        actions.push({
          priority: 1,
          title: `Create ${audienceTerm}-Focused Messaging`,
          description: userType === 'nonprofit'
            ? 'Rewrite your key pages to focus on donor motivations and mission impact rather than organizational details.'
            : 'Audit your copy to focus on customer benefits and outcomes rather than features and company information.',
          impact: 'Medium',
          timeframe: '2-4 weeks',
          category: 'Content & Voice'
        });
      } else if (weakest.category === 'User Experience') {
        actions.push({
          priority: 1,
          title: 'Optimize Mobile Experience',
          description: 'Test your site on multiple mobile devices. Focus on page speed, navigation, and form completion on mobile.',
          impact: 'High',
          timeframe: '2-3 weeks',
          category: 'User Experience'
        });
      } else if (weakest.category === 'Measurement') {
        actions.push({
          priority: 1,
          title: 'Set Up Conversion Tracking',
          description: `Install proper analytics to track ${audienceTerm} journeys from first visit to ${userType === 'nonprofit' ? 'donation' : 'purchase'}. Focus on goal tracking and funnel analysis.`,
          impact: 'Medium',
          timeframe: '1-2 weeks',
          category: 'Measurement'
        });
      }
    }

    // Secondary actions for moderate categories
    if (moderateCategories.length > 0) {
      const topModerate = moderateCategories.sort((a, b) => b.percentage - a.percentage)[0];
      
      if (topModerate.category === 'Behavioral Signals') {
        actions.push({
          priority: 2,
          title: 'Implement User Feedback Collection',
          description: `Add exit-intent surveys and feedback widgets to understand why ${audienceTerm} leave without converting.`,
          impact: 'Medium',
          timeframe: '1-2 weeks',
          category: 'Behavioral Signals'
        });
      } else if (topModerate.category === 'Conversion Pathways') {
        actions.push({
          priority: 2,
          title: 'A/B Test Your CTAs',
          description: 'Test different call-to-action button colors, text, and placement to optimize for higher conversion rates.',
          impact: 'Medium',
          timeframe: '2-3 weeks',
          category: 'Conversion Pathways'
        });
      } else if (topModerate.category === 'Trust & Credibility') {
        actions.push({
          priority: 2,
          title: 'Add More Trust Signals',
          description: 'Include security badges, partner logos, and additional testimonials across your key pages.',
          impact: 'Medium',
          timeframe: '1 week',
          category: 'Trust & Credibility'
        });
      }
    }

    // Leverage strengths
    if (strongCategories.length > 0) {
      const topStrength = strongCategories.sort((a, b) => b.percentage - a.percentage)[0];
      actions.push({
        priority: 3,
        title: `Leverage Your ${topStrength.category} Success`,
        description: `Your ${topStrength.category.toLowerCase()} is a strength. Document what's working and apply these successful elements to improve your weaker areas.`,
        impact: 'Medium',
        timeframe: '1 week',
        category: topStrength.category
      });
    }

    // Overall score-based recommendations
    if (overallPercentage < 50) {
      actions.push({
        priority: 1,
        title: 'Focus on Quick Wins First',
        description: `With your current score, focus on the easiest improvements first. Small changes in ${weakCategories[0]?.category.toLowerCase()} can have immediate impact.`,
        impact: 'High',
        timeframe: '1 week',
        category: 'Overall Strategy'
      });
    } else if (overallPercentage >= 80) {
      actions.push({
        priority: 2,
        title: 'Optimize for Advanced Conversions',
        description: `Your foundation is strong. Focus on advanced techniques like personalization and behavioral triggers to maximize ${conversionTerm}.`,
        impact: 'Medium',
        timeframe: '4-6 weeks',
        category: 'Overall Strategy'
      });
    }

    return actions.slice(0, 4); // Return top 4 actions
  };

  const actionPlan = getPersonalizedActionPlan();

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
      {/* Enhanced CMCD Organic Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 organic-blob animate-pulse opacity-20" />
      <div className="absolute bottom-32 left-16 w-72 h-72 organic-blob-alt animate-pulse opacity-15" 
           style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 organic-blob opacity-10" 
           style={{ animationDelay: '6s' }} />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-primary opacity-30 animate-bounce" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-accent opacity-40 animate-pulse" 
           style={{ animationDelay: '4s' }} />
      <div className="absolute top-2/3 left-1/3 w-2 h-2 rounded-full bg-success opacity-50 animate-bounce" 
           style={{ animationDelay: '5s' }} />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Enhanced Header */}
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <CMCDBrandMark />
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <Brain className="h-12 w-12 text-primary animate-pulse" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl font-space-grotesk font-bold text-foreground mb-2 leading-tight">
                  YOUR DATA DECODED
                </h1>
                <p className="text-primary font-medium font-inter">Behavioral insights revealed</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="relative">
                <div className="text-6xl font-space-grotesk font-bold text-primary shadow-glow">
                  {Math.round(overallPercentage)}%
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-success animate-ping opacity-75" />
                <Zap className="absolute -bottom-1 -left-1 h-5 w-5 text-accent animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-xl font-space-grotesk font-medium text-foreground">Brain Score</p>
                <p className="text-muted-foreground font-inter">
                  {totalScore} out of {maxTotalScore} behavioral signals
                </p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-inter leading-relaxed">
              Your assessment reveals specific opportunities to unlock {conversionTerm} and eliminate barriers keeping {audienceTerm} from supporting you. 
              <span className="text-primary font-medium"> Here's what your behavioral data is telling you:</span>
            </p>
          </div>
        </Card>

        {/* Enhanced Social Proof */}
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div>
                  <div className="font-space-grotesk font-bold text-foreground text-lg">94%</div>
                  <div className="text-sm text-muted-foreground font-inter">Recommend This Tool</div>
                </div>
              </div>
              <div className="hidden sm:block text-sm text-muted-foreground italic max-w-xs font-inter leading-relaxed">
                <span className="text-primary">"This audit helped us identify exactly where we were losing customers in our funnel."</span>
                <div className="text-xs mt-1 opacity-75">- Marketing Director, SaaS Company</div>
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

        {/* Personalized Action Plan */}
        {userEmail && (
          <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
            <div className="p-8">
              <div className="flex items-center justify-center mb-6">
                <CMCDBrandMark />
              </div>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Brain className="h-8 w-8 text-primary animate-pulse" />
                  <h2 className="text-3xl font-space-grotesk font-bold text-foreground">
                    YOUR BEHAVIORAL ACTION PLAN
                  </h2>
                </div>
                <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto font-inter leading-relaxed">
                  Based on your specific behavioral patterns, here's your customized roadmap to improve {conversionTerm} and {audienceTerm} engagement:
                </p>
              </div>

              <div className="space-y-6">
                {actionPlan.map((action, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-muted/10 to-muted/5 rounded-xl border border-border/30 hover:border-primary/30 transition-smooth">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-space-grotesk font-bold ${
                          action.priority === 1 ? 'bg-destructive/20 text-destructive shadow-glow' :
                          action.priority === 2 ? 'bg-warning/20 text-warning' :
                          'bg-primary/20 text-primary'
                        }`}>
                          {action.priority}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="font-space-grotesk font-bold text-foreground text-xl leading-tight">
                            {action.title}
                          </h3>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge variant="outline" className={`text-xs font-inter ${
                              action.impact === 'High' ? 'border-destructive/50 text-destructive' :
                              action.impact === 'Medium' ? 'border-warning/50 text-warning' :
                              'border-primary/50 text-primary'
                            }`}>
                              {action.impact} Impact
                            </Badge>
                            <Badge variant="outline" className="text-xs font-inter border-muted-foreground/30 text-muted-foreground">
                              {action.timeframe}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed mb-4 font-inter">
                          {action.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full font-inter">
                            Focus Area: {action.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {index < actionPlan.length - 1 && (
                      <div className="absolute left-6 top-20 w-0.5 h-6 bg-gradient-to-b from-primary/50 to-transparent" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-space-grotesk font-bold text-foreground">
                      CMCD Implementation Strategy
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-inter leading-relaxed">
                    Start with Priority 1 actions first. Complete one before moving to the next. 
                    Small, consistent improvements compound over time for maximum {revenueTerms.impact.toLowerCase()}. 
                    <span className="text-primary font-medium">Psychology-backed insights drive real results.</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

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
                    const textBody = `
CMCD BEHAVIORAL AUDIT RESULTS
============================

Overall Score: ${Math.round(overallPercentage)}% (${totalScore} out of ${maxTotalScore} points)

Hello!

You just completed the CMCD Behavioral Audit. Your assessment reveals specific opportunities to unlock ${conversionTerm} and eliminate barriers keeping ${audienceTerm} from supporting ${userType === 'nonprofit' ? 'your mission' : 'your business'}.

CATEGORY BREAKDOWN
==================

${categoryScores.map(cat => `
${cat.category}: ${Math.round(cat.percentage)}% - ${cat.level.replace('-', ' ').toUpperCase()}
${
  cat.level === 'strong' ? 'Your strength here is driving results. Consider sharing this success with other areas.' :
  cat.level === 'moderate' ? 'Good foundation with room for optimization. Small improvements here can yield significant returns.' :
  'High-impact opportunity. Addressing this area should be a priority for immediate results.'
}
`).join('')}

${categoryScores.filter(c => c.level === 'needs-focus').length > 0 ? `
PRIORITY AREAS FOR IMPROVEMENT
==============================
${categoryScores.filter(c => c.level === 'needs-focus').map(cat => `• ${cat.category} (${Math.round(cat.percentage)}%)`).join('\n')}
` : ''}

${categoryScores.filter(c => c.level === 'strong').length > 0 ? `
YOUR STRENGTHS
==============
${categoryScores.filter(c => c.level === 'strong').map(cat => `• ${cat.category} (${Math.round(cat.percentage)}%)`).join('\n')}
` : ''}

READY TO UNLOCK YOUR ${userType === 'nonprofit' ? 'HIDDEN FUNDING' : 'HIDDEN REVENUE'}?
${Array(60).fill('=').join('')}

This behavioral assessment shows you what's possible. A comprehensive CMCD audit reveals exactly how to implement these improvements and measures the ${userType === 'nonprofit' ? 'mission impact' : 'business growth'} of each change.

Get Your Full CMCD Audit: https://www.commitmeco.design/signal-sync

---
Powered by Commit Me Co Design
Behavioral UX Research & Data-Driven Design
www.commitmeco.design
                    `;
                    const body = encodeURIComponent(textBody);
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