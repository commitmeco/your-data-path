// HubSpot Forms API integration
export interface HubSpotLeadData {
  email: string;
  quiz_score?: number;
  user_type?: string;
  quiz_completion_date?: string;
  lead_source?: string;
}

export interface HubSpotConfig {
  portalId: string;
  formId: string;
}

// Default configuration - update these with your HubSpot details
const DEFAULT_CONFIG: HubSpotConfig = {
  portalId: import.meta.env.VITE_HUBSPOT_PORTAL_ID || '',
  formId: import.meta.env.VITE_HUBSPOT_FORM_ID || ''
};

export class HubSpotService {
  private config: HubSpotConfig;

  constructor(config?: Partial<HubSpotConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async submitLead(leadData: HubSpotLeadData): Promise<boolean> {
    try {
      if (!this.config.portalId || !this.config.formId) {
        console.warn('HubSpot configuration missing. Lead data:', leadData);
        return false;
      }

      const formData = this.buildFormData(leadData);
      const response = await fetch(`https://api.hsforms.com/submissions/v3/forms/${this.config.portalId}/${this.config.formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status} ${response.statusText}`);
      }

      console.log('Lead successfully submitted to HubSpot');
      return true;
    } catch (error) {
      console.error('Failed to submit lead to HubSpot:', error);
      return false;
    }
  }

  private buildFormData(leadData: HubSpotLeadData) {
    const fields = [
      {
        name: 'email',
        value: leadData.email
      }
    ];

    // Add optional fields if they exist
    if (leadData.quiz_score !== undefined) {
      fields.push({
        name: 'quiz_score',
        value: leadData.quiz_score.toString()
      });
    }

    if (leadData.user_type) {
      fields.push({
        name: 'user_type',
        value: leadData.user_type
      });
    }

    if (leadData.quiz_completion_date) {
      fields.push({
        name: 'quiz_completion_date',
        value: leadData.quiz_completion_date
      });
    }

    if (leadData.lead_source) {
      fields.push({
        name: 'lead_source',
        value: leadData.lead_source
      });
    }

    return {
      fields,
      context: {
        pageUri: window.location.href,
        pageName: 'CMCD Data Audit Quiz'
      }
    };
  }
}

// Export a default instance
export const hubspotService = new HubSpotService();