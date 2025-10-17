# Taddy Podcast API - Zapier Integration

Zapier integration for [Taddy Podcast API](https://taddy.org/developers/podcast-api) - access 4M+ podcasts and 180M+ episodes with automated workflows.

## Features

- **Authentication** - API Key (User ID + API Key)
- **Searches** - Find podcasts by UUID, name, RSS URL, or iTunes ID
- **Actions** - Generate episode transcripts (coming soon)
- **Triggers** - New episodes via polling (coming soon)
- **Future** - Webhook triggers when filtering is available

## Project Status

### ✅ Completed
- [x] Project structure and setup
- [x] Authentication (API Key with userId + apiKey)
- [x] GraphQL utility functions
- [x] Constants from n8n integration
- [x] Find Podcast search (by UUID/name/RSS/iTunes ID)

### 🚧 In Progress (Next Steps)
- [ ] Search Podcasts (with filters)
- [ ] Generate Transcript action
- [ ] New Episode polling trigger
- [ ] Webhook placeholder (for future when filtering available)
- [ ] Search Episodes
- [ ] Find Episode
- [ ] Tests

### 📋 Future Enhancements
- [ ] REST Hook triggers (when Taddy adds webhook filtering)
- [ ] Get Top Charts
- [ ] Get Popular Podcasts
- [ ] Get Episode Chapters

## Prerequisites

- Node.js >= 18
- npm >= 9
- Taddy API account ([sign up](https://taddy.org/signup/developers))
- Zapier CLI: `npm install -g zapier-platform-cli`

## Installation

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Development

### Project Structure

```
.
├── authentication.js           # API Key auth (userId + apiKey)
├── index.js                   # Main entry point
├── triggers/
│   ├── new_episode_polling.js # Polling trigger (to be implemented)
│   └── new_episode.js         # Webhook trigger (placeholder)
├── searches/
│   ├── find_podcast.js        # Find podcast ✅
│   ├── search_podcasts.js     # Search with filters (to be implemented)
│   ├── search_episodes.js     # Search episodes (to be implemented)
│   └── find_episode.js        # Find episode (to be implemented)
├── creates/
│   └── generate_transcript.js # Generate transcript (to be implemented)
├── utils/
│   ├── api.js                 # GraphQL request helpers
│   ├── constants.js           # Genres, languages, fragments
│   └── helpers.js             # Shared utilities (to be added)
├── test/                      # Tests (to be added)
├── package.json
└── CLAUDE.md                  # Implementation guide
```

### Authentication

The integration uses API Key authentication with two fields:
- **User ID** - Your Taddy API User ID
- **API Key** - Your Taddy API Key

Get both from your [Taddy Dashboard](https://taddy.org/dashboard).

Authentication is tested via the `getApiRequestsRemaining` GraphQL query.

### GraphQL API

All operations use GraphQL queries sent to `https://api.taddy.org`:

```javascript
const response = await z.request({
  url: 'https://api.taddy.org',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-USER-ID': bundle.authData.userId,
    'X-API-KEY': bundle.authData.apiKey
  },
  body: {
    query: `query { ... }`,
    variables: { ... }
  }
});
```

### Implemented Operations

#### Find Podcast (Search)
Find a specific podcast by:
- UUID (unique identifier)
- Name (returns most popular if multiple matches)
- RSS URL (feed URL)
- iTunes ID (Apple Podcasts ID)

**File:** `searches/find_podcast.js`

**Usage:**
```javascript
{
  input_type: 'name',
  podcast_name: 'This American Life'
}
```

Returns array with single podcast or empty array if not found.

### Zapier CLI Commands

```bash
# Install Zapier CLI globally
npm install -g zapier-platform-cli

# Authenticate with Zapier
zapier login

# Test locally
zapier test

# Validate integration
zapier validate

# Deploy to Zapier (when ready)
zapier push

# View logs
zapier logs --type=http
```

## Implementation Guide

See `CLAUDE.md` for comprehensive implementation guide including:
- Architecture details
- GraphQL patterns
- Webhook implementation plan (future)
- Data models
- Adding new operations

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Webhook Triggers (Future)

⚠️ **Webhook triggers are currently placeholder only** ⚠️

**Why?** Taddy webhooks don't yet support filtering. Without filtering, thousands of episodes publish hourly which would overwhelm Zapier accounts.

**Timeline:** Danny is building webhook filtering (ETA: end of 2024). We'll implement REST hook triggers once available.

**Webhook events available (for future):**
- `podcastepisode.created` - New episode published
- `podcastepisode.updated` - Episode details updated
- `podcastseries.created` - New podcast added
- `podcastseries.updated` - Podcast details updated

See `CLAUDE.md` for webhook implementation details.

## Reference

This integration is based on the [n8n integration](./n8n-reference/) built by Taddy. Key differences:

| Feature | n8n | Zapier |
|---------|-----|--------|
| Language | TypeScript | JavaScript |
| API Style | Class-based | Function-based |
| Parameters | `context.getNodeParameter()` | `bundle.inputData` |
| Errors | `NodeOperationError` | `z.errors.Error` |
| Search Returns | Single object or array | Always array |

## Resources

- [Taddy API Docs](https://taddy.org/developers/podcast-api)
- [Taddy GraphQL Schema](https://ax0.taddy.org/docs/schema.graphql)
- [Zapier Platform CLI](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)
- [Zapier Platform Schema](https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md)
- [n8n Integration Reference](./n8n-reference/)

## License

MIT

## Contributing

1. Follow the patterns in `searches/find_podcast.js`
2. Reference n8n implementation for GraphQL queries
3. Add tests for new operations
4. Update this README
5. Submit PR to https://github.com/shimmer-labs/podcast-date-zapier-integration
