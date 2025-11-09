const authentication = require('./authentication');

// Implemented
const findPodcast = require('./searches/find_podcast');
const searchPodcasts = require('./searches/search_podcasts');
const findEpisode = require('./searches/find_episode');
const searchEpisodes = require('./searches/search_episodes');
const getEpisodes = require('./searches/get_episodes');
const getPopularPodcasts = require('./searches/get_popular_podcasts');
const getTopCharts = require('./searches/get_top_charts');
const getMultiplePodcasts = require('./searches/get_multiple_podcasts');
const getMultipleEpisodes = require('./searches/get_multiple_episodes');
const generateTranscript = require('./creates/generate_transcript');
const checkApiQuota = require('./creates/check_api_quota');
const checkTranscriptCredits = require('./creates/check_transcript_credits');
const newEpisodePoll = require('./triggers/new_episode_polling');
const newEpisodeWebhook = require('./triggers/new_episode_webhook');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  triggers: {
    [newEpisodePoll.key]: newEpisodePoll,
    [newEpisodeWebhook.key]: newEpisodeWebhook
  },

  searches: {
    [findPodcast.key]: findPodcast,
    [searchPodcasts.key]: searchPodcasts,
    [findEpisode.key]: findEpisode,
    [searchEpisodes.key]: searchEpisodes,
    [getEpisodes.key]: getEpisodes,
    [getPopularPodcasts.key]: getPopularPodcasts,
    [getTopCharts.key]: getTopCharts,
    [getMultiplePodcasts.key]: getMultiplePodcasts,
    [getMultipleEpisodes.key]: getMultipleEpisodes
  },

  creates: {
    [generateTranscript.key]: generateTranscript,
    [checkApiQuota.key]: checkApiQuota,
    [checkTranscriptCredits.key]: checkTranscriptCredits
  }
};
