const { makeGraphQLRequest } = require('../utils/api');

// Subscribe to webhook
const subscribeHook = async (z, bundle) => {
  const webhookUrl = bundle.targetUrl;
  const eventType = bundle.inputData.event_type || 'podcastepisode.created';

  const mutation = `
    mutation AddWebhook($endpointUrl: String!, $webhookEvents: [String!]!) {
      addWebhookUrlForUser(
        endpointUrl: $endpointUrl,
        webhookEvents: $webhookEvents
      ) {
        id
        endpointUrl
        webhookEvents
        isActive
        webhookSecret
      }
    }
  `;

  const variables = {
    endpointUrl: webhookUrl,
    webhookEvents: [eventType]
  };

  const response = await makeGraphQLRequest(mutation, variables, z, bundle);
  const webhook = response.data.addWebhookUrlForUser;

  return {
    id: webhook.id,
    webhookSecret: webhook.webhookSecret
  };
};

// Unsubscribe from webhook
const unsubscribeHook = async (z, bundle) => {
  const webhookId = bundle.subscribeData.id;

  const mutation = `
    mutation DeleteWebhook($id: ID!) {
      deleteWebhookForUser(id: $id)
    }
  `;

  const variables = { id: webhookId };

  await makeGraphQLRequest(mutation, variables, z, bundle);

  return { success: true };
};

// Process incoming webhook
const performHook = async (z, bundle) => {
  const payload = bundle.cleanedRequest;

  // Verify webhook secret if present
  const secret = bundle.subscribeData?.webhookSecret;
  const incomingSecret = bundle.request?.headers?.['x-taddy-webhook-secret'];

  if (secret && incomingSecret !== secret) {
    throw new z.errors.Error('Invalid webhook secret', 'AuthenticationError', 401);
  }

  // Extract episode data from webhook payload
  const episode = payload.data;

  return {
    id: episode.uuid,
    ...episode,
    // Include metadata for debugging
    _webhookEvent: payload.action,
    _webhookTimestamp: payload.timestamp,
    _webhookType: payload.taddyType
  };
};

// Perform list for testing (returns sample data)
const performList = async (z, bundle) => {
  // Use the polling trigger to get sample episodes
  const query = `
    query GetLatestEpisodes {
      getLatestPodcastEpisodes(
        limitPerPodcast: 1
        page: 1
      ) {
        uuid
        name
        description
        audioUrl
        imageUrl
        datePublished
        duration
        podcastSeries {
          uuid
          name
          imageUrl
        }
      }
    }
  `;

  const response = await makeGraphQLRequest(query, {}, z, bundle);
  const episodes = response.data.getLatestPodcastEpisodes || [];

  return episodes.map(episode => ({
    id: episode.uuid,
    ...episode
  }));
};

module.exports = {
  key: 'new_episode_webhook',
  noun: 'Episode',
  display: {
    label: 'New Episode (Webhook)',
    description: 'Triggers instantly when a new podcast episode is published. Note: Currently receives all episodes without filtering - use with caution.',
    hidden: true // Set to false when webhook filtering is available
  },
  operation: {
    type: 'hook',

    // Input fields
    inputFields: [
      {
        key: 'event_type',
        label: 'Event Type',
        type: 'string',
        choices: [
          { value: 'podcastepisode.created', sample: 'podcastepisode.created', label: 'New Episode Published' },
          { value: 'podcastepisode.updated', sample: 'podcastepisode.updated', label: 'Episode Updated' },
          { value: 'podcastepisode.deleted', sample: 'podcastepisode.deleted', label: 'Episode Deleted' }
        ],
        default: 'podcastepisode.created',
        required: true,
        helpText: 'Select which episode event to monitor.'
      }
    ],

    // Hook operations
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: performHook,
    performList: performList,

    // Sample data
    sample: {
      id: '12345678-1234-1234-1234-123456789012',
      uuid: '12345678-1234-1234-1234-123456789012',
      name: 'Sample Episode Title',
      description: 'Sample episode description',
      audioUrl: 'https://example.com/episode.mp3',
      imageUrl: 'https://example.com/episode.jpg',
      datePublished: 1699999999,
      duration: 3600,
      podcastSeries: {
        uuid: '87654321-4321-4321-4321-210987654321',
        name: 'Sample Podcast',
        imageUrl: 'https://example.com/podcast.jpg'
      },
      _webhookEvent: 'created',
      _webhookTimestamp: 1699999999,
      _webhookType: 'podcastepisode'
    }
  }
};
