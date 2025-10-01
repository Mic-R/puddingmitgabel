import { ContentModeratorClient } from '@azure/cognitiveservices-contentmoderator';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

let moderatorClient: ContentModeratorClient | null = null;

export function getContentModeratorClient() {
  if (!moderatorClient) {
    const key = process.env.AZURE_CONTENT_MODERATOR_KEY;
    const endpoint = process.env.AZURE_CONTENT_MODERATOR_ENDPOINT;

    if (!key || !endpoint) {
      console.warn('Azure Content Moderator credentials not configured');
      return null;
    }

    const credentials = new ApiKeyCredentials({
      inHeader: { 'Ocp-Apim-Subscription-Key': key }
    });

    moderatorClient = new ContentModeratorClient(credentials, endpoint);
  }

  return moderatorClient;
}

export async function moderateText(text: string): Promise<{
  approved: boolean;
  reason?: string;
}> {
  const client = getContentModeratorClient();

  if (!client) {
    // If Azure is not configured, auto-approve for development
    console.warn('Content moderation skipped - Azure not configured');
    return { approved: true };
  }

  try {
    const result = await client.textModeration.screenText('text/plain', text, {
      language: 'deu',
      autocorrect: false,
      pII: false,
      classify: true,
    });

    const hasOffensiveContent = result.classification?.reviewRecommended ?? false;
    
    return {
      approved: !hasOffensiveContent,
      reason: hasOffensiveContent ? 'Content flagged by moderation service' : undefined,
    };
  } catch (error) {
    console.error('Content moderation error:', error);
    // Fail closed - reject content if moderation service fails
    return {
      approved: false,
      reason: 'Moderation service error',
    };
  }
}
