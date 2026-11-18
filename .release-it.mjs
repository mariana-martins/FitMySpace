/*
 * release-it: `npm run release` bumps the version, tags it and writes CHANGELOG.md from the
 * Conventional Commits of the design system.
 *
 * Only `#` followed by a digit is an issue reference. The parser's default reads any `#word`
 * as one, so a commit body that mentions a fragment such as `#main-content` became a
 * "closes #main-content" link to an issue that does not exist. A RegExp cannot live in JSON,
 * which is why this file is a module.
 */
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
    },
  },
};
