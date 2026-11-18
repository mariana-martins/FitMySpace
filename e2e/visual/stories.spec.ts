import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test, type Page } from '@playwright/test';

import { OPEN_BEFORE_SCREENSHOT, VISUAL_COMPONENT_NAMES } from './covered-components';

/*
 * One screenshot per story of the covered components, compared against the baseline in
 * `e2e/visual/baselines/chromium/`. The story list comes from the Storybook build's own index, so a
 * new story of a covered component is captured without anyone editing this file.
 */

type StorybookEntry = {
  type: string;
  id: string;
  name: string;
  title: string;
  tags: string[];
};

const STORYBOOK_INDEX_PATH = resolve('storybook-static/index.json');

/** The last part of a story title is its component: `Design System/Components/Actions/Button`. */
function componentOf(entry: StorybookEntry): string {
  return entry.title.split('/').pop() ?? '';
}

function isCoveredStory(entry: StorybookEntry): boolean {
  // The hidden `Interaction (Test Only)` copies (`tags: ['!dev']` in the story file) reach the built
  // index without the `dev` tag, and they end mid-interaction.
  if (entry.type !== 'story' || !entry.tags.includes('dev')) return false;
  return VISUAL_COMPONENT_NAMES.includes(componentOf(entry));
}

function readCoveredStories(): StorybookEntry[] {
  let index: { entries: Record<string, StorybookEntry> };

  try {
    index = JSON.parse(readFileSync(STORYBOOK_INDEX_PATH, 'utf8'));
  } catch {
    throw new Error(
      `${STORYBOOK_INDEX_PATH} is missing. Run \`npm run test:visual\`, which builds Storybook first.`,
    );
  }

  return Object.values(index.entries)
    .filter(isCoveredStory)
    .sort((first, second) => first.id.localeCompare(second.id));
}

const stories = readCoveredStories();

test('every covered component has stories to screenshot', () => {
  const captured = new Set(stories.map(componentOf));
  const missing = VISUAL_COMPONENT_NAMES.filter((name) => !captured.has(name));

  expect(missing, `no stories found for ${missing.join(', ')} in ${STORYBOOK_INDEX_PATH}`).toEqual(
    [],
  );
});

/** Opens the story's overlay, when it has one and the story starts closed. */
async function openOverlay(page: Page, story: StorybookEntry): Promise<void> {
  const overlay = OPEN_BEFORE_SCREENSHOT[componentOf(story)];
  if (!overlay || overlay.keepClosed?.includes(story.id.split('--')[1])) return;

  const root = page.locator('#storybook-root');
  const opened = page.getByRole(overlay.opens).first();
  if (await opened.isVisible()) return;

  if (overlay.opens === 'listbox') {
    const input = root.getByRole('combobox').first();
    if (await input.isDisabled()) return;
    await input.focus();
    await page.keyboard.press('ArrowDown');
  } else {
    await root.getByRole('button').first().click();
  }

  await expect(opened).toBeVisible();
  // A toast closes itself on a timer: stop the clock so the screenshot never races it.
  await page.clock.pauseAt(Date.now() + 1_000);
}

for (const story of stories) {
  test(story.id, async ({ page }) => {
    await page.clock.install();
    // The iframe alone: the Storybook manager chrome would add its own pixels to every shot.
    await page.goto(`/iframe.html?viewMode=story&id=${story.id}`);
    await expect(page.locator('#storybook-root')).toBeVisible();
    await openOverlay(page, story);
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await expect(page).toHaveScreenshot(`${story.id}.png`, { fullPage: true });
  });
}
