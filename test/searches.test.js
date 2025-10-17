/* globals describe, expect, test */

const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

// Set up test credentials
const testAuth = {
  userId: process.env.TEST_USER_ID || 'your-user-id-here',
  apiKey: process.env.TEST_API_KEY || 'your-api-key-here'
};

describe('Find Podcast', () => {
  test('should find a podcast by name', async () => {
    const bundle = {
      authData: testAuth,
      inputData: {
        input_type: 'name',
        podcast_name: 'This American Life'
      }
    };

    const results = await appTester(
      App.searches.find_podcast.operation.perform,
      bundle
    );

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].uuid).toBeDefined();
    expect(results[0].name).toBeDefined();
  });

  test('should find a podcast by UUID', async () => {
    const bundle = {
      authData: testAuth,
      inputData: {
        input_type: 'uuid',
        podcast_uuid: 'cb8d858a-3ef4-4645-8942-67e55c0927f2'
      }
    };

    const results = await appTester(
      App.searches.find_podcast.operation.perform,
      bundle
    );

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    if (results.length > 0) {
      expect(results[0].uuid).toBe('cb8d858a-3ef4-4645-8942-67e55c0927f2');
    }
  });

  test('should return empty array when podcast not found', async () => {
    const bundle = {
      authData: testAuth,
      inputData: {
        input_type: 'name',
        podcast_name: 'ThisPodcastDefinitelyDoesNotExist12345'
      }
    };

    const results = await appTester(
      App.searches.find_podcast.operation.perform,
      bundle
    );

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });
});
