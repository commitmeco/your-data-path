import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Brain, Lightbulb } from "lucide-react";
import type { Question } from "./DataAuditQuiz";

interface QuestionCardProps {
  question: Question;
  onAnswer: (value: number) => void;
  onPrevious?: () => void;
  selectedValue?: number;
}

export const QuestionCard = ({ question, onAnswer, onPrevious, selectedValue }: QuestionCardProps) => {
  return (
    <div className="space-y-6">
      {/* Top Navigation - Previous button left, Category badge right */}
      <div className="flex items-center justify-between">
        {onPrevious ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            className="border-primary/30 hover:bg-primary/10 text-primary font-inter"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        ) : (
          <div />
        )}
        
        <Badge variant="outline" className="text-xs font-inter border-primary/30 text-primary">
          {question.category}
        </Badge>
      </div>

      {/* Enhanced Question Header */}
      <Card className="p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-accent animate-pulse" />
              <span className="text-xs text-accent font-inter font-medium">Behavioral Analysis</span>
            </div>
            <h2 className="text-xl font-space-grotesk font-bold text-foreground mb-3 leading-tight">
              {question.question}
            </h2>
            <p className="text-muted-foreground font-inter leading-relaxed">
              {question.description}
            </p>
          </div>
        </div>
      </Card>

      {/* Answer Options - Radio buttons on left */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <Card
            key={option.value}
            className={`p-4 cursor-pointer transition-smooth hover:shadow-glow group ${
              selectedValue === option.value
                ? 'border-primary bg-primary/10 shadow-glow'
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
            onClick={() => onAnswer(option.value)}
          >
            <div className="flex items-center gap-4">
              {/* Radio button on the left */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-smooth flex-shrink-0 ${
                selectedValue === option.value
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground group-hover:border-primary/50'
              }`}>
                {selectedValue === option.value && (
                  <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                )}
              </div>
              
              {/* Option text */}
              <div className="flex-1">
                <p className={`font-inter font-medium transition-smooth ${
                  selectedValue === option.value ? 'text-primary' : 'text-foreground group-hover:text-primary/80'
                }`}>
                  {option.text}
                </p>
              </div>
              
              {/* Selected indicator */}
              {selectedValue === option.value && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse flex-shrink-0" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom instruction */}
      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground font-inter">
          Select an option to continue your behavioral analysis
        </p>
      </div>
    </div>
  );
};