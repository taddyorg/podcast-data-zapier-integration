const authentication = require('./authentication');

// Implemented
const findPodcast = require('./searches/find_podcast');
const searchPodcasts = require('./searches/search_podcasts');
const searchEpisodes = require('./searches/search_episodes');
const getEpisodes = require('./searches/get_episodes');
const generateTranscript = require('./creates/generate_transcript');
const newEpisodePoll = require('./triggers/new_episode_polling');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  triggers: {
    [newEpisodePoll.key]: newEpisodePoll
  },

  searches: {
    [findPodcast.key]: findPodcast,
    [searchPodcasts.key]: searchPodcasts,
    [searchEpisodes.key]: searchEpisodes,
    [getEpisodes.key]: getEpisodes
  },

  creates: {
    [generateTranscript.key]: generateTranscript
  }
};
