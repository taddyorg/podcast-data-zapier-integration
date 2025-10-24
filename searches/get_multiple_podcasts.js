const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const { PODCAST_SERIES_EXTENDED_FRAGMENT } = require('../utils/constants');

// Get multiple podcasts by UUIDs in a single request
const perform = async (z, bundle) => {
  const uuidsInput = bundle.inputData.podcast_uuids;

  if (!uuidsInput) {
    throw new z.errors.Error('Podcast UUIDs are required', 'InvalidInput', 400);
  }

  // Parse comma-separated UUIDs
  const uuids = uuidsInput
    .split(',')
    .map(uuid => uuid.trim())
    .filter(uuid => uuid);

  if (uuids.length === 0) {
    throw new z.errors.Error('At least one podcast UUID is required', 'InvalidInput', 400);
  }

  if (uuids.length > 25) {
    throw new z.errors.Error('Maximum 25 podcast UUIDs allowed', 'InvalidInput', 400);
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

  // Build GraphQL query
  const query = `
    query GetMultiplePodcasts($uuids: [ID]) {
      getMultiplePodcastSeries(uuids: $uuids) {
        ${PODCAST_SERIES_EXTENDED_FRAGMENT}
      }
    }
  `;

  const variables = { uuids };
  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const podcasts = response.data?.getMultiplePodcastSeries || [];

  // Zapier searches must return an array
  // Add id field for each podcast (required for Zapier)
  return podcasts.map(podcast => ({
    id: podcast.uuid,
    ...podcast
  }));
};

module.exports = {
  key: 'get_multiple_podcasts',
  noun: 'Podcast',
  display: {
    label: 'Get Multiple Podcasts',
    description: 'Retrieve multiple podcasts by their UUIDs in a single efficient request.'
  },

  operation: {
    inputFields: [
      {
        key: 'podcast_uuids',
        label: 'Podcast UUIDs',
        type: 'string',
        required: true,
        placeholder: 'uuid1,uuid2,uuid3',
        helpText: 'Comma-separated list of podcast UUIDs to retrieve (max 25). Get UUIDs from search results or previous operations.'
      }
    ],

    perform: perform,

    sample: {
      id: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      name: 'The Joe Rogan Experience',
      description: 'The official podcast of comedian Joe Rogan.',
      imageUrl: 'https://www.example.com/image.jpg',
      rssUrl: 'https://feeds.example.com/podcast.rss',
      itunesId: 360084272,
      language: 'ENGLISH',
      totalEpisodesCount: 2000,
      authorName: 'Joe Rogan',
      websiteUrl: 'https://www.joerogan.com',
      genres: ['PODCASTSERIES_COMEDY', 'PODCASTSERIES_SOCIETY_AND_CULTURE']
    }
  }
};
