import { supabase } from "@/integrations/supabase/client";
import { hubspotService, HubSpotLeadData } from "./hubspot";

export interface LeadData {
  email: string;
  quiz_score?: number;
  user_type?: string;
  quiz_completion_date?: string;
  lead_source?: string;
}

export interface Lead extends LeadData {
  id: string;
  hubspot_synced: boolean;
  hubspot_sync_error?: string;
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
          email: leadData.email,
          quiz_score: leadData.quiz_score,
          user_type: leadData.user_type,
          quiz_completion_date: leadData.quiz_completion_date,
          lead_source: leadData.lead_source,
          hubspot_synced: false
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

      try {
        const hubspotData: HubSpotLeadData = {
          email: leadData.email,
          quiz_score: leadData.quiz_score,
          user_type: leadData.user_type,
          quiz_completion_date: leadData.quiz_completion_date,
          lead_source: leadData.lead_source
        };

        hubspotSynced = await hubspotService.submitLead(hubspotData);
      } catch (error) {
        console.error('HubSpot sync failed:', error);
        hubspotError = error instanceof Error ? error.message : 'Unknown HubSpot error';
      }

      // Update the lead with sync status
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          hubspot_synced: hubspotSynced,
          hubspot_sync_error: hubspotError
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

      const hubspotData: HubSpotLeadData = {
        email: lead.email,
        quiz_score: lead.quiz_score,
        user_type: lead.user_type,
        quiz_completion_date: lead.quiz_completion_date,
        lead_source: lead.lead_source
      };

      const success = await hubspotService.submitLead(hubspotData);

      // Update sync status
      await supabase
        .from('leads')
        .update({
          hubspot_synced: success,
          hubspot_sync_error: success ? null : 'Retry failed'
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