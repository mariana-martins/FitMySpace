import type { CSSProperties, ReactNode } from 'react';
import { CopyTokenButton } from './CopyTokenButton';
import { Heading, Text } from '../ui/Typography';
import type { DocumentedToken } from './tokens';

/* ---------------------------------------------------------------
 * Foundation page layout (Storybook docs helper)
 *
 * The shared shell of the Foundation pages: a page with a title and
 * an introduction, cards that group related tokens, and token rows
 * with a live preview, the resolved value and a copy button. Not
 * part of the public design system API.
 * --------------------------------------------------------------- */

const subtleTextStyle: CSSProperties = {
  color: 'var(--ds-semantic-color-text-subtle-base)',
  display: 'block',
};

const dividerBorder = '1px solid var(--ds-semantic-color-border-subtle-base)';

/* ===============================================================
 * INLINE CODE
 * =============================================================== */

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code
      style={{
        fontFamily: 'monospace',
        background: 'var(--ds-semantic-color-background-default-hover)',
        padding: '2px 4px',
        borderRadius: '4px',
      }}
    >
      {children}
    </code>
  );
}

/* ===============================================================
 * STORYBOOK LINK
 * =============================================================== */

export interface StorybookLinkProps {
  /** A Storybook path, e.g. `/docs/design-system-components-typography-heading--docs`. */
  path: string;
  children: ReactNode;
}

/**
 * Links to another Storybook page from inside a story. A story renders in the
 * preview iframe, so the link targets the top window; the relative URL keeps
 * working when Storybook is published under a sub-path.
 */
export function StorybookLink({ path, children }: StorybookLinkProps) {
  return (
    <a
      href={`./?path=${path}`}
      target="_top"
      style={{ color: 'var(--ds-semantic-color-text-brand-base)', textDecoration: 'underline' }}
    >
      {children}
    </a>
  );
}

/* ===============================================================
 * PAGE
 * =============================================================== */

export interface FoundationPageProps {
  title: string;
  /** What the tokens are for and how to use them. */
  introduction: ReactNode;
  children: ReactNode;
}

export function FoundationPage({ title, introduction, children }: FoundationPageProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--ds-semantic-color-background-default-base)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        <Heading level={2} size="md" style={{ marginBottom: '16px' }}>
          {title}
        </Heading>
        <Text size="md" style={{ ...subtleTextStyle, marginBottom: '48px' }}>
          {introduction}
        </Text>
        {children}
      </div>
    </div>
  );
}

/* ===============================================================
 * GROUP
 * =============================================================== */

export interface TokenGroupProps {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}

export function TokenGroup({ title, description, children }: TokenGroupProps) {
  return (
    <section
      style={{
        marginBottom: '40px',
        backgroundColor: 'var(--ds-semantic-color-background-default-base)',
        padding: '32px',
        borderRadius: 'var(--ds-radii-xl)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
        border: dividerBorder,
      }}
    >
      <Heading
        level={3}
        size="sm"
        style={{
          marginBottom: description ? '8px' : '24px',
          paddingBottom: description ? 0 : '12px',
          borderBottom: description ? 'none' : dividerBorder,
        }}
      >
        {title}
      </Heading>
      {description && (
        <Text
          size="sm"
          as="span"
          style={{
            ...subtleTextStyle,
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: dividerBorder,
          }}
        >
          {description}
        </Text>
      )}
      {children}
    </section>
  );
}

/* ===============================================================
 * ROW
 * =============================================================== */

export interface TokenRowProps {
  token: DocumentedToken;
  label: string;
  /** A live sample that uses the token. Decorative: hidden from assistive technology. */
  preview: ReactNode;
}

export function TokenRow({ token, label, preview }: TokenRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 0',
        borderBottom: dividerBorder,
      }}
    >
      <div aria-hidden="true" style={{ flexShrink: 0 }}>
        {preview}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" as="span" style={{ fontWeight: 600, display: 'block' }}>
          {label}
        </Text>
        <Text size="sm" as="span" style={{ ...subtleTextStyle, marginTop: '2px' }}>
          {token.value}
        </Text>
        {token.comment && (
          <Text size="sm" as="span" style={{ ...subtleTextStyle, marginTop: '4px' }}>
            {token.comment}
          </Text>
        )}
      </div>

      <CopyTokenButton variable={token.name} />
    </div>
  );
}
