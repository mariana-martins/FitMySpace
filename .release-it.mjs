import createAngularPreset from 'conventional-changelog-angular';

/*
 * release-it: `npm run release` bumps the version, tags it and writes CHANGELOG.md from the
 * Conventional Commits of the design system.
 *
 * Only `#` followed by a digit is an issue reference. The parser's default reads any `#word`
 * as one, so a commit body that mentions a fragment such as `#main-content` became a
 * "closes #main-content" link to an issue that does not exist. A RegExp cannot live in JSON,
 * which is why this file is a module.
 */

const angularTransform = createAngularPreset().writer.transform;

/*
 * The angular preset lists only features, fixes, performance and reverts, so documentation
 * (the Storybook pages and patterns, a large part of the design system) never reached the
 * changelog. A `docs` commit is formatted exactly as a feature would be, then filed under
 * "Documentation". Everything else is left to the preset.
 */
function transform(commit, context) {
  if (commit.type !== 'docs') return angularTransform(commit, context);

  const formatted = angularTransform({ ...commit, type: 'feat' }, context);
  return formatted && { ...formatted, type: 'Documentation' };
}

export default {
  git: {
    commitMessage: 'chore: release v${version}',
    tagName: 'v${version}',
  },
  npm: {
    publish: false,
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
      gitRawCommitsOpts: {
        path: 'src/components/design-system',
      },
      parserOpts: {
        issuePrefixes: [/#(?=\d)/],
      },
      writerOpts: {
        transform,
      },
    },
  },
};
