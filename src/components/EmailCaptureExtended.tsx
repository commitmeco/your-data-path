import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { leadsService } from "@/services/leads";
import { Brain, Sparkles, Users, Building2 } from "lucide-react";

interface EmailCaptureExtendedProps {
  overallScore: number;
  dominantType?: string;
  secondaryType?: string;
  dnaScores?: any;
  onEmailSubmit: (email: string) => void;
  userType?: 'small-business' | 'nonprofit' | null;
}

export const EmailCaptureExtended = ({ 
  overallScore, 
  dominantType,
  secondaryType,
  dnaScores,
  onEmailSubmit, 
  userType 
}: EmailCaptureExtendedProps) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData = {
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        email: email.trim(),
        company: company.trim() || undefined,
        role: role.trim() || undefined,
        team_size: teamSize || undefined,
        quiz_score: overallScore,
        user_type: userType || undefined,
        dominant_type: dominantType,
        secondary_type: secondaryType,
        dna_scores: dnaScores,
        quiz_completion_date: new Date().toISOString(),
        lead_source: 'data_audit_quiz'
      };

      const result = await leadsService.captureLead(leadData);

      if (result.success) {
        toast({
          title: "Success!",
          description: "Your information has been saved. We'll be in touch soon with your personalized recommendations!",
        });
        onEmailSubmit(email);
      } else {
        toast({
          title: "Error",
          description: result.error || "There was an issue saving your information. Please try again.",
          variant: "destructive",
        });
        onEmailSubmit(email); // Still proceed to show results
      }
    } catch (error) {
      console.error('Email capture error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      onEmailSubmit(email); // Still proceed to show results
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreMessage = () => {
    if (userType === 'nonprofit') {
      return "As a nonprofit organization, you're doing important work! Let us help you optimize your data management to maximize your impact.";
    } else if (userType === 'small-business') {
      return "Small businesses like yours can gain a significant competitive advantage with better data practices. Let's explore how!";
    }
    return "Great job completing the assessment! Your personalized recommendations are ready.";
  };

  const teamSizeOptions = [
    { value: "1", label: "Just me" },
    { value: "2-5", label: "2-5 people" },
    { value: "6-20", label: "6-20 people" },
    { value: "21-50", label: "21-50 people" },
    { value: "51-200", label: "51-200 people" },
    { value: "200+", label: "200+ people" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card/95 border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Brain className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Get Your Personalized Report
          </CardTitle>
          <CardDescription className="text-base">
            {getScoreMessage()}
          </CardDescription>
          
          {(dominantType || secondaryType) && (
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Your Data DNA</span>
              </div>
              {dominantType && (
                <p className="text-sm text-muted-foreground">
                  Primary: <span className="font-medium text-foreground">{dominantType}</span>
                </p>
              )}
              {secondaryType && (
                <p className="text-sm text-muted-foreground">
                  Secondary: <span className="font-medium text-foreground">{secondaryType}</span>
                </p>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-primary/20 focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="border-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company/Organization
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                type="text"
                placeholder="e.g., CEO, Data Analyst, Manager"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-size" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Size
              </Label>
              <Select value={teamSize} onValueChange={setTeamSize}>
                <SelectTrigger className="border-primary/20 focus:border-primary">
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  {teamSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Get My Personalized Report
                </div>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              By submitting, you agree to receive personalized recommendations and insights about your data management practices.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};