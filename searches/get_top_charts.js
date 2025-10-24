const { makeGraphQLRequest } = require('../utils/api');
const { PODCAST_SERIES_FRAGMENT, EPISODE_EXTENDED_FRAGMENT, GENRE_CHOICES } = require('../utils/constants');

// Get top charts by country or genre
const perform = async (z, bundle) => {
  const chartType = bundle.inputData.chart_type || 'byCountry';
  const contentType = bundle.inputData.content_type || 'PODCASTSERIES';
  const limit = bundle.inputData.limit || 25;

  // Build variables object
  const variables = {
    taddyType: contentType,
    limitPerPage: limit
  };

  let query;

  if (chartType === 'byCountry') {
    const country = bundle.inputData.country;
    if (!country) {
      throw new z.errors.Error('Country is required when getting charts by country', 'InvalidInput', 400);
    }

    variables.country = country;

    // Query for top charts by country
    query = `
      query GetTopChartsByCountry($taddyType: TaddyType!, $country: Country!, $limitPerPage: Int) {
        getTopChartsByCountry(
          taddyType: $taddyType
          country: $country
          limitPerPage: $limitPerPage
        ) {
          topChartsId
          ${contentType === 'PODCASTSERIES' ? `
          podcastSeries {
            ${PODCAST_SERIES_FRAGMENT}
          }
          ` : `
          podcastEpisodes {
            ${EPISODE_EXTENDED_FRAGMENT}
          }
          `}
        }
      }
    `;
  } else {
    // byGenre
    const genres = bundle.inputData.genres || [];
    if (genres.length === 0) {
      throw new z.errors.Error('At least one genre is required when getting charts by genre', 'InvalidInput', 400);
    }

    variables.genres = genres;

    // Query for top charts by genres
    query = `
      query GetTopChartsByGenres($taddyType: TaddyType!, $genres: [Genre!], $limitPerPage: Int) {
        getTopChartsByGenres(
          taddyType: $taddyType
          genres: $genres
          limitPerPage: $limitPerPage
        ) {
          topChartsId
          ${contentType === 'PODCASTSERIES' ? `
          podcastSeries {
            ${PODCAST_SERIES_FRAGMENT}
          }
          ` : `
          podcastEpisodes {
            ${EPISODE_EXTENDED_FRAGMENT}
          }
          `}
        }
      }
    `;
  }

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const chartData = response.data?.[chartType === 'byCountry' ? 'getTopChartsByCountry' : 'getTopChartsByGenres'] || {};
  const results = contentType === 'PODCASTSERIES'
    ? (chartData.podcastSeries || [])
    : (chartData.podcastEpisodes || []);

  // Zapier searches must return an array
  // Add id field for each item (required for Zapier)
  return results.map(item => ({
    id: item.uuid,
    ...item
  }));
};

module.exports = {
  key: 'get_top_charts',
  noun: 'Chart',
  display: {
    label: 'Get Top Charts',
    description: 'Get daily top charts for podcasts or episodes, filtered by country or genre.'
  },

  operation: {
    inputFields: [
      {
        key: 'chart_type',
        label: 'Chart Type',
        type: 'string',
        choices: [
          { value: 'byCountry', sample: 'byCountry', label: 'By Country' },
          { value: 'byGenre', sample: 'byGenre', label: 'By Genre' }
        ],
        default: 'byCountry',
        required: true,
        helpText: 'Choose whether to get charts by country or by genre'
      },
      {
        key: 'content_type',
        label: 'Content Type',
        type: 'string',
        choices: [
          { value: 'PODCASTSERIES', sample: 'PODCASTSERIES', label: 'Podcasts' },
          { value: 'PODCASTEPISODE', sample: 'PODCASTEPISODE', label: 'Episodes' }
        ],
        default: 'PODCASTSERIES',
        required: true,
        helpText: 'Get top charts for podcasts or episodes'
      },
      {
        key: 'country',
        label: 'Country',
        type: 'string',
        required: false,
        choices: [
          { value: 'US', sample: 'US', label: 'United States' },
          { value: 'GB', sample: 'GB', label: 'United Kingdom' },
          { value: 'CA', sample: 'CA', label: 'Canada' },
          { value: 'AU', sample: 'AU', label: 'Australia' },
          { value: 'DE', sample: 'DE', label: 'Germany' },
          { value: 'FR', sample: 'FR', label: 'France' },
          { value: 'ES', sample: 'ES', label: 'Spain' },
          { value: 'IT', sample: 'IT', label: 'Italy' },
          { value: 'JP', sample: 'JP', label: 'Japan' },
          { value: 'BR', sample: 'BR', label: 'Brazil' },
          { value: 'MX', sample: 'MX', label: 'Mexico' },
          { value: 'IN', sample: 'IN', label: 'India' },
          { value: 'NL', sample: 'NL', label: 'Netherlands' },
          { value: 'SE', sample: 'SE', label: 'Sweden' },
          { value: 'NO', sample: 'NO', label: 'Norway' },
          { value: 'DK', sample: 'DK', label: 'Denmark' },
          { value: 'FI', sample: 'FI', label: 'Finland' },
          { value: 'PL', sample: 'PL', label: 'Poland' },
          { value: 'RU', sample: 'RU', label: 'Russia' },
          { value: 'CN', sample: 'CN', label: 'China' },
          { value: 'KR', sample: 'KR', label: 'South Korea' },
          { value: 'AR', sample: 'AR', label: 'Argentina' },
          { value: 'CL', sample: 'CL', label: 'Chile' },
          { value: 'CO', sample: 'CO', label: 'Colombia' },
          { value: 'IE', sample: 'IE', label: 'Ireland' },
          { value: 'NZ', sample: 'NZ', label: 'New Zealand' },
          { value: 'ZA', sample: 'ZA', label: 'South Africa' },
          { value: 'PT', sample: 'PT', label: 'Portugal' },
          { value: 'AT', sample: 'AT', label: 'Austria' },
          { value: 'BE', sample: 'BE', label: 'Belgium' },
          { value: 'CH', sample: 'CH', label: 'Switzerland' }
        ],
        helpText: 'Select a country to get top charts for (required when Chart Type is "By Country")'
      },
      {
        key: 'genres',
        label: 'Genres',
        type: 'string',
        required: false,
        list: true,
        choices: GENRE_CHOICES,
        helpText: 'Select one or more genres to get top charts for (required when Chart Type is "By Genre")'
      },
      {
        key: 'limit',
        label: 'Maximum Results',
        type: 'integer',
        default: '25',
        required: false,
        helpText: 'Maximum number of chart items to return (1-100). Default is 25.'
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
