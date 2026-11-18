import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

/*
 * Brings back the Linux baseline that a failed "Design-system visual regression" CI job wrote, so a
 * baseline refresh is: push the branch that changes the look, run `npm run visual:baseline` (it waits
 * for CI), look at the PNGs `git status` now shows, commit them in that pull request.
 *
 * It needs `gh` signed in and the branch pushed, because CI screenshots the commit GitHub has, not
 * the one on this machine.
 */
const WORKFLOW = 'ci.yml';
const ARTIFACT = 'visual-baseline';
const VISUAL_JOB = 'Design-system visual regression';
const BASELINE_ROOT = resolve('e2e/visual/baselines');
const PROJECT = 'chromium';
const RUN_LOOKUP_TIMEOUT_MS = 180_000;

function run(command, args) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

function sleep(milliseconds) {
  return new Promise((resolveSleep) => {
    setTimeout(resolveSleep, milliseconds);
  });
}

function upstreamCommit() {
  try {
    return run('git', ['rev-parse', '@{u}']);
  } catch {
    return '';
  }
}

function currentBranchAndCommit() {
  const branch = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch === 'HEAD') {
    fail('This is a detached HEAD. Check out the branch whose baseline you want to refresh.');
  }

  const commit = run('git', ['rev-parse', 'HEAD']);
  const pushed = upstreamCommit();

  if (pushed !== commit) {
    fail(
      `\`${branch}\` is not pushed (HEAD ${commit.slice(0, 7)}, upstream ${pushed.slice(0, 7) || 'none'}). ` +
        'CI screenshots the commit on GitHub, so push first.',
    );
  }

  const dirty = run('git', ['status', '--porcelain']);

  if (dirty) {
    console.warn(
      `Heads up: the working tree has uncommitted changes, and they are not in the screenshots:\n${dirty}`,
    );
  }

  return { branch, commit };
}

/** Finds the CI run for this commit, waiting a little for GitHub to start it. */
async function findRun({ branch, commit }) {
  const deadline = Date.now() + RUN_LOOKUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const runs = JSON.parse(
      run('gh', [
        'run',
        'list',
        '--workflow',
        WORKFLOW,
        '--branch',
        branch,
        '--limit',
        '20',
        '--json',
        'databaseId,headSha',
      ]),
    );
    const found = runs.find((candidate) => candidate.headSha === commit);

    if (found) return String(found.databaseId);

    await sleep(5_000);
  }

  return fail(
    `No ${WORKFLOW} run for ${commit.slice(0, 7)} showed up within ` +
      `${RUN_LOOKUP_TIMEOUT_MS / 60_000} minutes. Check the Actions tab.`,
  );
}

function visualJobConclusion(runId) {
  const jobs = JSON.parse(run('gh', ['run', 'view', runId, '--json', 'jobs'])).jobs;
  const job = jobs.find((candidate) => candidate.name === VISUAL_JOB);
  return job?.conclusion ?? 'missing';
}

function downloadScreenshots(runId) {
  const directory = mkdtempSync(join(tmpdir(), 'visual-baseline-'));

  try {
    run('gh', ['run', 'download', runId, '--name', ARTIFACT, '--dir', directory]);
  } catch {
    rmSync(directory, { recursive: true, force: true });
    fail(
      `The visual job of run ${runId} failed but left no \`${ARTIFACT}\` artifact. Its log says why.`,
    );
  }

  // An artifact built from a directory may or may not keep that directory as a folder.
  const screenshots = existsSync(join(directory, PROJECT)) ? join(directory, PROJECT) : directory;
  return { directory, screenshots };
}

function replaceBaselines(source) {
  const screenshots = readdirSync(source).filter((name) => name.endsWith('.png'));

  if (screenshots.length === 0) fail(`The artifact held no screenshots in ${source}.`);

  const target = join(BASELINE_ROOT, PROJECT);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });

  for (const name of screenshots) {
    copyFileSync(join(source, name), join(target, name));
  }

  return screenshots.length;
}

const { branch, commit } = currentBranchAndCommit();
const runId = await findRun({ branch, commit });
const repository = run('gh', ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner']);

console.log(`CI run ${runId} for ${branch} (${commit.slice(0, 7)}):`);
console.log(`https://github.com/${repository}/actions/runs/${runId}\n`);

// No --exit-status: a failed visual job is the case this script is for.
execFileSync('gh', ['run', 'watch', runId], { stdio: 'inherit' });

const conclusion = visualJobConclusion(runId);

if (conclusion === 'success') {
  console.log('\nThe visual job passed: the committed baseline already matches.');
  process.exit(0);
}

if (conclusion !== 'failure') {
  fail(
    `The visual job of run ${runId} ended as \`${conclusion}\`, so it wrote no baseline. Run this again.`,
  );
}

const downloaded = downloadScreenshots(runId);

const count = replaceBaselines(downloaded.screenshots);
rmSync(downloaded.directory, { recursive: true, force: true });

console.log(`\n${count} screenshots written to e2e/visual/baselines/${PROJECT}.`);
console.log(run('git', ['status', '--short', '--', `e2e/visual/baselines/${PROJECT}`]));
console.log(
  '\nLook at them, then commit them in the pull request that changed the look. A local ' +
    '`npm run test:visual` still reports differences: your fonts render differently than on Linux.',
);
