import { Brain, Cpu } from "lucide-react";

interface CMCDLogoProps {
  className?: string;
  showText?: boolean;
}

export const CMCDLogo = ({ className = "", showText = true }: CMCDLogoProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* CMCD Brand Icon */}
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
          <Brain className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary opacity-60 animate-pulse" />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <div className="font-space-grotesk font-bold text-lg tracking-tight text-foreground leading-none">
            COMMIT ME CO
          </div>
          <div className="font-inter text-xs text-primary font-medium tracking-wider">
            DESIGN
          </div>
        </div>
      )}
    </div>
  );
};

export const CMCDBrandMark = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
      <span className="font-space-grotesk font-medium text-primary tracking-wider text-sm">
        CMCD BEHAVIORAL AUDIT
      </span>
    </div>
  );
};