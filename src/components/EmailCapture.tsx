import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail, Download, Brain, Sparkles } from "lucide-react";
import { CMCDBrandMark } from "./CMCDLogo";
import { HubSpotConfig } from "./HubSpotConfig";
import { leadsService } from "@/services/leads";
import { useToast } from "@/hooks/use-toast";

interface EmailCaptureProps {
  overallScore: number;
  onEmailSubmit: (email: string) => void;
  userType?: 'small-business' | 'nonprofit' | null;
}

export const EmailCapture = ({ overallScore, onEmailSubmit, userType }: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const audienceTerm = userType === 'nonprofit' ? 'donors' : 'customers';
  const conversionTerm = userType === 'nonprofit' ? 'donations' : 'sales';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Prepare lead data
      const leadData = {
        email: email.trim(),
        quiz_score: Math.round(overallScore),
        user_type: userType || 'unknown',
        quiz_completion_date: new Date().toISOString(),
        lead_source: 'CMCD Data Audit Quiz'
      };

      // Save to database and sync to HubSpot
      const result = await leadsService.captureLead(leadData);
      
      if (result.success) {
        if (result.lead?.hubspot_synced) {
          toast({
            title: "Success!",
            description: "Your data brain analysis is ready. We've also added you to our insights mailing list.",
          });
        } else {
          toast({
            title: "Analysis Ready",
            description: "Your behavioral insights are ready to view! (We'll sync your data shortly)",
          });
        }
      } else {
        toast({
          title: "Analysis Ready", 
          description: "Your behavioral insights are ready to view!",
        });
      }

      // Always proceed to results - lead is saved locally
      onEmailSubmit(email);
      
    } catch (error) {
      console.error('Error in email submission:', error);
      toast({
        title: "Analysis Ready",
        description: "Your behavioral insights are ready to view!",
      });
      onEmailSubmit(email);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced CMCD Organic Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 organic-blob animate-pulse opacity-20" />
      <div className="absolute bottom-32 left-16 w-72 h-72 organic-blob-alt animate-pulse opacity-15" 
           style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 organic-blob opacity-10" 
           style={{ animationDelay: '6s' }} />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 right-1/3 w-4 h-4 rounded-full bg-primary opacity-30 animate-bounce" 
           style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-accent opacity-40 animate-pulse" 
           style={{ animationDelay: '4s' }} />
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8 text-center">
            {/* CMCD Header */}
            <div className="flex items-center justify-center mb-6">
              <CMCDBrandMark />
            </div>

            {/* Enhanced Brain Visual with new design */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative group">
                  {/* Redesigned sophisticated brain container */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary via-accent/80 to-primary/60 shadow-elegant relative overflow-hidden border border-primary/20">
                    {/* Animated neural network background */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-primary-foreground animate-pulse"></div>
                      <div className="absolute top-3 right-3 w-0.5 h-0.5 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute bottom-3 left-3 w-0.5 h-0.5 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 rounded-full bg-primary-foreground animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <Brain className="h-8 w-8 text-primary-foreground drop-shadow-lg" />
                    </div>
                  </div>
                  {/* Enhanced floating elements */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-glow flex items-center justify-center animate-bounce">
                    <Sparkles className="h-3 w-3 text-accent-foreground" />
                  </div>
                  {/* Additional floating elements */}
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/4 -left-2 w-1 h-1 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '2.5s' }} />
                </div>
                <div className="text-center">
                  <h1 className="text-4xl font-space-grotesk font-bold text-foreground">
                    ANALYSIS COMPLETE
                  </h1>
                  <p className="text-primary font-medium">Your brain data is ready</p>
                </div>
              </div>
              <div className="text-6xl font-space-grotesk font-bold text-primary shadow-glow mb-4 relative">
                ???
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-success animate-ping" />
              </div>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto font-inter">
                Your behavioral assessment reveals specific opportunities to unlock {conversionTerm} and eliminate barriers keeping {audienceTerm} from supporting you.
              </p>
            </div>

            {/* Enhanced Value Proposition */}
            <div className="mb-8 space-y-4 text-center">
              <h2 className="text-3xl font-space-grotesk font-bold text-foreground mb-4">
                YOUR DATA HAS A BRAIN
              </h2>
              <p className="text-muted-foreground mb-6 font-inter text-lg">
                <span className="text-primary font-medium">Get your personalized behavioral insights report</span>
              </p>
            </div>

            {/* Enhanced Email Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email to decode your behavioral data"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center text-lg py-6 font-inter bg-input/50 border-primary/30 focus:border-primary focus:ring-primary/20"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth w-full max-w-md font-space-grotesk font-semibold text-lg py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 animate-pulse" />
                    Decoding Your Brain Data...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    DECODE MY DATA BRAIN
                  </div>
                )}
              </Button>
            </form>

            {/* Enhanced Trust Elements */}
            <div className="mt-8 p-4 bg-muted/20 rounded-xl border border-border/30">
              <div className="text-sm text-muted-foreground font-inter">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    No spam, ever
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Unsubscribe anytime
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    Trusted by 1,000+ organizations
                  </span>
                </div>
                <p className="text-xs text-center mt-2 opacity-75">
                  Psychology-backed insights • Behavioral UX Research • Data-Driven Design
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* HubSpot Configuration Component */}
        <HubSpotConfig />
      </div>
    </div>
  );
};