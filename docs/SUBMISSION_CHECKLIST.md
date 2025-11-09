# Zapier App Directory Submission Checklist

This checklist covers all requirements for submitting the Taddy Podcast API integration to the Zapier App Directory.

**Status:** Ready for submission preparation
**Last Updated:** 2025-10-24

---

## Pre-Submission Requirements

### ✅ Technical Implementation (COMPLETED)
- [x] Integration built and tested locally
- [x] All operations implemented (1 trigger, 9 searches, 1 create)
- [x] Authentication configured (Custom API Key)
- [x] Validation passing (13 checks passed, 0 errors)
- [x] Deployed to Zapier platform (v1.0.0)

### 🔄 Testing Requirements (IN PROGRESS)
- [ ] **Create test Zaps for ALL operations** (1 trigger + 9 searches + 1 create = 11 Zaps minimum)
  - [ ] New Episode Polling (trigger)
  - [ ] Find Podcast (search)
  - [ ] Search Podcasts (search)
  - [ ] Find Episode (search)
  - [ ] Search Episodes (search)
  - [ ] Get Episodes for Podcast (search)
  - [ ] Get Popular Podcasts (search)
  - [ ] Get Top Charts (search)
  - [ ] Get Multiple Podcasts (search)
  - [ ] Get Multiple Episodes (search)
  - [ ] Generate Transcript (create)
- [ ] **Turn ON all test Zaps**
- [ ] **Run each Zap successfully at least once**
- [ ] **Keep test Zaps and run history** (do NOT delete)
- [ ] Verify no unexpected errors or unhandled exceptions

### 📋 Test Account Setup (TADDY ACTION REQUIRED)
Create a dedicated test account with these requirements:

- [ ] **Email:** integration-testing@zapier.com
- [ ] **Non-expiring account** (permanent, not trial)
- [ ] **Password can be changed** by Zapier team
- [ ] **All features enabled** including:
  - [ ] API access with sufficient API request quota
  - [ ] Transcript generation credits
  - [ ] Access to all podcast/episode operations
- [ ] **Provide credentials to Zapier** during submission

**Note:** This account allows Zapier support staff to test your integration during review.

---

## Branding Assets (TADDY TO PROVIDE)

### 🎨 Logo Requirements
- [ ] **Format:** PNG with transparent background
- [ ] **Dimensions:** Minimum 512x512px (square)
- [ ] **Resolution:** Minimum 72 DPI (larger versions preferred)
- [ ] **Content:** Logo only (no text/app name - won't be legible at small sizes)
- [ ] If icon isn't square, center it within transparent square canvas

**File to provide:** `taddy_logo_512x512.png`

### 🎨 Primary Brand Color
- [ ] **Provide hex color code** (e.g., #FF5733)
- [ ] **Cannot be pure white** (#FFFFFF) - text readability issue
- [ ] If branding is black/white, provide next most prominent color
- [ ] Used for: App directory listings, dashboards, marketing materials

**Color to provide:** `#______`

### 📝 App Information

#### App Name
- [ ] Use official name: **"Taddy Podcast API"** (or confirm correct name)
- [ ] Correct capitalization and spacing
- [ ] No trademark symbols (™, ®, ©) unless part of official name
- [ ] No descriptors like "app" or "integration" unless part of official name

**Confirmed name:** `Taddy Podcast API`

#### App Description (160 characters max)
Format: "Taddy is a..."

- [ ] Focus on functionality, not marketing language
- [ ] Maximum 160 characters
- [ ] No flowery language, links, or Zapier mentions
- [ ] No claims of Zapier endorsement

**Draft description:**
```
Taddy is a podcast data API providing access to 4M+ podcasts with search,
episode transcripts, charts, and metadata extraction capabilities.
```
(Current: 156 characters) ✓

#### Homepage URL
- [ ] Link to marketing website (NOT login page)
- [ ] Example: https://taddy.org or https://taddy.org/api

**URL to provide:** `https://taddy.org/developers/podcast-api`

#### Category Selection
Select ONE primary category (child categories preferred over parents):

Suggested categories:
- [ ] **Developer Tools** (if this is the primary use case)
- [ ] **Content & Files** (podcast content focus)
- [ ] **Business Intelligence** (data/analytics focus)

**Note:** Select category matching core use case TODAY, not future plans.


---

## Documentation Requirements

### 📚 API Documentation (TADDY TO VERIFY)
- [ ] **Complete, current API documentation exists**
- [ ] **All endpoints documented** (GraphQL schema)
- [ ] **Documentation is publicly accessible**
- [ ] **Provide documentation URL(s)**

**Documentation URLs:**
```
GraphQL Schema: https://ax0.taddy.org/docs/schema.graphql
API Docs: https://taddy.org/developers/intro-to-taddy-graphql-api
```

### 🔒 HTTPS Requirement
- [x] All API endpoints use HTTPS (verified: https://api.taddy.org)

---

## Ownership & Team Requirements

### 👥 Team Member Requirements (TADDY ACTION REQUIRED)
- [ ] **At least one admin team member** added to Zapier integration
- [ ] **Email must be from Taddy's top-level domain** (e.g., @taddy.org or company domain)
- [ ] This verifies ownership of the API/service

**Admin email to add:** `danny@taddy.org`

### 🔐 Permissions Verification
- [x] Taddy owns the API being integrated
- [ ] Taddy owns/has permission for all trademarks used
- [ ] Taddy has reviewed and approved this integration

---

## Security & Privacy Compliance

### ✅ Security Checklist (VERIFIED)
- [x] No hardcoded credentials (using environment variables/platform auth)
- [x] All API endpoints use HTTPS
- [x] Connection labels don't display API keys/secrets
- [x] Authentication credentials only requested through proper auth config

### 📋 Data Handling
- [x] **Confirm:** Integration doesn't encourage transmission of sensitive personal data
- [ ] **Confirm:** Complies with data privacy regulations (GDPR, etc.)

---

## Quality Checks

### ✅ Integration Quality (COMPLETED)
- [x] Taddy API is publicly launched (not beta/invite-only)
- [x] Using production APIs only
- [x] All user-facing text in English
- [x] Naming conventions followed for triggers/actions/searches
- [x] No Zapier trademarks in integration name

---

## Submission Policies

### ⚠️ Important Guidelines
- [x] This is the ONLY Taddy integration submission (no duplicates)
- [ ] Will NOT submit multiple identical versions during review
- [ ] Understand that flooding submissions delays review process

---

## Submission Process

### 📤 When Ready to Submit

1. **Complete all checklist items above**
2. **Log into Zapier Platform** at https://developer.zapier.com
3. **Navigate to Integration Settings**
4. **Click "Request to Promote Integration"** (or similar button)
5. **Fill submission form with:**
   - Branding assets (logo, color)
   - App information (name, description, homepage, category)
   - Test account credentials
   - API documentation links
   - Admin team member with company email

### ⏱️ Review Timeline
- **Expected review time:** 1-2 weeks (varies)
- **Branding changes:** 1 business day (after publication)
- **Partner Support:** Available for questions during review

---

## Resources

- **Zapier Publishing Requirements:** https://docs.zapier.com/platform/publish/integration-publishing-requirements
- **Branding Guidelines:** https://docs.zapier.com/platform/publish/branding-guidelines
- **Developer Platform:** https://developer.zapier.com
- **Integration Dashboard:** https://developer.zapier.com/app/APP232063

---

## Next Steps

1. **Logan:** Complete comprehensive testing of all operations next week
2. **Taddy (Danny):** Prepare branding assets (logo, color, descriptions)
3. **Taddy (Danny):** Create test account with integration-testing@zapier.com
4. **Taddy (Danny):** Add admin team member with company domain email
5. **Logan:** Create and test all 11 Zaps
6. **Taddy (Danny):** Submit integration for review via Zapier Platform

---

## Questions or Issues?

**Zapier Support:** partners@zapier.com
**Integration ID:** APP232063
**Integration Name:** Podcast Data Extractor (Taddy)
**Current Version:** 1.0.0
