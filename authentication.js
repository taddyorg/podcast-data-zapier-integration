const testAuth = async (z, bundle) => {
  // Test authentication by calling getApiRequestsRemaining query
  const query = `
    query {
      getApiRequestsRemaining
    }
  `;

  const response = await z.request({
    url: 'https://api.taddy.org',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-USER-ID': bundle.authData.userId,
      'X-API-KEY': bundle.authData.apiKey
    },
    body: {
      query
    }
  });

  // Handle GraphQL errors
  if (response.data.errors) {
    throw new z.errors.Error(
      `Authentication failed: ${response.data.errors.map(e => e.message).join(', ')}`,
      'AuthenticationError',
      401
    );
  }

  // Return the API requests remaining as confirmation
  return {
    apiRequestsRemaining: response.data.data.getApiRequestsRemaining
  };
};

module.exports = {
  type: 'custom',
  fields: [
    {
      key: 'userId',
      label: 'User ID',
      required: true,
      type: 'string',
      helpText: 'Your Taddy API User ID. Get it from your [Taddy Dashboard](https://taddy.org/dashboard).'
    },
    {
      key: 'apiKey',
      label: 'API Key',
      required: true,
      type: 'password',
      helpText: 'Your Taddy API Key. Get it from your [Taddy Dashboard](https://taddy.org/dashboard).'
    }
  ],
  test: testAuth,
  connectionLabel: '{{apiRequestsRemaining}} API requests remaining'
};
