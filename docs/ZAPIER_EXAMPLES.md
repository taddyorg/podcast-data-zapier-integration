# Taddy Podcast API - Zapier Example Workflows

These example workflows demonstrate common use cases for the Taddy Podcast API integration. Copy this text into the Zapier Partner Dashboard to showcase integration capabilities.

---

## Example 1: Search Podcasts and Save to Google Sheets

**Title:** Build a Podcast Database by Genre

**How it works:**
Enter a search keyword or select a genre (like Technology, Business, or Comedy), and this Zap searches Taddy's database of 4M+ podcasts for matches. It retrieves full metadata including RSS feeds, episode counts, and descriptions, then automatically saves everything to a Google Sheet for easy organization and future reference.

**What you need:**
- Taddy API account (sign up at taddy.org/developers)
- Google Sheets with a spreadsheet set up
- Zapier account

**Popular variations:**
- Add a schedule trigger to run weekly searches and discover new podcasts
- Filter by language or country to find region-specific content
- Use episode count filters to find established shows vs. new launches
- Connect to Airtable instead of Google Sheets for richer database features
- Add Slack notifications when high-ranking podcasts are discovered

**Apps used:** Taddy Podcast API, Google Sheets, Schedule by Zapier (optional), Slack (optional)

---

## Example 2: Monitor Apple Podcasts Charts Daily

**Title:** Track Your Podcast's Ranking Over Time

**How it works:**
This Zap runs daily at your chosen time and checks the Top 200 podcasts on Apple Podcasts charts. Each genre and country has its own Top chart (e.g., Top 200 Business Podcasts in USA). Provide your podcast's UUID and the Zap will find your ranking, log it to a Google Sheet with a timestamp, and optionally alert you via Slack when you break into new ranking tiers or drop significantly.

**What you need:**
- Taddy API account
- Google Sheets for tracking data
- Your podcast's UUID (get it using "Find Podcast" search)
- Zapier account

**Popular variations:**
- Track multiple podcasts in a single sheet (competitors, portfolio, etc.)
- Add email alerts when rank changes by more than 10 positions
- Create weekly summary reports with average rankings
- Calculate day-over-day and week-over-week changes with Formatter
- Export data to Data Studio or Tableau for visual dashboards
- Track rankings across multiple genres or countries

**Apps used:** Taddy Podcast API, Google Sheets, Schedule by Zapier, Slack (optional), Gmail (optional)

---

## Example 3: Auto-Generate Transcripts for New Episodes

**Title:** Automatically Transcribe New Podcast Episodes

**How it works:**
Monitor your favorite podcasts (or your own show) for new episodes using the polling trigger. When a new episode is detected, automatically generate a transcript using Taddy's transcription service. The transcript is then saved to Google Docs, posted to Slack for your team, or stored in your CMS. Perfect for content teams who repurpose podcast content into blog posts, social media, or SEO-optimized show notes.

**What you need:**
- Taddy API account with transcript credits
- Google Docs, Notion, or your preferred document storage
- Podcast UUIDs to monitor
- Zapier account

**Popular variations:**
- Filter transcripts for specific keywords before saving (e.g., only save if mentions "AI" or "blockchain")
- Send transcripts to ChatGPT/Claude API to generate show notes automatically
- Extract quotes and create social media posts via Buffer or Hootsuite
- Archive transcripts in Dropbox or Google Drive by date/podcast
- Email transcripts to your editorial team for review
- Post transcript links to your podcast's Discord or Slack community

**Apps used:** Taddy Podcast API, Google Docs, Slack, Notion, ChatGPT (optional), Buffer (optional)

---

## Example 4: Content Curation for Social Media

**Title:** Auto-Post New Episodes from Tech Podcasts

**How it works:**
Search for episodes from Technology or Business podcasts published in the last 24 hours. Filter by keywords like "AI", "startup", or "SaaS", then automatically post selected episodes to Twitter/X, LinkedIn, or schedule them in Buffer. Great for tech influencers, newsletter curators, or community managers who share podcast recommendations.

**What you need:**
- Taddy API account
- Social media accounts (Twitter, LinkedIn, etc.) or Buffer/Hootsuite
- Zapier account

**Popular variations:**
- Add sentiment analysis via AI tools to only share positive/relevant episodes
- Include episode descriptions and custom commentary in posts
- Create rich social cards with episode artwork using Bannerbear or Placid
- Store curated episodes in Airtable for newsletter compilation
- Schedule posts at optimal times using Buffer or Later
- Cross-post to multiple platforms (Twitter, LinkedIn, Facebook, Threads)
- Tag podcast hosts automatically if they're in your network

**Apps used:** Taddy Podcast API, Twitter, LinkedIn, Buffer, Airtable (optional), Bannerbear (optional)

---

## Example 5: Podcast Discovery Email Newsletter

**Title:** Weekly Email with Top Trending Podcasts

**How it works:**
Every Monday, this Zap pulls the top popular podcasts from Taddy's database filtered by your chosen genre (Business, Technology, True Crime, etc.). It formats the list with podcast names, descriptions, and artwork, then sends it via Gmail or adds it to your Mailchimp/ConvertKit campaign. Perfect for newsletter creators, podcast directories, or community builders.

**What you need:**
- Taddy API account
- Email service (Gmail, Mailchimp, ConvertKit, etc.)
- Zapier account

**Popular variations:**
- Combine with "Get Episodes for Podcast" to include latest episodes from each show
- Add personalization by genre preference stored in Google Sheets
- Include Apple Podcasts chart rankings for credibility
- Segment lists by language for multilingual newsletters
- Add affiliate links to podcast platforms if applicable
- Store subscriber engagement data in your CRM (HubSpot, Salesforce)

**Apps used:** Taddy Podcast API, Gmail, Mailchimp, ConvertKit, Schedule by Zapier, Google Sheets (optional)

---

## Tips for Building Your Zaps

**Start Simple:**
Begin with a single-step workflow (e.g., search + save to sheets) and add complexity gradually.

**Use Filters:**
Add Zapier's Filter step to only process episodes/podcasts that meet specific criteria (date, keyword, etc.).

**Handle Errors:**
Set up error notifications via email or Slack so you know if a Zap stops working.

**Monitor Usage:**
- Check your Taddy API quota at taddy.org/dashboard
- Transcript generation uses separate credits (monitor carefully)
- Zapier task usage counts per action in your Zap

**Test Thoroughly:**
Always test your Zap with real data before turning it on. Use the "Test & Review" feature for each step.

---

## Need Help?

- **Taddy API Documentation:** [taddy.org/developers/podcast-api](https://taddy.org/developers/podcast-api)
- **Zapier Help:** [help.zapier.com](https://help.zapier.com)
- **Community:** Share your workflows and get ideas at [community.zapier.com](https://community.zapier.com)

---

*These examples are starting points. Customize them to fit your specific workflow needs!*
