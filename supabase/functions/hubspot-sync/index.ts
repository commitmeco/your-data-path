import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const hubspotToken = Deno.env.get('HUBSPOT_PRIVATE_APP_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HubSpotContact {
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!hubspotToken) {
    console.error('HubSpot Private App token not configured');
    return new Response(
      JSON.stringify({ error: 'HubSpot configuration missing' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const { action, contactData, email, contactId, emailTemplate, emailData } = await req.json();

    switch (action) {
      case 'createOrUpdateContact':
        return await handleCreateOrUpdateContact(contactData);
      case 'getContactByEmail':
        return await handleGetContactByEmail(email);
      case 'sendEmail':
        return await handleSendEmail(contactId, emailTemplate, emailData);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
    }
  } catch (error) {
    console.error('Error in hubspot-sync function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

async function handleCreateOrUpdateContact(contactData: HubSpotContact): Promise<Response> {
  try {
    // First, try to find existing contact by email
    const existingContact = await getContactByEmail(contactData.email);
    
    const properties: any = {
      email: contactData.email,
    };

    // Map our data to HubSpot properties
    if (contactData.company) properties.company = contactData.company;
    if (contactData.role) properties.jobtitle = contactData.role;
    if (contactData.team_size) properties.team_size = contactData.team_size;
    if (contactData.quiz_score !== undefined) properties.quiz_score = contactData.quiz_score.toString();
    if (contactData.user_type) properties.user_type = contactData.user_type;
    if (contactData.dominant_type) properties.dominant_type = contactData.dominant_type;
    if (contactData.secondary_type) properties.secondary_type = contactData.secondary_type;
    if (contactData.dna_scores) properties.dna_scores = JSON.stringify(contactData.dna_scores);
    if (contactData.quiz_completion_date) properties.quiz_completion_date = contactData.quiz_completion_date;
    if (contactData.lead_source) properties.lead_source = contactData.lead_source;

    let contactId: string;
    
    if (existingContact) {
      // Update existing contact
      console.log('Updating existing contact:', existingContact.id);
      const updateResponse = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${existingContact.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${hubspotToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Failed to update contact: ${errorData.message || updateResponse.statusText}`);
      }

      contactId = existingContact.id;
    } else {
      // Create new contact
      console.log('Creating new contact for:', contactData.email);
      const createResponse = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ properties }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(`Failed to create contact: ${errorData.message || createResponse.statusText}`);
      }

      const newContact = await createResponse.json();
      contactId = newContact.id;
    }

    console.log('Successfully synced contact:', contactId);

    return new Response(
      JSON.stringify({ success: true, contactId }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error creating/updating contact:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleGetContactByEmail(email: string): Promise<Response> {
  try {
    const contact = await getContactByEmail(email);
    
    return new Response(
      JSON.stringify({ success: true, contact }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error getting contact:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleSendEmail(contactId: string, emailTemplate: string, emailData: any): Promise<Response> {
  try {
    // This would integrate with HubSpot's email API or a service like Resend
    // For now, we'll log the action
    console.log('Email sending requested for contact:', contactId, 'template:', emailTemplate);
    
    // TODO: Implement actual email sending logic here
    // This could use HubSpot's email API or integrate with Resend for custom emails
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email sending is not yet implemented' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

async function getContactByEmail(email: string): Promise<any | null> {
  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts?properties=email,firstname,lastname,company,jobtitle&limit=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Contact not found
      }
      const errorData = await response.json();
      throw new Error(`Failed to search for contact: ${errorData.message || response.statusText}`);
    }

    const searchResult = await response.json();
    return searchResult.results && searchResult.results.length > 0 ? searchResult.results[0] : null;
  } catch (error) {
    console.error('Error searching for contact:', error);
    return null;
  }
}

serve(handler);