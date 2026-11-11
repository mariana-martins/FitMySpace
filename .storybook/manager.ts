import { CURRENT_STORY_WAS_SET } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';

/*
 * The Introduction and the Foundation pages are reading pages: the addons panel
 * (controls, actions, interactions) has nothing to inspect there, so it starts hidden.
 * A story parameter cannot do this, because the manager applies story options before
 * the next story's parameters load, so the panel would not come back.
 * Here the panel is reopened on leaving only if this code hid it; a panel the reader
 * closed by hand stays closed. The flag lives in sessionStorage, like the panel state,
 * so a reload elsewhere still reopens it.
 */
const READING_PAGE_PREFIXES = ['design-system-introduction--', 'design-system-foundation-'];
const HIDDEN_ON_READING_PAGE_KEY = 'fitmyspace/panel-hidden-on-reading-page';

function isReadingPage(storyId: string | undefined): boolean {
  return READING_PAGE_PREFIXES.some((prefix) => storyId?.startsWith(prefix));
}

addons.register('fitmyspace/reading-page-panel', (api) => {
  function syncPanelWithStory({ storyId }: { storyId?: string }) {
    const wasHiddenHere = sessionStorage.getItem(HIDDEN_ON_READING_PAGE_KEY) === 'true';

    if (isReadingPage(storyId) && api.getIsPanelShown()) {
      api.togglePanel(false);
      sessionStorage.setItem(HIDDEN_ON_READING_PAGE_KEY, 'true');
    } else if (!isReadingPage(storyId) && wasHiddenHere) {
      api.togglePanel(true);
      sessionStorage.removeItem(HIDDEN_ON_READING_PAGE_KEY);
    }
  }

  api.on(CURRENT_STORY_WAS_SET, syncPanelWithStory);
});
