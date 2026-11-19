import { DM_Sans } from 'next/font/google';

/*
 * The one font of the app and the design system (docs/adr/0002). `next/font` serves it from this
 * site and defines `--font-dm-sans`, which the `font.family.sans` token reads, so the app and
 * Storybook (which imports this file too) render the same files.
 */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});
