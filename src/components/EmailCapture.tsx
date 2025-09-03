import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail, Download } from "lucide-react";

interface EmailCaptureProps {
  overallScore: number;
  onEmailSubmit: (email: string) => void;
  userType?: 'small-business' | 'nonprofit' | null;
}

export const EmailCapture = ({ overallScore, onEmailSubmit, userType }: EmailCaptureProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const audienceTerm = userType === 'nonprofit' ? 'donors' : 'customers';
  const conversionTerm = userType === 'nonprofit' ? 'donations' : 'sales';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onEmailSubmit(email);
  };

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Organic Background Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 organic-blob animate-pulse opacity-20" />
      <div className="absolute bottom-32 left-16 w-72 h-72 organic-blob-alt animate-pulse opacity-15" 
           style={{ animationDelay: '3s' }} />
      
      <div className="w-full max-w-2xl relative z-10">
        <Card className="shadow-elegant border-border/50 bg-card/90 backdrop-blur-sm">
          <div className="p-8 text-center">
            {/* Header */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-3 h-3 rounded-full bg-primary mr-3" />
              <span className="text-primary font-medium text-lg tracking-wider">CMCD BEHAVIORAL AUDIT</span>
            </div>

            {/* Score Preview */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
                <h1 className="text-3xl font-bold text-foreground">
                  Analysis Complete!
                </h1>
              </div>
              <div className="text-5xl font-bold text-primary shadow-glow mb-4">
                {Math.round(overallScore)}%
              </div>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Your assessment reveals specific opportunities to unlock {conversionTerm} and eliminate barriers keeping {audienceTerm} from supporting you.
              </p>
            </div>

            {/* Value Proposition */}
            <div className="mb-8 space-y-4">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Get Your Complete Results
              </h2>
              <div className="grid gap-4 text-left">
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Download className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Personalized Action Plan</div>
                    <div className="text-sm text-muted-foreground">Step-by-step recommendations prioritized for your specific results</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Industry Benchmarking</div>
                    <div className="text-sm text-muted-foreground">See how you compare to top performers in your space</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Downloadable Report</div>
                    <div className="text-sm text-muted-foreground">Professional infographic to share with your team</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-center text-lg py-6"
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-smooth w-full max-w-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Generating Results..." : "Get My Complete Results"}
              </Button>
            </form>

            {/* Trust Elements */}
            <div className="mt-6 text-sm text-muted-foreground">
              <p>✓ No spam, ever. ✓ Unsubscribe anytime. ✓ Used by 1,000+ organizations.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};