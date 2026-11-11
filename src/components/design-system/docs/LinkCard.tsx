import type { HeadingLevel } from '../ui/Typography';
import { Heading, Text } from '../ui/Typography';
import styles from './LinkCard.module.css';
import type { ReactNode } from 'react';

/* ---------------------------------------------------------------
 * LinkCard (Storybook docs helper)
 *
 * A card that links to another Storybook page, laid out in a
 * LinkCardGrid. Used by the Introduction page; not part of the
 * public design system API.
 * --------------------------------------------------------------- */

export interface LinkCardGridProps {
  /** `LinkCard` elements. The grid is a list, so screen readers announce how many cards it holds. */
  children: ReactNode;
}

export function LinkCardGrid({ children }: LinkCardGridProps) {
  return <ul className={styles.grid}>{children}</ul>;
}

export interface LinkCardProps {
  /** A Storybook path, e.g. `/docs/design-system-components-actions-button--docs`. */
  path: string;
  title: string;
  description: string;
  /**
   * A decorative sample above the title. It is hidden from assistive
   * technology and made inert, so a real component inside it can never
   * take focus or clicks away from the card's link.
   */
  preview: ReactNode;
  /** The title's heading level, to fit the page outline. */
  headingLevel?: HeadingLevel;
}

/**
 * The link targets the top window because a story renders in the preview
 * iframe; the relative URL keeps working under a sub-path.
 */
export function LinkCard({ path, title, description, preview, headingLevel = 3 }: LinkCardProps) {
  return (
    <li className={styles.card}>
      <div className={styles.preview} aria-hidden="true" inert>
        {preview}
      </div>
      <Heading level={headingLevel} size="sm" className={styles.title}>
        <a href={`./?path=${path}`} target="_top" className={styles.link}>
          {title}
        </a>
      </Heading>
      <Text size="sm" className={styles.description}>
        {description}
      </Text>
    </li>
  );
}
