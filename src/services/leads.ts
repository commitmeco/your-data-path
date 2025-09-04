import { supabase } from "@/integrations/supabase/client";
import { hubspotPrivateAppService, HubSpotContact } from "./hubspot-private-app";

export interface LeadData {
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

export interface Lead extends LeadData {
  id: string;
  hubspot_synced: boolean;
  hubspot_sync_error?: string;
  hubspot_contact_id?: string;
  email_sent: boolean;
  email_error?: string;
  created_at: string;
  updated_at: string;
}

export class LeadsService {
  /**
   * Save lead to database and sync to HubSpot
   * This ensures leads are never lost even if HubSpot sync fails
   */
  async captureLead(leadData: LeadData): Promise<{ success: boolean; lead?: Lead; error?: string }> {
    try {
      // First, save to local database
      const { data: lead, error: dbError } = await supabase
        .from('leads')
        .insert({
          first_name: leadData.first_name,
          last_name: leadData.last_name,
          email: leadData.email,
          company: leadData.company,
          role: leadData.role,
          team_size: leadData.team_size,
          quiz_score: leadData.quiz_score,
          user_type: leadData.user_type,
          dominant_type: leadData.dominant_type,
          secondary_type: leadData.secondary_type,
          dna_scores: leadData.dna_scores,
          quiz_completion_date: leadData.quiz_completion_date,
          lead_source: leadData.lead_source,
          hubspot_synced: false,
          email_sent: false
        })
        .select()
        .single();

      if (dbError) {
        console.error('Failed to save lead to database:', dbError);
        return { success: false, error: 'Failed to save lead data' };
      }

      // Now attempt HubSpot sync
      let hubspotSynced = false;
      let hubspotError: string | undefined;
      let hubspotContactId: string | undefined;

      try {
        const hubspotContactData: HubSpotContact = {
          first_name: leadData.first_name,
          last_name: leadData.last_name,
          email: leadData.email,
          company: leadData.company,
          role: leadData.role,
          team_size: leadData.team_size,
          quiz_score: leadData.quiz_score,
          user_type: leadData.user_type,
          dominant_type: leadData.dominant_type,
          secondary_type: leadData.secondary_type,
          dna_scores: leadData.dna_scores,
          quiz_completion_date: leadData.quiz_completion_date,
          lead_source: leadData.lead_source
        };

        const result = await hubspotPrivateAppService.createOrUpdateContact(hubspotContactData);
        hubspotSynced = result.success;
        hubspotContactId = result.contactId;
        
        if (!result.success) {
          hubspotError = result.error;
        }
      } catch (error) {
        console.error('HubSpot sync failed:', error);
        hubspotError = error instanceof Error ? error.message : 'Unknown HubSpot error';
      }

      // Update the lead with sync status
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          hubspot_synced: hubspotSynced,
          hubspot_sync_error: hubspotError,
          hubspot_contact_id: hubspotContactId
        })
        .eq('id', lead.id)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update lead sync status:', updateError);
        // Still return success since the lead was saved
      }

      return {
        success: true,
        lead: updatedLead || lead
      };

    } catch (error) {
      console.error('Unexpected error in lead capture:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error occurred'
      };
    }
  }

  /**
   * Retry HubSpot sync for failed leads
   */
  async retryHubSpotSync(leadId: string): Promise<boolean> {
    try {
      const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (fetchError || !lead) {
        console.error('Lead not found for retry:', fetchError);
        return false;
      }

      const hubspotContactData: HubSpotContact = {
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        company: lead.company,
        role: lead.role,
        team_size: lead.team_size,
        quiz_score: lead.quiz_score,
        user_type: lead.user_type,
        dominant_type: lead.dominant_type,
        secondary_type: lead.secondary_type,
        dna_scores: lead.dna_scores,
        quiz_completion_date: lead.quiz_completion_date,
        lead_source: lead.lead_source
      };

      const result = await hubspotPrivateAppService.createOrUpdateContact(hubspotContactData);
      const success = result.success;

      // Update sync status
      await supabase
        .from('leads')
        .update({
          hubspot_synced: success,
          hubspot_sync_error: success ? null : (result.error || 'Retry failed'),
          hubspot_contact_id: result.contactId
        })
        .eq('id', leadId);

      return success;
    } catch (error) {
      console.error('Error retrying HubSpot sync:', error);
      return false;
    }
  }

  /**
   * Get all leads (for admin purposes)
   */
  async getLeads(limit = 100, offset = 0) {
    return await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
  }

  /**
   * Get leads that failed HubSpot sync
   */
  async getFailedSyncs() {
    return await supabase
      .from('leads')
      .select('*')
      .eq('hubspot_synced', false)
      .order('created_at', { ascending: false });
  }
}

// Export singleton instance
export const leadsService = new LeadsService();