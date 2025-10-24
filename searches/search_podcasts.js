const { makeGraphQLRequest, expandGenres } = require('../utils/api');
const {
  PODCAST_SERIES_EXTENDED_FRAGMENT,
  GENRE_CHOICES,
  GENRE_HIERARCHY,
  LANGUAGE_CHOICES,
  CONTENT_TYPE_CHOICES,
  MATCH_STRATEGY_CHOICES,
  SORT_ORDER_CHOICES
} = require('../utils/constants');

// Search for podcasts with filters
const perform = async (z, bundle) => {
  const searchTerm = bundle.inputData.search_term;

  if (!searchTerm) {
    throw new z.errors.Error('Search term is required', 'InvalidInput', 400);
  }

  // Build variables object
  const variables = {
    term: searchTerm,
    filterForTypes: ['PODCASTSERIES'],
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
        limitPerPage: $limitPerPage
      ) {
        searchId
        podcastSeries {
          ${PODCAST_SERIES_EXTENDED_FRAGMENT}
        }
      }
    }
  `;

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const searchData = response.data?.search || {};
  const podcasts = searchData.podcastSeries || [];

  // Zapier searches must return an array
  // Add id field for each podcast (required for Zapier)
  return podcasts.map(podcast => ({
    id: podcast.uuid,
    ...podcast
  }));
};

module.exports = {
  key: 'search_podcasts',
  noun: 'Podcast',
  display: {
    label: 'Search Podcasts',
    description: 'Search for podcasts with filters for genres, languages, and more.'
  },

  operation: {
    inputFields: [
      {
        key: 'search_term',
        label: 'Search Term',
        type: 'string',
        required: true,
        placeholder: 'e.g., technology, joe rogan, true crime',
        helpText: 'Enter keywords to search for podcasts. Can be podcast names, topics, or keywords.'
      },
      {
        key: 'limit',
        label: 'Maximum Results',
        type: 'integer',
        default: '25',
        required: false,
        helpText: 'Maximum number of podcasts to return (1-100). Default is 25.'
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
      genres: ['PODCASTSERIES_COMEDY', 'PODCASTSERIES_SOCIETY_AND_CULTURE'],
      popularityRank: 1
    }
  }
};
