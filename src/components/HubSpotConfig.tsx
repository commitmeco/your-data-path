import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HubSpotConfigProps {
  onConfigSave?: (portalId: string, formId: string) => void;
}

export const HubSpotConfig = ({ onConfigSave }: HubSpotConfigProps) => {
  const [portalId, setPortalId] = useState(localStorage.getItem('hubspot_portal_id') || '');
  const [formId, setFormId] = useState(localStorage.getItem('hubspot_form_id') || '');
  const [showConfig, setShowConfig] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!portalId.trim() || !formId.trim()) {
      toast({
        title: "Configuration Required",
        description: "Please enter both Portal ID and Form ID",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('hubspot_portal_id', portalId);
    localStorage.setItem('hubspot_form_id', formId);
    
    toast({
      title: "Configuration Saved",
      description: "HubSpot integration is now configured"
    });

    onConfigSave?.(portalId, formId);
    setShowConfig(false);
  };

  const handleClear = () => {
    localStorage.removeItem('hubspot_portal_id');
    localStorage.removeItem('hubspot_form_id');
    setPortalId('');
    setFormId('');
    
    toast({
      title: "Configuration Cleared",
      description: "HubSpot integration has been disabled"
    });
  };

  if (!showConfig) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfig(true)}
        className="fixed bottom-4 right-4 z-50 bg-card border-border hover:bg-muted"
      >
        <Settings className="h-4 w-4 mr-2" />
        HubSpot Config
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-space-grotesk font-semibold">HubSpot Configuration</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(!isVisible)}
            >
              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="portalId" className="text-sm font-medium">
                HubSpot Portal ID
              </Label>
              <Input
                id="portalId"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your HubSpot Portal ID"
                value={portalId}
                onChange={(e) => setPortalId(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="formId" className="text-sm font-medium">
                HubSpot Form ID
              </Label>
              <Input
                id="formId"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your HubSpot Form ID"
                value={formId}
                onChange={(e) => setFormId(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p className="mb-2"><strong>To find these values:</strong></p>
              <p>1. Go to HubSpot → Marketing → Lead Capture → Forms</p>
              <p>2. Create or select a form</p>
              <p>3. Portal ID: Found in your HubSpot URL or Account Settings</p>
              <p>4. Form ID: Found in the form's embed code</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="flex-1 gradient-primary">
              <Save className="h-4 w-4 mr-2" />
              Save Config
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="ghost" onClick={() => setShowConfig(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};