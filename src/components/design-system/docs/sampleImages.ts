/* ---------------------------------------------------------------
 * Sample images (Storybook docs helper)
 *
 * Pictures for stories and patterns, drawn inline as SVG data URIs so
 * no story ever loads an image from the network. Not part of the
 * public design system API.
 * --------------------------------------------------------------- */

/** A wall shelf with three planks holding a jar, a box and a ball. */
export const SHELF_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#e3efe9"/>' +
    '<rect x="90" y="70" width="220" height="12" rx="4" fill="#5b8a72"/>' +
    '<rect x="90" y="150" width="220" height="12" rx="4" fill="#5b8a72"/>' +
    '<rect x="90" y="230" width="220" height="12" rx="4" fill="#5b8a72"/>' +
    '<rect x="110" y="30" width="36" height="40" rx="6" fill="#c9a98a"/>' +
    '<rect x="160" y="110" width="52" height="40" rx="6" fill="#9fb8c9"/>' +
    '<circle cx="250" cy="208" r="22" fill="#d8c3a5"/>' +
    '</svg>',
)}`;
