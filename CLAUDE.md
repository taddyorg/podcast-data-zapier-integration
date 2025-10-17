# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Zapier integration for the Taddy Podcast API, enabling users to automate podcast workflows using 4M+ podcasts and 180M+ episodes. The integration connects Zapier with Taddy's GraphQL API to provide triggers, searches, and actions for podcast data extraction, search, and transcript generation.

## Taddy API Documentation
- [Taddy API Docs](https://taddy.org/developers/podcast-api)
- [GraphQL Schema](https://ax0.taddy.org/docs/schema.graphql)
- [n8n Integration Reference](./n8n-reference/) - Previous work on n8n integration

## Development Environment

### Prerequisites
- Node.js >= 18
- Zapier CLI: `npm install -g zapier-platform-cli`
- Taddy API account with User ID and API Key

### Common Commands
```bash
zapier init                     # Initialize new Zapier integration
zapier test                     # Run tests
zapier validate                 # Validate integration structure
zapier push                     # Deploy to Zapier platform
zapier logs --type=http         # View HTTP logs
zapier env:set 1.0.0 KEY=value  # Set environment variables
```

## Architecture

### Project Structure
```
.
├── authentication.js           # API Key auth (userId + apiKey)
├── index.js                   # Main entry point & app definition
├── triggers/
│   ├── new_episode.js         # [FUTURE] REST hook for new episodes
│   └── new_episode_polling.js # Polling trigger for new episodes
├── searches/
│   ├── search_podcasts.js     # Search podcasts with filters
│   ├── search_episodes.js     # Search episodes with filters
│   ├── find_podcast.js        # Find podcast by UUID/name/RSS/iTunes
│   └── find_episode.js        # Find episode by UUID/name
├── creates/
│   └── generate_transcript.js # Generate episode transcript
├── utils/
│   ├── api.js                 # GraphQL request helpers
│   ├── constants.js           # Genres, languages, fragments
│   └── helpers.js             # Shared utilities
├── test/
│   └── *.test.js              # Test files
├── package.json
└── .zapierapprc               # Zapier config
```

### Zapier Integration Components

**Authentication:**
- Type: API Key
- Fields: `userId` (string) and `apiKey` (password)
- Test: GraphQL query `getApiRequestsRemaining`
- Headers: `X-USER-ID` and `X-API-KEY`

**Triggers (initiate Zaps when events occur):**
1. **New Episode Polling** - Poll `getLatestPodcastEpisodes()` every 1-15 min
   - Returns episodes in reverse chronological order
   - Deduplication via episode UUID
   - Users specify podcast UUIDs to monitor

2. **[FUTURE] New Episode Webhook** - REST hook for instant notifications
   - Status: PLACEHOLDER ONLY - Do not implement yet
   - Reason: Webhooks lack filtering; thousands of episodes/hour would overwhelm accounts
   - Timeline: Filtering feature coming end of 2024 (Danny building)
   - Implementation: Create file structure but stub out functionality

**Searches (find data, return arrays):**
1. **Search Podcasts** - `search()` with PODCASTSERIES filter
   - Advanced filters: genres, languages, date ranges, content type
   - Limit: ~25 results (Zapier doesn't support pagination)

2. **Search Episodes** - `search()` with PODCASTEPISODE filter
   - Advanced filters: genres, languages, date ranges, duration
   - Limit: ~25 results

3. **Find Podcast** - `getPodcastSeries()`
   - Input options: UUID, name, RSS URL, or iTunes ID
   - Returns single podcast or empty array

4. **Find Episode** - `getPodcastEpisode()`
   - Input options: UUID, GUID, or name (with podcast name)
   - Returns single episode or empty array

**Actions (create/modify data, return objects):**
1. **Generate Transcript** - `getEpisodeTranscript()`
   - Input: Episode UUID
   - Optional: Transcript style (PARAGRAPH or UTTERANCE)
   - Returns: Transcript with speaker info and timecodes
   - Note: Uses API transcript credits

## GraphQL API Integration

### API Endpoint
- Base URL: `https://api.taddy.org`
- Method: POST
- Content-Type: `application/json`

### Authentication Headers
```javascript
{
  'Content-Type': 'application/json',
  'X-USER-ID': bundle.authData.userId,
  'X-API-KEY': bundle.authData.apiKey
}
```

### Request Structure
```javascript
{
  query: `query QueryName($var: Type) { ... }`,
  variables: {
    var: value
  }
}
```

### GraphQL Query Pattern
All operations follow this pattern:
1. Build GraphQL query string with variables
2. Call `makeGraphQLRequest(query, variables, z, bundle)`
3. Extract data from response
4. Return formatted results

### Shared Utilities (`utils/api.js`)

```javascript
// Main GraphQL request function with retry logic
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
    throw new z.errors.Error(
      response.data.errors.map(e => e.message).join(', '),
      'GraphQLError',
      400
    );
  }

  return response.data;
};
```

### GraphQL Fragments (from n8n reference)
Reuse these fragments from `n8n-reference/nodes/TaddyPodcast/constants.ts`:
- `PODCAST_SERIES_EXTENDED_FRAGMENT` - Full podcast details
- `PODCAST_SERIES_FRAGMENT` - Basic podcast info
- `EPISODE_EXTENDED_FRAGMENT` - Full episode details
- `EPISODE_FRAGMENT` - Basic episode info
- `EPISODE_WITH_TRANSCRIPT_FRAGMENT` - Episode with transcript

## Webhook Implementation (FUTURE)

### Current Status: PLACEHOLDER ONLY ⚠️
**DO NOT IMPLEMENT WEBHOOK TRIGGERS YET**

### Why Placeholder?
- Taddy webhooks currently have no filtering capability
- Thousands of podcasts update every hour
- Without filtering, Zapier accounts would be overwhelmed with triggers
- Danny is building webhook filtering feature (ETA: end of 2024)

### Webhook Event Types (for future reference)
From Taddy API, these webhook events are available:
- `podcastepisode.created` - New episode published
- `podcastepisode.updated` - Episode details updated
- `podcastepisode.deleted` - Episode removed
- `podcastseries.created` - New podcast added
- `podcastseries.updated` - Podcast details updated
- `podcastseries.deleted` - Podcast removed

### Webhook Payload Structure (for future reference)
```javascript
{
  uuid: 'webhook-event-uuid',
  taddyType: 'podcastepisode', // or 'podcastseries'
  action: 'created', // or 'updated', 'deleted'
  timestamp: 1684448992,
  data: {
    // Full episode or podcast object
  }
}
```

### Webhook Security
- Header: `X-TADDY-WEBHOOK-SECRET` contains webhook secret
- Verify this header matches user's webhook secret for security

### Future Implementation Plan
When filtering is available:
1. Add REST hook trigger for "New Episode"
2. Subscribe/unsubscribe logic via Taddy dashboard (manual for now)
3. Handle webhook payloads
4. Filter by podcast UUID (when API supports it)
5. Deduplication via episode UUID

### Placeholder File Structure
Create `triggers/new_episode.js` with:
```javascript
// PLACEHOLDER: Webhook trigger for new episodes
// TODO: Implement when Taddy API adds webhook filtering (ETA: end of 2024)
// See CLAUDE.md for implementation details

module.exports = {
  key: 'new_episode',
  noun: 'Episode',
  display: {
    label: 'New Episode (Webhook)',
    description: 'Triggers when a new podcast episode is published. (Coming soon - requires webhook filtering)'
  },
  operation: {
    type: 'hook',
    perform: async (z, bundle) => {
      // TODO: Implement webhook handling
      throw new z.errors.Error(
        'Webhook triggers not yet available. Please use the polling trigger.',
        'NotImplemented',
        501
      );
    },
    performSubscribe: async (z, bundle) => {
      // TODO: Implement webhook subscription
      throw new z.errors.Error(
        'Webhook triggers not yet available.',
        'NotImplemented',
        501
      );
    },
    performUnsubscribe: async (z, bundle) => {
      // TODO: Implement webhook unsubscription
      throw new z.errors.Error(
        'Webhook triggers not yet available.',
        'NotImplemented',
        501
      );
    }
  }
};
```

## Data Models

### PodcastSeries
```javascript
{
  uuid: string,
  name: string,
  description: string,
  imageUrl: string,
  rssUrl: string,
  itunesId: number,
  language: string,
  totalEpisodesCount: number,
  authorName: string,
  websiteUrl: string,
  genres: string[],
  popularityRank: number,
  itunesInfo: {
    uuid: string,
    baseArtworkUrlOf: string,
    summary: string
  }
}
```

### PodcastEpisode
```javascript
{
  uuid: string,
  name: string,
  description: string,
  audioUrl: string,
  imageUrl: string,
  datePublished: number,        // Unix timestamp
  duration: number,              // Seconds
  episodeNumber: number,
  seasonNumber: number,
  transcriptUrls: string[],
  fileType: string,
  podcastSeries: {
    uuid: string,
    name: string,
    imageUrl: string
  }
}
```

## Zapier-Specific Patterns

### Trigger Pattern
```javascript
const perform = async (z, bundle) => {
  // Build GraphQL query
  const query = `...`;
  const variables = { ... };

  // Make API request
  const response = await makeGraphQLRequest(query, variables, z, bundle);

  // Extract and return items in reverse chronological order
  const items = response.data.items || [];

  // Return array for deduplication (Zapier uses id field)
  return items.map(item => ({
    id: item.uuid,
    ...item
  }));
};
```

### Search Pattern
```javascript
const perform = async (z, bundle) => {
  // Get search parameters from bundle.inputData
  const searchTerm = bundle.inputData.searchTerm;

  // Build GraphQL query
  const query = `...`;
  const variables = { term: searchTerm };

  // Make API request
  const response = await makeGraphQLRequest(query, variables, z, bundle);

  // Return array (empty array if no results)
  return response.data.items || [];
};
```

### Action Pattern
```javascript
const perform = async (z, bundle) => {
  // Get parameters from bundle.inputData
  const episodeUuid = bundle.inputData.episodeUuid;

  // Build GraphQL query
  const query = `...`;
  const variables = { episodeUuid };

  // Make API request
  const response = await makeGraphQLRequest(query, variables, z, bundle);

  // Return single object with created/updated data
  return {
    id: response.data.episode.uuid,
    ...response.data.episode
  };
};
```

### Error Handling
```javascript
try {
  const response = await makeGraphQLRequest(query, variables, z, bundle);
  // ...
} catch (error) {
  if (error.message.includes('unauthorized')) {
    throw new z.errors.RefreshAuthError('Authentication failed');
  }
  throw new z.errors.Error(`API Error: ${error.message}`);
}
```

## Input Fields & Filters

### Common Input Fields
From n8n reference, these are the key filter options users expect:

**Podcast Filters:**
- Genres (multi-select from GENRE_OPTIONS)
- Languages (multi-select from LANGUAGE_OPTIONS)
- Content Type (audio/video)
- Safe Mode (boolean)
- Date ranges (publishedAfter, publishedBefore)
- Episode count ranges

**Episode Filters:**
- Genres (inherited from podcast)
- Languages (inherited from podcast)
- Date ranges (publishedAfter, publishedBefore)
- Duration ranges (min/max seconds)
- Has transcript (boolean)

**Search Behavior:**
- Match Strategy: ALL_TERMS, EXACT_PHRASE, MOST_TERMS
- Sort By: EXACTNESS (relevance), POPULARITY

### Constants to Copy
Copy these from `n8n-reference/nodes/TaddyPodcast/constants.ts`:
- `GENRE_OPTIONS` - All podcast genres
- `LANGUAGE_OPTIONS` - All supported languages
- `COUNTRY_OPTIONS` - Countries for top charts
- `PODCAST_CONTENT_TYPE_OPTIONS` - Audio/Video
- `GENRE_HIERARCHY` - Parent genres with subgenres

## Testing

### Test Pattern
```javascript
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('Search Podcasts', () => {
  it('should find podcasts', async () => {
    const bundle = {
      authData: {
        userId: process.env.TEST_USER_ID,
        apiKey: process.env.TEST_API_KEY
      },
      inputData: {
        searchTerm: 'javascript'
      }
    };

    const results = await appTester(App.searches.search_podcasts.operation.perform, bundle);
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
  });
});
```

### Environment Variables
```bash
# .env for testing
TEST_USER_ID=your-user-id
TEST_API_KEY=your-api-key
```

## Deployment & Publishing

### Version Management
```bash
zapier versions              # List all versions
zapier push                  # Push new version
zapier promote 1.0.1         # Promote version to production
zapier migrate 1.0.0 1.0.1   # Migrate users between versions
```

### Pre-Deployment Checklist
1. All tests passing: `zapier test`
2. Validation clean: `zapier validate`
3. Manual testing in Zapier editor
4. Error handling implemented
5. User-facing descriptions clear
6. Sample data provided for all operations

## Development Workflow

### Adding New Search Operation
1. Create file in `searches/` directory
2. Define input fields (use `utils/constants.js` for options)
3. Build GraphQL query
4. Implement `perform` function using `makeGraphQLRequest`
5. Add to `index.js` searches
6. Write tests in `test/`
7. Test in Zapier editor

### Adding New Action Operation
1. Create file in `creates/` directory
2. Define input fields
3. Build GraphQL mutation/query
4. Implement `perform` function
5. Return object with created/updated data
6. Add to `index.js` creates
7. Write tests

### Updating from n8n Reference
When adding operations, reference the n8n implementation:
1. Find equivalent in `n8n-reference/nodes/TaddyPodcast/queries/`
2. Extract GraphQL query
3. Extract input field definitions
4. Convert n8n field format to Zapier format
5. Adapt handler logic to Zapier's `perform` pattern

## Known Limitations

1. **No Pagination**: Zapier searches don't support pagination
   - Limit results to ~25 items
   - Skip batch operations (getMultiplePodcasts, getMultipleEpisodes)

2. **No Webhook Filtering** (current)
   - Webhook triggers are placeholders only
   - Will implement when Taddy adds filtering (end 2024)

3. **GraphQL in REST World**
   - Zapier examples focus on REST APIs
   - We POST GraphQL as JSON body
   - Some Zapier features (like automatic pagination) don't apply

4. **Transcript Credits**
   - `getEpisodeTranscript()` uses API transcript credits
   - Make this clear in action description
   - Users should monitor credit usage

## Resources

- [Zapier Platform CLI Docs](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)
- [Zapier Platform Schema](https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md)
- [Taddy API Docs](https://taddy.org/developers/podcast-api)
- [n8n Integration Reference](./n8n-reference/)

## Version History

* **1.0.0** (Planned) - Initial release
  - API Key authentication
  - Polling trigger: New Episode
  - Searches: Podcasts, Episodes, Find Podcast, Find Episode
  - Action: Generate Transcript
  - Webhook triggers: Placeholder only

* **1.1.0** (Future) - Webhook filtering release
  - Implement REST hook triggers for new episodes
  - Requires Taddy API webhook filtering feature
