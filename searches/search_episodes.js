const { makeGraphQLRequest, expandGenres } = require('../utils/api');
const {
  EPISODE_EXTENDED_FRAGMENT,
  GENRE_CHOICES,
  GENRE_HIERARCHY,
  LANGUAGE_CHOICES,
  CONTENT_TYPE_CHOICES,
  MATCH_STRATEGY_CHOICES,
  SORT_ORDER_CHOICES
} = require('../utils/constants');

// Search for episodes with filters
const perform = async (z, bundle) => {
  const searchTerm = bundle.inputData.search_term;

  if (!searchTerm) {
    throw new z.errors.Error('Search term is required', 'InvalidInput', 400);
  }

  // Build variables object
  const variables = {
    term: searchTerm,
    filterForTypes: ['PODCASTEPISODE'],
    limitPerPage: bundle.inputData.limit || 25
  };

  // Optional filters
  const genres = bundle.inputData.genres || [];
  if (genres.length > 0) {
    variables.filterForGenres = expandGenres(genres, GENRE_HIERARCHY);
  }

  const languages = bundle.inputData.languages || [];
  if (languages.length > 0) {
    variables.filterForLanguages = languages;
  }

  const contentTypes = bundle.inputData.content_types || [];
  if (contentTypes.length > 0) {
    variables.filterForPodcastContentType = contentTypes;
  }

  const safeMode = bundle.inputData.safe_mode || false;
  if (safeMode) {
    variables.isSafeMode = true;
  }

  const matchBy = bundle.inputData.match_by;
  if (matchBy) {
    variables.matchBy = matchBy;
  }

  const sortBy = bundle.inputData.sort_by;
  if (sortBy) {
    variables.sortBy = sortBy;
  }

  // Duration filters
  const minDuration = bundle.inputData.min_duration;
  if (minDuration) {
    variables.filterForDurationGreaterThan = parseInt(minDuration);
  }

  const maxDuration = bundle.inputData.max_duration;
  if (maxDuration) {
    variables.filterForDurationLessThan = parseInt(maxDuration);
  }

  // Series filters (include/exclude specific podcasts)
  const includeSeriesUuids = bundle.inputData.include_series_uuids;
  if (includeSeriesUuids) {
    variables.filterForSeriesUuids = includeSeriesUuids.split(',').map(uuid => uuid.trim()).filter(uuid => uuid);
  }

  const excludeSeriesUuids = bundle.inputData.exclude_series_uuids;
  if (excludeSeriesUuids) {
    variables.filterForNotInSeriesUuids = excludeSeriesUuids.split(',').map(uuid => uuid.trim()).filter(uuid => uuid);
  }

  // Build GraphQL query
  const query = `
    query Search(
      $term: String
      $filterForTypes: [SearchContentType]
      $filterForGenres: [Genre]
      $filterForLanguages: [Language]
      $filterForPodcastContentType: [PodcastContentType]
      $isSafeMode: Boolean
      $matchBy: SearchMatchType
      $sortBy: SearchSortOrder
      $filterForDurationGreaterThan: Int
      $filterForDurationLessThan: Int
      $filterForSeriesUuids: [ID]
      $filterForNotInSeriesUuids: [ID]
      $limitPerPage: Int
    ) {
      search(
        term: $term
        filterForTypes: $filterForTypes
        filterForGenres: $filterForGenres
        filterForLanguages: $filterForLanguages
        filterForPodcastContentType: $filterForPodcastContentType
        isSafeMode: $isSafeMode
        matchBy: $matchBy
        sortBy: $sortBy
        filterForDurationGreaterThan: $filterForDurationGreaterThan
        filterForDurationLessThan: $filterForDurationLessThan
        filterForSeriesUuids: $filterForSeriesUuids
        filterForNotInSeriesUuids: $filterForNotInSeriesUuids
        limitPerPage: $limitPerPage
      ) {
        searchId
        podcastEpisodes {
          ${EPISODE_EXTENDED_FRAGMENT}
          podcastSeries {
            uuid
            name
            imageUrl
          }
        }
      }
    }
  `;

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const searchData = response.data?.search || {};
  const episodes = searchData.podcastEpisodes || [];

  // Zapier searches must return an array
  // Add id field for each episode (required for Zapier)
  return episodes.map(episode => ({
    id: episode.uuid,
    ...episode
  }));
};

module.exports = {
  key: 'search_episodes',
  noun: 'Episode',
  display: {
    label: 'Search Episodes',
    description: 'Search for podcast episodes with filters for genres, languages, duration, and more.'
  },

  operation: {
    inputFields: [
      {
        key: 'search_term',
        label: 'Search Term',
        type: 'string',
        required: true,
        placeholder: 'e.g., artificial intelligence, interview with, climate change',
        helpText: 'Enter keywords to search for episodes. Can be episode titles, topics, or keywords.'
      },
      {
        key: 'limit',
        label: 'Maximum Results',
        type: 'integer',
        default: '25',
        required: false,
        helpText: 'Maximum number of episodes to return (1-100). Default is 25.'
      },
      {
        key: 'genres',
        label: 'Genres',
        type: 'string',
        required: false,
        list: true,
        choices: GENRE_CHOICES,
        helpText: 'Filter by one or more podcast genres. Leave empty to search all genres.'
      },
      {
        key: 'languages',
        label: 'Languages',
        type: 'string',
        required: false,
        list: true,
        choices: LANGUAGE_CHOICES,
        helpText: 'Filter by one or more podcast languages. Leave empty to search all languages.'
      },
      {
        key: 'content_types',
        label: 'Content Type',
        type: 'string',
        required: false,
        list: true,
        choices: CONTENT_TYPE_CHOICES,
        helpText: 'Filter by audio or video podcasts. Leave empty for both.'
      },
      {
        key: 'safe_mode',
        label: 'Safe Mode',
        type: 'boolean',
        default: 'false',
        required: false,
        helpText: 'When enabled, only returns safe (non-explicit) content.'
      },
      {
        key: 'match_by',
        label: 'Match Strategy',
        type: 'string',
        required: false,
        choices: MATCH_STRATEGY_CHOICES,
        helpText: 'How strictly to match search terms. "Most Terms" is recommended for best results.'
      },
      {
        key: 'sort_by',
        label: 'Sort By',
        type: 'string',
        required: false,
        choices: SORT_ORDER_CHOICES,
        helpText: 'How to order results. "Relevance" shows best matches first, "Popularity" shows most popular first.'
      },
      {
        key: 'min_duration',
        label: 'Minimum Duration (seconds)',
        type: 'integer',
        required: false,
        placeholder: '3600',
        helpText: 'Only return episodes longer than this duration. E.g., 3600 for episodes over 1 hour.'
      },
      {
        key: 'max_duration',
        label: 'Maximum Duration (seconds)',
        type: 'integer',
        required: false,
        placeholder: '600',
        helpText: 'Only return episodes shorter than this duration. E.g., 600 for episodes under 10 minutes.'
      },
      {
        key: 'include_series_uuids',
        label: 'Search Within Podcasts (UUIDs)',
        type: 'string',
        required: false,
        placeholder: 'uuid1,uuid2,uuid3',
        helpText: 'Comma-separated podcast UUIDs. Only search episodes from these specific podcasts.'
      },
      {
        key: 'exclude_series_uuids',
        label: 'Exclude Podcasts (UUIDs)',
        type: 'string',
        required: false,
        placeholder: 'uuid1,uuid2,uuid3',
        helpText: 'Comma-separated podcast UUIDs. Exclude episodes from these specific podcasts.'
      }
    ],

    perform: perform,

    sample: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      uuid: '123e4567-e89b-12d3-a456-426614174000',
      name: 'The Future of Artificial Intelligence',
      description: 'An in-depth discussion about AI and its impact on society.',
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
