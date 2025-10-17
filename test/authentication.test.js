/* globals describe, expect, test */

const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

// Set up test credentials
// You can either set environment variables or hardcode for testing
const testAuth = {
  userId: process.env.TEST_USER_ID || 'your-user-id-here',
  apiKey: process.env.TEST_API_KEY || 'your-api-key-here'
};

describe('Authentication', () => {
  test('should authenticate successfully with valid credentials', async () => {
    const bundle = {
      authData: testAuth
    };

    const result = await appTester(
      App.authentication.test,
      bundle
    );

    expect(result).toBeDefined();
    expect(result.apiRequestsRemaining).toBeDefined();
    expect(typeof result.apiRequestsRemaining).toBe('number');
  });

  test('should fail with invalid credentials', async () => {
    const bundle = {
      authData: {
        userId: 'invalid-user-id',
        apiKey: 'invalid-api-key'
      }
    };

    await expect(
      appTester(App.authentication.test, bundle)
    ).rejects.toThrow();
  });
});
