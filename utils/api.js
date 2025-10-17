/**
 * Main GraphQL request function
 * Makes a POST request to Taddy API with the given query and variables
 */
const makeGraphQLRequest = async (query, variables, z, bundle) => {
  const response = await z.request({
    url: 'https://api.taddy.org',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-USER-ID': bundle.authData.userId,
      'X-API-KEY': bundle.authData.apiKey
    },
    body: {
      query,
      variables
    }
  });

  // Handle GraphQL errors
  if (response.data.errors) {
    const errorMessages = response.data.errors.map(e => e.message).join(', ');
    throw new z.errors.Error(
      `GraphQL Error: ${errorMessages}`,
      'GraphQLError',
      400
    );
  }

  return response.data;
};

/**
 * Helper to parse date strings to Unix timestamps
 * Supports formats: YYYY-MM-DD, YYYY-MM-DD HH:MM:SS, ISO 8601
 */
const parseDate = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }

  return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp
};

/**
 * Helper to validate UUID format
 */
const isValidUuid = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Helper to expand genre selections to include all subgenres
 * Maps parent genres to their complete hierarchy
 */
const expandGenres = (selectedGenres, genreHierarchy) => {
  const expandedGenres = new Set();

  selectedGenres.forEach(genre => {
    if (genreHierarchy[genre]) {
      // This is a parent genre, add all subgenres
      genreHierarchy[genre].forEach(subgenre => expandedGenres.add(subgenre));
    } else {
      // This is already a specific genre
      expandedGenres.add(genre);
    }
  });

  return Array.from(expandedGenres);
};

module.exports = {
  makeGraphQLRequest,
  parseDate,
  isValidUuid,
  expandGenres
};
