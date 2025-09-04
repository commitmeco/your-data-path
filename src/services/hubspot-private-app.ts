export interface HubSpotContact {
  first_name?: string;
  last_name?: string;
  email: string;
  company?: string;
  role?: string;
  team_size?: string;
  quiz_score?: number;
  user_type?: string;
  dominant_type?: string;
  secondary_type?: string;
  dna_scores?: any;
  quiz_completion_date?: string;
  lead_source?: string;
}

export interface HubSpotContactResponse {
  id: string;
  properties: {
    email: string;
    firstname?: string;
    lastname?: string;
    company?: string;
    jobtitle?: string;
    hs_object_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class HubSpotPrivateAppService {
  /**
   * Create or update a contact in HubSpot via edge function
   */
  async createOrUpdateContact(contactData: HubSpotContact): Promise<{
    success: boolean;
    contactId?: string;
    error?: string;
  }> {
    try {
      // Call the edge function which handles the secure HubSpot API integration
      const response = await fetch('https://utssmxappaywbvaxloxx.supabase.co/functions/v1/hubspot-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0c3NteGFwcGF5d2J2YXhsb3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYyMzgsImV4cCI6MjA3MjU1MjIzOH0.sOrjQ3ywLDEMcOg4dnBDZJL5gQPYXZrc09jE7G8VqXo`,
        },
        body: JSON.stringify({
          action: 'createOrUpdateContact',
          contactData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        contactId: result.contactId,
      };
    } catch (error) {
      console.error('Failed to sync contact with HubSpot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Send a personalized email via HubSpot
   */
  async sendPersonalizedEmail(contactId: string, emailTemplate: string, emailData: any): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch('https://utssmxappaywbvaxloxx.supabase.co/functions/v1/hubspot-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0c3NteGFwcGF5d2J2YXhsb3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYyMzgsImV4cCI6MjA3MjU1MjIzOH0.sOrjQ3ywLDEMcOg4dnBDZJL5gQPYXZrc09jE7G8VqXo`,
        },
        body: JSON.stringify({
          action: 'sendEmail',
          contactId,
          emailTemplate,
          emailData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to send email via HubSpot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get contact by email
   */
  async getContactByEmail(email: string): Promise<{
    success: boolean;
    contact?: HubSpotContactResponse;
    error?: string;
  }> {
    try {
      const response = await fetch('https://utssmxappaywbvaxloxx.supabase.co/functions/v1/hubspot-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0c3NteGFwcGF5d2J2YXhsb3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzYyMzgsImV4cCI6MjA3MjU1MjIzOH0.sOrjQ3ywLDEMcOg4dnBDZJL5gQPYXZrc09jE7G8VqXo`,
        },
        body: JSON.stringify({
          action: 'getContactByEmail',
          email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        success: true,
        contact: result.contact,
      };
    } catch (error) {
      console.error('Failed to get contact from HubSpot:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}

// Export singleton instance
export const hubspotPrivateAppService = new HubSpotPrivateAppService();