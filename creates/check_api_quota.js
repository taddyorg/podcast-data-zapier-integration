const { makeGraphQLRequest } = require('../utils/api');

const perform = async (z, bundle) => {
  const query = `
    query {
      getApiRequestsRemaining
    }
  `;

  const response = await makeGraphQLRequest(query, {}, z, bundle);
  const requestsRemaining = response.data.getApiRequestsRemaining || 0;

  return {
    id: `api_quota_${Date.now()}`,
    requestsRemaining,
    timestamp: Date.now(),
    message: `You have ${requestsRemaining} API requests remaining this month`
  };
};

module.exports = {
  key: 'check_api_quota',
  noun: 'API Quota',
  display: {
    label: 'Check API Requests Remaining',
    description: 'Check your remaining API request quota for the current month. Useful for conditional logic in workflows.'
  },
  operation: {
    perform: perform,

    // No input fields needed
    inputFields: [],

    // Sample output
    sample: {
      id: 'api_quota_1699999999000',
      requestsRemaining: 5000,
      timestamp: 1699999999000,
      message: 'You have 5000 API requests remaining this month'
    },

    // Output fields
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'requestsRemaining', label: 'Requests Remaining', type: 'integer' },
      { key: 'timestamp', label: 'Timestamp', type: 'integer' },
      { key: 'message', label: 'Message' }
    ]
  }
};
