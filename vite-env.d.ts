/* ---------------------------------------------------------------
 * Vite import suffixes used by the Storybook pages.
 *
 * `vite/client` is not referenced here on purpose: it also declares
 * `*.module.css`, which Next already declares for the app. Only the
 * suffix a page actually imports is declared.
 * --------------------------------------------------------------- */

declare module '*?raw' {
  const content: string;
  export default content;
}
