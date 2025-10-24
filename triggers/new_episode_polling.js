const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const { EPISODE_EXTENDED_FRAGMENT } = require('../utils/constants');

// Poll for new episodes from specified podcasts
const perform = async (z, bundle) => {
  const inputType = bundle.inputData.input_type || 'uuids';
  const limit = bundle.inputData.limit || 25;

  let uuids = [];
  let rssUrls = [];

  if (inputType === 'uuids') {
    const uuidsInput = bundle.inputData.podcast_uuids;
    if (!uuidsInput) {
      throw new z.errors.Error('Podcast UUIDs are required', 'InvalidInput', 400);
    }

    // Parse comma-separated UUIDs
    uuids = uuidsInput
      .split(',')
      .map(uuid => uuid.trim())
      .filter(uuid => uuid);

    // Validate UUIDs
    const invalidUuids = uuids.filter(uuid => !isValidUuid(uuid));
    if (invalidUuids.length > 0) {
      throw new z.errors.Error(
        `Invalid UUID format: ${invalidUuids.join(', ')}. UUIDs must be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
        'InvalidInput',
        400
      );
    }

    if (uuids.length === 0) {
      throw new z.errors.Error('At least one podcast UUID is required', 'InvalidInput', 400);
    }

    if (uuids.length > 100) {
      throw new z.errors.Error('Maximum 100 podcast UUIDs allowed', 'InvalidInput', 400);
    }
  } else {
    const rssUrlsInput = bundle.inputData.rss_urls;
    if (!rssUrlsInput) {
      throw new z.errors.Error('RSS URLs are required', 'InvalidInput', 400);
    }

    // Parse comma-separated RSS URLs
    rssUrls = rssUrlsInput
      .split(',')
      .map(url => url.trim())
      .filter(url => url);

    if (rssUrls.length === 0) {
      throw new z.errors.Error('At least one RSS URL is required', 'InvalidInput', 400);
    }

    if (rssUrls.length > 100) {
      throw new z.errors.Error('Maximum 100 RSS URLs allowed', 'InvalidInput', 400);
    }
  }

  // Build GraphQL query
  const query = `
    query GetLatestEpisodes($uuids: [ID], $rssUrls: [String], $limitPerPage: Int) {
      getLatestPodcastEpisodes(uuids: $uuids, rssUrls: $rssUrls, limitPerPage: $limitPerPage) {
        ${EPISODE_EXTENDED_FRAGMENT}
        podcastSeries {
          uuid
          name
          imageUrl
        }
      }
    }
  `;

  const variables = {
    limitPerPage: limit
  };

  if (uuids.length > 0) {
    variables.uuids = uuids;
  }

  if (rssUrls.length > 0) {
    variables.rssUrls = rssUrls;
  }

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const episodes = response.data?.getLatestPodcastEpisodes || [];

  // Zapier automatically deduplicates by 'id' field
  // Return episodes with id field for deduplication
  return episodes.map(episode => ({
    id: episode.uuid,
    ...episode
  }));
};

module.exports = {
  key: 'new_episode_polling',
  noun: 'Episode',
  display: {
    label: 'New Episode',
    description: 'Triggers when a new episode is published to one or more specified podcasts.'
  },

  operation: {
    type: 'polling',

    inputFields: [
      {
        key: 'input_type',
        label: 'Specify Podcasts By',
        type: 'string',
        choices: [
          { value: 'uuids', sample: 'uuids', label: 'Podcast UUIDs' },
          { value: 'rss_urls', sample: 'rss_urls', label: 'RSS Feed URLs' }
        ],
        default: 'uuids',
        required: true,
        helpText: 'Choose how you want to specify which podcasts to monitor'
      },
      {
        key: 'podcast_uuids',
        label: 'Podcast UUIDs',
        type: 'string',
        required: false,
        placeholder: 'uuid1,uuid2,uuid3',
        helpText: 'Comma-separated list of podcast UUIDs to monitor (max 100). Get UUIDs from "Search Podcasts" or "Find Podcast" actions.'
      },
      {
        key: 'rss_urls',
        label: 'RSS Feed URLs',
        type: 'string',
        required: false,
        placeholder: 'https://example.com/feed1.xml,https://example.com/feed2.xml',
        helpText: 'Comma-separated list of podcast RSS feed URLs to monitor (max 100).'
      },
      {
        key: 'limit',
        label: 'Maximum Episodes to Fetch',
        type: 'integer',
        default: '25',
        required: false,
        helpText: 'Number of latest episodes to check per poll (1-100). Default is 25. Zapier automatically filters out duplicates.'
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
        imageUrl: 'https://example.com/podcast-image.jpg'
      }
    }
  }
};
