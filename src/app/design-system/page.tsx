import { Alert, Badge, Button, Heading, Text, TextField } from '@/components/design-system';
import styles from './page.module.css';
import type { Metadata } from 'next';

/*
 * A check, not a page for visitors: the first place the app renders design-system components,
 * so the E2E suite can confirm they get the tokens and the DM Sans font the app now loads
 * (docs/migration-plan.md). It is linked from nowhere and kept out of search results.
 */
export const metadata: Metadata = {
  title: 'Design system check - FitMySpace',
  robots: { index: false, follow: false },
};

export default function DesignSystemCheckPage() {
  return (
    <main id="main-content" className={styles.page}>
      <Heading level={1}>Design system check</Heading>
      <Text>
        These components come from the design system and render with its tokens and font inside the
        app.
      </Text>
      <div className={styles.actions}>
        <Button>Save room</Button>
        <Button variant="secondary" appearance="outline">
          Cancel
        </Button>
        <Badge>New</Badge>
      </div>
      <TextField label="Room name" hint="It shows up in your list of rooms." />
      <Alert variant="success" title="Room saved" live="off">
        The name shows up in your list of rooms.
      </Alert>
    </main>
  );
}
