-- Add new fields to leads table for HubSpot Private App integration
ALTER TABLE public.leads 
ADD COLUMN company TEXT,
ADD COLUMN role TEXT,
ADD COLUMN team_size TEXT,
ADD COLUMN dna_scores JSONB,
ADD COLUMN dominant_type TEXT,
ADD COLUMN secondary_type TEXT,
ADD COLUMN hubspot_contact_id TEXT,
ADD COLUMN email_sent BOOLEAN DEFAULT false,
ADD COLUMN email_error TEXT;

-- Create index on hubspot_contact_id for faster lookups
CREATE INDEX idx_leads_hubspot_contact_id ON public.leads(hubspot_contact_id);

-- Create index on email for faster lookups
CREATE INDEX idx_leads_email ON public.leads(email);

-- Add trigger to update the updated_at timestamp
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();