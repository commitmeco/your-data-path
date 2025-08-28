import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
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
      {/* Category Badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
          {question.category}
        </span>
        {onPrevious && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
        )}
      </div>

      {/* Question */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground leading-relaxed">
          {question.question}
        </h2>
        <p className="text-muted-foreground">
          {question.description}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <Card 
            key={index}
            className={`p-4 cursor-pointer transition-smooth border-2 hover:border-primary/50 hover:shadow-md ${
              selectedValue === option.value 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'border-border hover:bg-muted/50'
            }`}
            onClick={() => onAnswer(option.value)}
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">
                {option.text}
              </span>
              <div className={`w-4 h-4 rounded-full border-2 transition-smooth ${
                selectedValue === option.value
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              }`}>
                {selectedValue === option.value && (
                  <div className="w-2 h-2 bg-primary-foreground rounded-full m-0.5" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};