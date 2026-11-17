import {
  FoundationPage,
  formatTokenLabel,
  getTokens,
  InlineCode,
  TokenGroup,
  TokenRow,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CSSProperties } from 'react';

const meta = {
  title: 'Design System/Foundation/Layer',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** One sheet per step up the stack: the row's own layer is the top sheet. */
const StackSample = ({ depth }: { depth: number }) => (
  <div
    style={{
      position: 'relative',
      inlineSize: '96px',
      blockSize: '64px',
    }}
  >
    {Array.from({ length: depth }, (_unusedSheet, position) => (
      <div
        key={position}
        style={{
          position: 'absolute',
          insetInlineStart: `${8 + position * 12}px`,
          insetBlockStart: `${28 - position * 8}px`,
          inlineSize: '44px',
          blockSize: '20px',
          borderRadius: 'var(--ds-semantic-radii-surface-sm)',
          border:
            'var(--ds-semantic-border-width-default) solid var(--ds-semantic-colour-border-subtle-base)',
          backgroundColor:
            position === depth - 1
              ? 'var(--ds-semantic-colour-background-brand-soft)'
              : 'var(--ds-semantic-colour-background-default-base)',
          boxShadow: 'var(--ds-semantic-shadow-raised-base)',
        }}
      />
    ))}
  </div>
);

const sceneSheetStyle: CSSProperties = {
  position: 'absolute',
  padding: '8px 12px',
  borderRadius: 'var(--ds-semantic-radii-container-sm)',
  fontSize: '13px',
};

/**
 * The four heights of the interface, drawn in a box with its own stacking context:
 * the page, a dialog on its scrim, a tooltip over the dialog, a toast over everything.
 */
const LayeredScene = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'relative',
      isolation: 'isolate',
      blockSize: '240px',
      borderRadius: 'var(--ds-semantic-radii-container-md)',
      backgroundColor: 'var(--ds-semantic-colour-background-default-hover)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        ...sceneSheetStyle,
        insetInlineStart: '24px',
        insetBlockStart: '160px',
        border:
          'var(--ds-semantic-border-width-default) solid var(--ds-semantic-colour-border-subtle-base)',
        backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
        color: 'var(--ds-semantic-colour-text-subtle-base)',
      }}
    >
      page
    </div>
    <div
      style={{
        position: 'absolute',
        inset: '0',
        zIndex: 'var(--ds-semantic-layer-overlay)',
        backgroundColor: 'var(--ds-semantic-colour-background-scrim)',
      }}
    />
    <div
      style={{
        ...sceneSheetStyle,
        insetInlineStart: '96px',
        insetBlockStart: '96px',
        zIndex: 'var(--ds-semantic-layer-overlay)',
        border:
          'var(--ds-semantic-border-width-default) solid var(--ds-semantic-colour-border-subtle-base)',
        backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
        color: 'var(--ds-semantic-colour-text-default-base)',
        boxShadow: 'var(--ds-semantic-shadow-overlay)',
      }}
    >
      dialog
    </div>
    <div
      style={{
        ...sceneSheetStyle,
        insetInlineStart: '300px',
        insetBlockStart: '56px',
        zIndex: 'var(--ds-semantic-layer-floating)',
        backgroundColor: 'var(--ds-semantic-colour-background-inverse)',
        color: 'var(--ds-semantic-colour-text-inverse)',
        boxShadow: 'var(--ds-semantic-shadow-floating)',
      }}
    >
      tooltip
    </div>
    <div
      style={{
        ...sceneSheetStyle,
        insetInlineEnd: '24px',
        insetBlockStart: '160px',
        zIndex: 'var(--ds-semantic-layer-toast)',
        border:
          'var(--ds-semantic-border-width-default) solid var(--ds-semantic-colour-border-subtle-base)',
        backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
        color: 'var(--ds-semantic-colour-text-default-base)',
        boxShadow: 'var(--ds-semantic-shadow-overlay)',
      }}
    >
      toast
    </div>
  </div>
);

/* --- Semantic Layers --- */
export const SemanticLayers: Story = {
  render: () => {
    const layerTokens = getTokens('semantic', 'layer');

    return (
      <FoundationPage
        title="Layer"
        introduction={
          <>
            Three heights, from the page upwards, because a design system with no stacking rule ends
            up with <InlineCode>z-index: 9999</InlineCode> scattered across the app. Write{' '}
            <InlineCode>z-index: var(--ds-semantic-layer-overlay)</InlineCode> and nothing else: a
            layer goes only on the root of what Radix renders in a portal, since an ancestor with{' '}
            <InlineCode>transform</InlineCode>, <InlineCode>opacity</InlineCode> or{' '}
            <InlineCode>filter</InlineCode> would trap it. A component with stacking of its own
            inside sets <InlineCode>isolation: isolate</InlineCode> so its inner layers stay inside.
          </>
        }
      >
        <TokenGroup
          title="Stacking order"
          description="From lowest to highest. The number of sheets shows the rank; the value is what you copy."
        >
          {layerTokens.map((token, position) => (
            <TokenRow
              key={token.name}
              token={token}
              label={formatTokenLabel(token.path.slice(2))}
              preview={<StackSample depth={position + 1} />}
            />
          ))}
        </TokenGroup>
        <TokenGroup
          title="In context"
          description="A page, a dialog on its scrim, a tooltip over the dialog and a toast over everything. The tooltip sits above the dialog on purpose, so a select or a hint still shows inside one."
        >
          <LayeredScene />
        </TokenGroup>
      </FoundationPage>
    );
  },
};
