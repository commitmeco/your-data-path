-- Add first_name and last_name columns to leads table
ALTER TABLE public.leads 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;