const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const { PODCAST_SERIES_EXTENDED_FRAGMENT } = require('../utils/constants');

// Find podcast by UUID, name, RSS URL, or iTunes ID
const perform = async (z, bundle) => {
  const inputType = bundle.inputData.input_type || 'name';

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

  // Build GraphQL query
  const query = `
    query getPodcastSeries($${queryVariable}: ${queryVariableType}) {
      getPodcastSeries(${queryVariable}: $${queryVariable}) {
        ${PODCAST_SERIES_EXTENDED_FRAGMENT}
      }
    }
  `;

  const variables = { [queryVariable]: inputValue };
  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const podcast = response.data?.getPodcastSeries;

  // Zapier searches must return an array
  if (podcast) {
    return [{
      id: podcast.uuid,
      ...podcast
    }];
  }

  // Return empty array if not found
  return [];
};

module.exports = {
  key: 'find_podcast',
  noun: 'Podcast',
  display: {
    label: 'Find Podcast',
    description: 'Find a specific podcast by UUID, name, RSS URL, or iTunes ID.'
  },

  operation: {
    inputFields: [
      {
        key: 'input_type',
        label: 'Find By',
        type: 'string',
        choices: [
          { value: 'uuid', sample: 'uuid', label: 'UUID (unique identifier)' },
          { value: 'name', sample: 'name', label: 'Podcast Name' },
          { value: 'rss_url', sample: 'rss_url', label: 'RSS Feed URL' },
          { value: 'itunes_id', sample: 'itunes_id', label: 'iTunes ID' }
        ],
        default: 'name',
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
      }
    ],

    perform: perform,

    sample: {
      id: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
      name: 'This American Life',
      description: 'This American Life is a weekly public radio show, heard by 2.2 million people on more than 500 stations.',
      imageUrl: 'https://www.example.com/image.jpg',
      rssUrl: 'https://www.thisamericanlife.org/podcast/rss.xml',
      itunesId: 201671138,
      language: 'ENGLISH',
      totalEpisodesCount: 800,
      authorName: 'This American Life',
      websiteUrl: 'https://www.thisamericanlife.org',
      genres: ['PODCASTSERIES_SOCIETY_AND_CULTURE'],
      popularityRank: 50
    }
  }
};
