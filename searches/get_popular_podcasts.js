const { makeGraphQLRequest } = require('../utils/api');
const { PODCAST_SERIES_FRAGMENT, GENRE_CHOICES, LANGUAGE_CHOICES } = require('../utils/constants');

// Get popular/trending podcasts
const perform = async (z, bundle) => {
  const limit = bundle.inputData.limit || 25;

  // Build variables object
  const variables = {
    limitPerPage: limit,
    taddyType: 'PODCASTSERIES'
  };

  // Optional filters
  const genres = bundle.inputData.genres || [];
  if (genres.length > 0) {
    variables.filterByGenres = genres;
  }

  const language = bundle.inputData.language;
  if (language) {
    variables.filterByLanguage = language;
  }

  // Build GraphQL query
  const query = `
    query GetPopularContent($filterByGenres: [Genre!], $filterByLanguage: Language, $limitPerPage: Int, $taddyType: TaddyType!) {
      getPopularContent(
        filterByGenres: $filterByGenres
        filterByLanguage: $filterByLanguage
        limitPerPage: $limitPerPage
        taddyType: $taddyType
      ) {
        popularityRankId
        podcastSeries {
          ${PODCAST_SERIES_FRAGMENT}
        }
      }
    }
  `;

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const popularContent = response.data?.getPopularContent || {};
  const podcasts = popularContent.podcastSeries || [];

  // Zapier searches must return an array
  // Add id field for each podcast (required for Zapier)
  return podcasts.map(podcast => ({
    id: podcast.uuid,
    ...podcast
  }));
};

module.exports = {
  key: 'get_popular_podcasts',
  noun: 'Podcast',
  display: {
    label: 'Get Popular Podcasts',
    description: 'Get currently trending/popular podcasts, optionally filtered by genre and language.'
  },

  operation: {
    inputFields: [
      {
        key: 'limit',
        label: 'Maximum Results',
        type: 'integer',
        default: '25',
        required: false,
        helpText: 'Maximum number of popular podcasts to return (1-100). Default is 25.'
      },
      {
        key: 'genres',
        label: 'Filter by Genres',
        type: 'string',
        required: false,
        list: true,
        choices: GENRE_CHOICES,
        helpText: 'Filter popular podcasts by one or more genres. Leave empty for all genres.'
      },
      {
        key: 'language',
        label: 'Filter by Language',
        type: 'string',
        required: false,
        choices: LANGUAGE_CHOICES,
        helpText: 'Filter popular podcasts by a specific language. Leave empty for all languages.'
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
      genres: ['PODCASTSERIES_COMEDY', 'PODCASTSERIES_SOCIETY_AND_CULTURE'],
      popularityRank: 1
    }
  }
};
