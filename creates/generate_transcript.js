const { makeGraphQLRequest, isValidUuid } = require('../utils/api');
const {
  EPISODE_WITH_TRANSCRIPT_FRAGMENT,
  EPISODE_WITH_DETAILED_TRANSCRIPT_FRAGMENT,
  TRANSCRIPT_STYLE_CHOICES
} = require('../utils/constants');

// Generate transcript for an episode
const perform = async (z, bundle) => {
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

  const includeDetailed = bundle.inputData.include_detailed || false;
  const transcriptStyle = bundle.inputData.transcript_style || 'PARAGRAPH';

  let query;
  let variables;

  if (includeDetailed) {
    // Detailed transcript with speakers and timecodes
    query = `
      query GetEpisodeTranscript($uuid: ID!, $style: TranscriptItemStyle!) {
        getPodcastEpisode(uuid: $uuid) {
          ${EPISODE_WITH_DETAILED_TRANSCRIPT_FRAGMENT}
        }
      }
    `;
    variables = { uuid: episodeUuid, style: transcriptStyle };
  } else {
    // Basic transcript (just text paragraphs)
    query = `
      query GetEpisodeTranscript($uuid: ID!) {
        getPodcastEpisode(uuid: $uuid) {
          ${EPISODE_WITH_TRANSCRIPT_FRAGMENT}
        }
      }
    `;
    variables = { uuid: episodeUuid };
  }

  const response = await makeGraphQLRequest(query, variables, z, bundle);

  const episode = response.data?.getPodcastEpisode;

  if (!episode) {
    throw new z.errors.Error(
      `Episode not found with UUID: ${episodeUuid}`,
      'NotFound',
      404
    );
  }

  // Build response object
  const result = {
    id: episode.uuid,
    uuid: episode.uuid,
    name: episode.name || 'Unknown',
    description: episode.description || '',
    audioUrl: episode.audioUrl || '',
    imageUrl: episode.imageUrl || '',
    datePublished: episode.datePublished,
    duration: episode.duration,
    episodeNumber: episode.episodeNumber,
    seasonNumber: episode.seasonNumber,
    fileType: episode.fileType || '',
    podcastSeries: episode.podcastSeries || {}
  };

  if (includeDetailed) {
    // Detailed transcript with speaker info and timecodes
    const transcriptItems = episode.transcriptWithSpeakersAndTimecodes || [];
    result.transcriptItems = transcriptItems;
    result.transcriptItemsCount = transcriptItems.length;
    result.transcript = transcriptItems.map(item => item.text).join('\n');
  } else {
    // Basic transcript (array of paragraphs/utterances)
    const transcript = episode.transcript || [];
    result.transcript = Array.isArray(transcript) ? transcript.join('\n') : transcript;
    result.transcriptItemsCount = Array.isArray(transcript) ? transcript.length : 0;
  }

  return result;
};

module.exports = {
  key: 'generate_transcript',
  noun: 'Transcript',
  display: {
    label: 'Generate Episode Transcript',
    description: 'Generate a transcript for a podcast episode. Uses API transcript credits.'
  },

  operation: {
    inputFields: [
      {
        key: 'episode_uuid',
        label: 'Episode UUID',
        type: 'string',
        required: true,
        placeholder: 'e.g., 123e4567-e89b-12d3-a456-426614174000',
        helpText: 'The unique identifier of the episode. Get this from episode search results or other operations. **Note: This operation uses transcript credits from your Taddy API account.**'
      },
      {
        key: 'include_detailed',
        label: 'Include Speakers and Timecodes',
        type: 'boolean',
        default: 'false',
        required: false,
        helpText: 'When enabled, includes speaker names and start/end timecodes for each transcript segment.'
      },
      {
        key: 'transcript_style',
        label: 'Transcript Style',
        type: 'string',
        required: false,
        choices: TRANSCRIPT_STYLE_CHOICES,
        helpText: 'How to format transcript items. Paragraph groups text by paragraphs, Utterance shows individual utterances. Only applies when "Include Speakers and Timecodes" is enabled.'
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
      },
      transcript: 'Welcome to episode 42. Today we\'re talking about AI...',
      transcriptItemsCount: 150
    }
  }
};
