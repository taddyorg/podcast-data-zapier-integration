const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const { EPISODE_EXTENDED_FRAGMENT } = require('../utils/constants');

// Find a specific episode by UUID or by searching within a podcast
const perform = async (z, bundle) => {
  const inputType = bundle.inputData.input_type || 'uuid';

  if (inputType === 'uuid') {
    // Direct episode lookup by UUID
    const episodeUuid = bundle.inputData.episode_uuid;

    if (!episodeUuid) {
      throw new z.errors.Error('Episode UUID is required', 'InvalidInput', 400);
    }

    if (!isValidUuid(episodeUuid)) {
      throw new z.errors.Error(
        `Invalid UUID format: ${episodeUuid}. UUID must be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
        'InvalidInput',
        400
      );
    }

    const query = `
      query GetPodcastEpisode($uuid: ID!) {
        getPodcastEpisode(uuid: $uuid) {
          ${EPISODE_EXTENDED_FRAGMENT}
          podcastSeries {
            uuid
            name
            imageUrl
          }
        }
      }
    `;

    const variables = { uuid: episodeUuid };
    const response = await makeGraphQLRequest(query, variables, z, bundle);

    const episode = response.data?.getPodcastEpisode;

    if (!episode) {
      return [];
    }

    // Zapier searches must return an array
    return [{
      id: episode.uuid,
      ...episode
    }];

  } else {
    // Search for episode by name within a specific podcast
    const podcastUuid = bundle.inputData.podcast_uuid;
    const episodeName = bundle.inputData.episode_name;

    if (!podcastUuid) {
      throw new z.errors.Error('Podcast UUID is required when searching by episode name', 'InvalidInput', 400);
    }

    if (!isValidUuid(podcastUuid)) {
      throw new z.errors.Error(
        `Invalid podcast UUID format: ${podcastUuid}. UUID must be in format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`,
        'InvalidInput',
        400
      );
    }

    if (!episodeName) {
      throw new z.errors.Error('Episode name is required', 'InvalidInput', 400);
    }

    // Search for episode within the podcast by name
    const query = `
      query GetPodcastSeries($uuid: ID!, $searchTerm: String!) {
        getPodcastSeries(uuid: $uuid) {
          uuid
          name
          imageUrl
          episodes(sortOrder: SEARCH, limitPerPage: 1, searchTerm: $searchTerm) {
            ${EPISODE_EXTENDED_FRAGMENT}
          }
        }
      }
    `;

    const variables = {
      uuid: podcastUuid,
      searchTerm: episodeName
    };

    const response = await makeGraphQLRequest(query, variables, z, bundle);

    const podcast = response.data?.getPodcastSeries;

    if (!podcast || !podcast.episodes || podcast.episodes.length === 0) {
      return [];
    }

    const episode = podcast.episodes[0];

    // Add podcast info to episode
    return [{
      id: episode.uuid,
      ...episode,
      podcastSeries: {
        uuid: podcast.uuid,
        name: podcast.name,
        imageUrl: podcast.imageUrl
      }
    }];
  }
};

module.exports = {
  key: 'find_episode',
  noun: 'Episode',
  display: {
    label: 'Find Episode',
    description: 'Find a specific episode by UUID or by searching within a podcast by episode name.'
  },

  operation: {
    inputFields: [
      {
        key: 'input_type',
        label: 'Find By',
        type: 'string',
        choices: [
          { value: 'uuid', sample: 'uuid', label: 'Episode UUID (direct lookup)' },
          { value: 'name', sample: 'name', label: 'Episode Name (search within podcast)' }
        ],
        default: 'uuid',
        required: true,
        helpText: 'Choose how you want to find the episode'
      },
      {
        key: 'episode_uuid',
        label: 'Episode UUID',
        type: 'string',
        placeholder: '123e4567-e89b-12d3-a456-426614174000',
        helpText: 'The unique identifier of the episode (from search results or other operations)',
        required: false
      },
      {
        key: 'podcast_uuid',
        label: 'Podcast UUID',
        type: 'string',
        placeholder: 'cb8d858a-3ef4-4645-8942-67e55c0927f2',
        helpText: 'The unique identifier of the podcast to search within (required when searching by episode name)',
        required: false
      },
      {
        key: 'episode_name',
        label: 'Episode Name',
        type: 'string',
        placeholder: 'Episode 1: The Beginning',
        helpText: 'The name/title of the episode to search for within the specified podcast',
        required: false
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
