const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const { EPISODE_EXTENDED_FRAGMENT, EPISODE_WITH_TRANSCRIPT_FRAGMENT, PODCAST_SERIES_EXTENDED_FRAGMENT } = require('../utils/constants');

// Get multiple episodes by UUIDs in a single request
const perform = async (z, bundle) => {
  const uuidsInput = bundle.inputData.episode_uuids;

  if (!uuidsInput) {
    throw new z.errors.Error('Episode UUIDs are required', 'InvalidInput', 400);
  }

  // Parse comma-separated UUIDs
  const uuids = uuidsInput
    .split(',')
    .map(uuid => uuid.trim())
    .filter(uuid => uuid);

  if (uuids.length === 0) {
    throw new z.errors.Error('At least one episode UUID is required', 'InvalidInput', 400);
  }

  if (uuids.length > 25) {
    throw new z.errors.Error('Maximum 25 episode UUIDs allowed', 'InvalidInput', 400);
  }

  // Validate UUIDs
  const invalidUuids = uuids.filter(uuid => !isValidUuid(uuid));
  if (invalidUuids.length > 0) {
    throw new z.errors.Error(
      `Invalid UUID format: ${invalidUuids.join(', ')}. UUIDs must be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
      'InvalidInput',
      400
    );
  }

  // Check if user wants to include transcripts (uses transcript credits)
  const includeTranscript = bundle.inputData.include_transcript || false;

  // Dynamically build episode fragment based on includeTranscript
  const episodeFragment = includeTranscript ? EPISODE_WITH_TRANSCRIPT_FRAGMENT : EPISODE_EXTENDED_FRAGMENT;

  // Build GraphQL query
  const query = `
    query GetMultipleEpisodes($uuids: [ID]) {
      getMultiplePodcastEpisodes(uuids: $uuids) {
        ${episodeFragment}
        podcastSeries {
          ${PODCAST_SERIES_EXTENDED_FRAGMENT}
        }
      }
    }
  `;

  const variables = { uuids };
  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const episodes = response.data?.getMultiplePodcastEpisodes || [];

  // Zapier searches must return an array
  // Add id field for each episode (required for Zapier)
  return episodes.map(episode => ({
    id: episode.uuid,
    ...episode
  }));
};

module.exports = {
  key: 'get_multiple_episodes',
  noun: 'Episode',
  display: {
    label: 'Get Multiple Episodes',
    description: 'Retrieve multiple episodes by their UUIDs in a single efficient request.'
  },

  operation: {
    inputFields: [
      {
        key: 'episode_uuids',
        label: 'Episode UUIDs',
        type: 'string',
        required: true,
        placeholder: 'uuid1,uuid2,uuid3',
        helpText: 'Comma-separated list of episode UUIDs to retrieve (max 25). Get UUIDs from search results or previous operations.'
      },
      {
        key: 'include_transcript',
        label: 'Include Transcript',
        type: 'boolean',
        default: 'false',
        required: false,
        helpText: 'Include basic episode transcripts in the response. Note: This uses transcript credits from your account quota.'
      }
    ],

    perform: perform,

    sample: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Episode 42: The Future of AI',
      description: 'In this episode, we discuss the future of artificial intelligence.',
      audioUrl: 'https://example.com/episode.mp3',
      imageUrl: 'https://example.com/episode-image.jpg',
      datePublished: 1640000000,
      duration: 3600,
      episodeNumber: 42,
      seasonNumber: 1,
      fileType: 'audio/mpeg',
      podcastSeries: {
        uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
        name: 'Tech Talk Podcast',
        imageUrl: 'https://example.com/podcast-image.jpg',
        itunesId: 123456789,
        rssUrl: 'https://feeds.example.com/podcast.rss',
        description: 'A podcast about technology and innovation.',
        language: 'ENGLISH',
        totalEpisodesCount: 100,
        authorName: 'Tech Talk Team',
        websiteUrl: 'https://techtalkpodcast.com',
        genres: ['PODCASTSERIES_TECHNOLOGY']
      }
    }
  }
};
