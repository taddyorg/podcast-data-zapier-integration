# Taddy Podcast API - Zapier Integration

Automate podcast workflows with access to 4M+ podcasts and 180M+ episodes. Search, track, and extract podcast data using [Taddy's Podcast API](https://taddy.org/developers/podcast-api) directly in your Zaps.

## What You Can Do

- **Track new episodes** - Get notified when podcasts publish new episodes
- **Search podcasts** - Find podcasts by keywords, genre, language, and more
- **Search episodes** - Find specific episodes with advanced filters
- **Get transcripts** - Generate or retrieve episode transcripts automatically
- **Access charts** - Pull data from podcast top charts by country and genre
- **Batch operations** - Retrieve multiple podcasts or episodes in one request

## Installation

1. **In Zapier:** Search for "Taddy Podcast API" when creating a Zap
2. **Connect your account:** You'll need your Taddy API credentials:
   - User ID
   - API Key

Get your credentials at [taddy.org/dashboard](https://taddy.org/dashboard). No account? [Sign up here](https://taddy.org/signup/developers).

## Authentication

This integration uses API Key authentication with two credentials:

- **User ID** - Your Taddy API User ID (found in your dashboard)
- **API Key** - Your Taddy API Key (found in your dashboard)

Both are required to authenticate API requests.

## Available Operations

### Triggers

**New Episode Polling**
- Monitors specified podcasts for new episodes
- Checks every 1-15 minutes (configurable)
- Automatically deduplicates episodes by UUID
- Perfect for: Content curation, notifications, RSS alternatives

### Searches

**Find Podcast**
- Find a specific podcast by UUID, name, RSS URL, or iTunes ID
- Returns single podcast with full metadata
- Use for: Looking up known podcasts

**Search Podcasts**
- Full-text search across 4M+ podcasts
- Filters: genres, languages, content type, date ranges, popularity
- Returns up to 25 results
- Use for: Discovery, research, content planning

**Find Episode**
- Find a specific episode by UUID or name
- Requires podcast context (name or UUID)
- Returns single episode with metadata
- Use for: Looking up known episodes

**Search Episodes**
- Full-text search across 180M+ episodes
- Filters: genres, languages, date ranges, duration, transcripts
- Returns up to 25 results
- Use for: Content research, episode discovery

**Get Episodes for Podcast**
- Retrieve latest episodes from a specific podcast
- Input: UUID, name, RSS URL, or iTunes ID
- Returns episode list sorted by date
- Use for: Monitoring specific shows

**Get Popular Podcasts**
- Discover trending podcasts
- Filters: genre, language
- Sorted by popularity
- Use for: Discovery, trend analysis

**Get Top Charts**
- Access daily podcast charts
- Filter by country and genre
- Includes both podcast and episode charts
- Use for: Tracking rankings, trend analysis

**Get Multiple Podcasts**
- Batch retrieve multiple podcasts by UUIDs
- Efficient for bulk operations
- Use for: Processing lists of podcasts

**Get Multiple Episodes**
- Batch retrieve multiple episodes by UUIDs
- Efficient for bulk operations
- Use for: Processing episode lists

### Actions

**Generate Transcript**
- Extract or generate episode transcripts
- Includes speaker attribution and timecodes
- Choose between paragraph or utterance format
- **Note:** Generating transcripts uses Taddy API transcript credits

## Use Cases

**Content Curation**
- Monitor podcasts → Filter by keywords → Post to social media
- Track industry podcasts → Generate summaries → Send to Slack

**Research & Analysis**
- Search episodes → Extract transcripts → Analyze with AI
- Pull top charts → Store in spreadsheet → Track trends

**Notifications & Alerts**
- New episode trigger → Check criteria → Email/SMS notification
- Popular podcasts → Filter by genre → Add to CRM

**Data Enrichment**
- Import podcast list → Batch lookup → Enrich database
- RSS URLs → Find podcast metadata → Update records

## API Rate Limits

Taddy API uses a monthly request quota. Check your usage at [taddy.org/dashboard](https://taddy.org/dashboard).

**Transcript generation** consumes transcript credits separately from API requests. Monitor your credit balance to avoid interruptions.

## Support & Resources

- **Taddy API Documentation:** [taddy.org/developers/podcast-api](https://taddy.org/developers/podcast-api)
- **GraphQL Schema:** [ax0.taddy.org/docs/schema.graphql](https://ax0.taddy.org/docs/schema.graphql)
- **Support:** Contact Taddy support or visit [taddy.org](https://taddy.org)
- **GitHub Repository:** [github.com/taddyorg/podcast-data-zapier-integration](https://github.com/taddyorg/podcast-data-zapier-integration)

## Development

Interested in contributing? See [CLAUDE.md](CLAUDE.md) for development documentation and architecture details.

For submission requirements, see [docs/SUBMISSION_CHECKLIST.md](docs/SUBMISSION_CHECKLIST.md).

## License

MIT

---

**About Taddy:** Taddy provides comprehensive podcast data through a GraphQL API, serving developers, researchers, and businesses building podcast applications and workflows.
