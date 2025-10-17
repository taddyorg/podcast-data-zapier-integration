# Zapier CLI Setup & Deployment Guide

## ✅ Already Completed
- [x] Zapier CLI installed globally
- [x] Project dependencies installed
- [x] Test files created
- [x] Environment template created

## 🚀 Next Steps (Run these commands)

### Step 1: Login to Zapier
```bash
zapier login
```
This will open a browser window to authenticate with Zapier. Follow the prompts.

### Step 2: Register Your Integration
```bash
zapier register "Taddy Podcast API"
```

You'll be prompted for:
- **Description**: `Access 4M+ podcasts and 180M+ episodes with automated workflows`
- **Homepage URL**: `https://taddy.org`
- **Intended Audience**: Choose `Private` (you can make it public later)
- **Role**: Choose `Internal Tool` or `Public Integration` (depending on your goals)
- **Category**: Choose `Productivity` or `Developer Tools`

### Step 3: Validate Integration
```bash
zapier validate
```
This checks your integration for errors. Fix any issues it reports.

### Step 4: Push to Zapier
```bash
zapier push
```
This uploads your integration to Zapier's platform.

### Step 5: Test in Zapier Web Editor
After pushing:
1. Go to https://zapier.com/app/editor
2. Create a new Zap
3. Search for "Taddy Podcast API" in the app selector
4. Test the "Find Podcast" search action

## 🧪 Optional: Run Tests Locally

Before pushing, you can test locally (requires Taddy API credentials):

### 1. Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
# Get them from https://taddy.org/dashboard
nano .env  # or use your preferred editor
```

### 2. Run tests
```bash
npm test
```

**Note:** Tests will fail without valid credentials in `.env`

## 📝 Current Integration Status

### Implemented ✅
- Authentication (API Key with userId + apiKey)
- Find Podcast search (by UUID, name, RSS URL, iTunes ID)

### To Be Implemented 🚧
- Search Podcasts (with filters)
- Search Episodes
- Find Episode
- Generate Transcript action
- New Episode polling trigger
- Webhook trigger (placeholder for future)

## 🔍 Useful Commands

```bash
# View your integrations
zapier integrations

# View logs (after testing in Zapier)
zapier logs --type=http

# Test a specific function locally
zapier invoke auth.test
zapier invoke searches.find_podcast '{"input_type":"name","podcast_name":"This American Life"}'

# Build for deployment (if needed)
zapier build

# Promote version to production (when ready)
zapier promote 1.0.0
```

## ⚠️ Important Notes

1. **Webhook Triggers**: Currently placeholder-only. Taddy is building webhook filtering (ETA: end of 2024).

2. **Private Integration**: Your integration starts private (only visible to you). To make it public:
   - Complete all operations
   - Add comprehensive tests
   - Contact Zapier for publishing review

3. **API Credentials**: Never commit `.env` file (it's in `.gitignore`)

## 🐛 Troubleshooting

### "zapier: command not found"
```bash
npm install -g zapier-platform-cli
```

### Tests failing
- Ensure `.env` has valid `TEST_USER_ID` and `TEST_API_KEY`
- Check your Taddy API quota at https://taddy.org/dashboard

### Validation errors
- Run `zapier validate` to see specific errors
- Check `index.js` exports all operations correctly

### GraphQL errors
- Verify credentials are correct
- Check API status at https://taddy.org
- Review error logs: `zapier logs --type=http`

## 📚 Resources

- [Zapier CLI Docs](https://github.com/zapier/zapier-platform/blob/main/packages/cli/README.md)
- [Taddy API Docs](https://taddy.org/developers/podcast-api)
- [Project README](./README.md)
- [Implementation Guide](./CLAUDE.md)
