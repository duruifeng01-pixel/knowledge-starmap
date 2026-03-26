// backend/tests/framework.test.js
const { generateFramework } = require('../src/services/frameworkGenerator');

describe('Framework Generation', () => {
  const profile = {
    industry: 'Journalism',
    goals: 'Become a better investigative reporter',
    domains: ['writing', 'research', 'interviewing'],
    level: 'intermediate'
  };

  if (!process.env.TEST_API_KEY) {
    it.skip('returns a valid framework structure', async () => {
      const framework = await generateFramework(profile, process.env.TEST_API_KEY);
      expect(framework).toHaveProperty('name');
      expect(framework).toHaveProperty('nodes');
      expect(framework.nodes.length).toBeGreaterThan(0);
      expect(framework).toHaveProperty('edges');
    }, 30000);
  } else {
    it('returns a valid framework structure', async () => {
      const framework = await generateFramework(profile, process.env.TEST_API_KEY);
      expect(framework).toHaveProperty('name');
      expect(framework).toHaveProperty('nodes');
      expect(framework.nodes.length).toBeGreaterThan(0);
      expect(framework).toHaveProperty('edges');
    }, 30000);
  }
});
