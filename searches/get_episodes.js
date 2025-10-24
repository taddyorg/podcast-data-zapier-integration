const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const { EPISODE_EXTENDED_FRAGMENT } = require('../utils/constants');

// Get episodes for a podcast
const perform = async (z, bundle) => {
  const inputType = bundle.inputData.input_type || 'uuid';

  let queryVariable, queryVariableType, inputValue;

  // Determine which input type to use
  switch (inputType) {
    case 'uuid':
      inputValue = bundle.inputData.podcast_uuid;
      if (!inputValue) {
        throw new z.errors.Error('Podcast UUID is required', 'InvalidInput', 400);
      }
      if (!isValidUuid(inputValue)) {
        throw new z.errors.Error(
          `Invalid UUID format: ${inputValue}. UUID must be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
          'InvalidInput',
          400
        );
      }
      queryVariable = 'uuid';
      queryVariableType = 'ID!';
      break;

    case 'name':
      inputValue = bundle.inputData.podcast_name;
      if (!inputValue) {
        throw new z.errors.Error('Podcast name is required', 'InvalidInput', 400);
      }
      queryVariable = 'name';
      queryVariableType = 'String!';
      break;

    case 'rss_url':
      inputValue = bundle.inputData.podcast_rss_url;
      if (!inputValue) {
        throw new z.errors.Error('RSS URL is required', 'InvalidInput', 400);
      }
      queryVariable = 'rssUrl';
      queryVariableType = 'String!';
      break;

    case 'itunes_id':
      inputValue = parseInt(bundle.inputData.podcast_itunes_id);
      if (!inputValue || isNaN(inputValue)) {
        throw new z.errors.Error('iTunes ID must be a valid number', 'InvalidInput', 400);
      }
      queryVariable = 'itunesId';
      queryVariableType = 'Int!';
      break;

    default:
      throw new z.errors.Error(`Unknown input type: ${inputType}`, 'InvalidInput', 400);
  }

  const limit = bundle.inputData.limit || 25;

  // Build GraphQL query
  const query = `
    query GetPodcastEpisodes($${queryVariable}: ${queryVariableType}, $limitPerPage: Int) {
      getPodcastSeries(${queryVariable}: $${queryVariable}) {
        uuid
        name
        imageUrl
        episodes(limitPerPage: $limitPerPage, sortOrder: LATEST) {
          ${EPISODE_EXTENDED_FRAGMENT}
        }
      }
    }
  `;

  const variables = {
    [queryVariable]: inputValue,
    limitPerPage: limit
  };

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const podcast = response.data?.getPodcastSeries;

  if (!podcast) {
    throw new z.errors.Error(
      `Podcast not found with ${inputType}: ${inputValue}`,
      'NotFound',
      404
    );
  }

  const episodes = podcast.episodes || [];

  // Zapier searches must return an array
  // Add id field for each episode (required for Zapier)
  return episodes.map(episode => ({
    id: episode.uuid,
    ...episode,
    // Add podcast info to each episode for context
    podcastSeries: {
      uuid: podcast.uuid,
      name: podcast.name,
      imageUrl: podcast.imageUrl
    }
  }));
};

module.exports = {
  key: 'get_episodes',
  noun: 'Episode',
  display: {
    label: 'Get Episodes for Podcast',
    description: 'Get the latest episodes from a podcast by UUID, name, RSS URL, or iTunes ID.'
  },

  operation: {
    inputFields: [
      {
        key: 'input_type',
        label: 'Find Podcast By',
        type: 'string',
        choices: [
          { value: 'uuid', sample: 'uuid', label: 'UUID (unique identifier)' },
          { value: 'name', sample: 'name', label: 'Podcast Name' },
          { value: 'rss_url', sample: 'rss_url', label: 'RSS Feed URL' },
          { value: 'itunes_id', sample: 'itunes_id', label: 'iTunes ID' }
        ],
        default: 'uuid',
        required: true,
        helpText: 'Choose how you want to identify the podcast'
      },
      {
        key: 'podcast_uuid',
        label: 'Podcast UUID',
        type: 'string',
        placeholder: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
        helpText: 'The unique identifier of the podcast (from search results or other operations)',
        required: false
      },
      {
        key: 'podcast_name',
        label: 'Podcast Name',
        type: 'string',
        placeholder: 'This American Life',
        helpText: 'The name/title of the podcast. If multiple podcasts have the same name, the most popular one will be returned.',
        required: false
      },
      {
        key: 'podcast_rss_url',
        label: 'RSS Feed URL',
        type: 'string',
        placeholder: 'https://feeds.example.com/podcast.rss',
        helpText: 'The RSS feed URL of the podcast',
        required: false
      },
      {
        key: 'podcast_itunes_id',
        label: 'iTunes ID',
        type: 'integer',
        placeholder: '1234567890',
        helpText: 'The iTunes ID number of the podcast',
        required: false
      },
      {
        key: 'limit',
        label: 'Maximum Episodes',
        type: 'integer',
        default: '25',
        required: false,
        helpText: 'Maximum number of episodes to return (1-100). Episodes are returned newest first. Default is 25.'
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
