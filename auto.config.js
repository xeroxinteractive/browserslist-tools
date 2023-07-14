const labels = [
  {
    name: 'change: major',
    changelogTitle: 'Breaking Change',
    description: 'A major breaking change',
    releaseType: 'major',
  },
  {
    name: 'change: feature',
    changelogTitle: 'Feature',
    description: 'Adds a new feature or improves on an existing one',
    releaseType: 'minor',
  },
  {
    name: 'change: fix',
    changelogTitle: 'Fix',
    description: 'Fixes a bug',
    releaseType: 'patch',
  },
  {
    name: 'change: documentation',
    changelogTitle: 'Documentation',
    description: 'Changes only affect the documentation',
    releaseType: 'patch',
  },
  {
    name: 'change: refactor',
    changelogTitle: 'Refactor',
    description: 'Changes that introduce no new features or fixes',
    releaseType: 'patch',
  },
  {
    name: 'change: performance',
    changelogTitle: 'Performance',
    description: 'Improve performance of an existing feature',
    releaseType: 'patch',
  },
  {
    name: 'change: dependencies',
    changelogTitle: 'Dependencies',
    description: 'Updates to dependencies only',
    releaseType: 'patch',
  },
  {
    name: 'change: chore',
    changelogTitle: 'Chore',
    description: 'Changes around build process',
    releaseType: 'none',
  },
  {
    name: 'change: tests',
    changelogTitle: 'Tests',
    description: 'Add or improve existing tests',
    releaseType: 'none',
  },
  {
    name: 'release: skip',
    description: 'Skips the release step when this pr is merged',
    releaseType: 'skip',
  },
];

/**
 * @type {import('auto').AutoRc}
 */
module.exports = {
  baseBranch: 'release',
  plugins: [
    ['npm', { exact: true, commitNextVersion: true }],
    'slack',
    'released',
  ],
  labels,
  prereleaseBranches: ['next'],
};