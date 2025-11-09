const { makeGraphQLRequest } = require('../utils/api');

const perform = async (z, bundle) => {
  const query = `
    query {
      getTranscriptCreditsRemaining
    }
  `;

  const response = await makeGraphQLRequest(query, {}, z, bundle);
  const creditsRemaining = response.data.getTranscriptCreditsRemaining || 0;

  return {
    id: `transcript_credits_${Date.now()}`,
    creditsRemaining,
    timestamp: Date.now(),
    message: `You have ${creditsRemaining} transcript credits remaining`
  };
};

module.exports = {
  key: 'check_transcript_credits',
  noun: 'Transcript Credits',
  display: {
    label: 'Check Transcript Credits Remaining',
    description: 'Check your remaining transcript generation credits. Useful for conditional logic before generating transcripts.'
  },
  operation: {
    perform: perform,

    // No input fields needed
    inputFields: [],

    // Sample output
    sample: {
      id: 'transcript_credits_1699999999000',
      creditsRemaining: 250,
      timestamp: 1699999999000,
      message: 'You have 250 transcript credits remaining'
    },

    // Output fields
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'creditsRemaining', label: 'Credits Remaining', type: 'integer' },
      { key: 'timestamp', label: 'Timestamp', type: 'integer' },
      { key: 'message', label: 'Message' }
    ]
  }
};
