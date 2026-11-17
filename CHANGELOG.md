# Changelog

# [0.5.0](https://github.com/mariana-martins/FitMySpace/compare/v0.4.0...v0.5.0) (2026-11-17)

### Bug Fixes

* **icon:** name the box when aria-labelledby points at a visible label ([e505fca](https://github.com/mariana-martins/FitMySpace/commit/e505fca758eba71faf511ae2095a5f17a41debfa))
* **stories:** keep the play of a visible story on its resting state ([7410915](https://github.com/mariana-martins/FitMySpace/commit/7410915206f344b6b209cc5c51d58deaa368e05b))

### Features

* **icon:** add the Icon box and the registry the design system draws from ([4ae03d5](https://github.com/mariana-martins/FitMySpace/commit/4ae03d5a9682efacc1b30bad814cd62cfc9c73b8))
* **tokens:** add the icon size tokens ([9d4c42e](https://github.com/mariana-martins/FitMySpace/commit/9d4c42eb31661040df7ce9d9ecea032385bd58d3))

# [0.4.0](https://github.com/mariana-martins/FitMySpace/compare/v0.3.0...v0.4.0) (2026-11-17)

* refactor(tokens)!: spell colour the Australian way across the design system ([c6f9289](https://github.com/mariana-martins/FitMySpace/commit/c6f928901c6864ac0f0fa45152dd40e151fb48a2))

### Bug Fixes

* **design-system:** close the gaps the review found in the overlays ([a5e1ae9](https://github.com/mariana-martins/FitMySpace/commit/a5e1ae9b0d81c34448dce4f05a44ffd1056ba79e))

### Features

* **dialog:** add the Dialog overlay built on Radix Dialog ([af681d0](https://github.com/mariana-martins/FitMySpace/commit/af681d09fdc7d1ce8165cc6b5c258817a70d04e1))
* **toast:** add the Toast notification built on Radix Toast ([b0ad29b](https://github.com/mariana-martins/FitMySpace/commit/b0ad29bb31a309d29d9604cf43e99d1ee7557e3a))
* **tokens:** add layer, scrim and inverse background tokens for overlays ([63d81fb](https://github.com/mariana-martins/FitMySpace/commit/63d81fb9babf69f441aa2f06d06834d10fdddac1))
* **tooltip:** add the Tooltip bubble built on Radix Tooltip ([81db477](https://github.com/mariana-martins/FitMySpace/commit/81db477487464bdc6824357f95bf9e0c0bc29264))

### BREAKING CHANGES

* the colour CSS custom properties are renamed. --ds-color-* is now
  --ds-colour-*, --ds-semantic-color-* is now --ds-semantic-colour-*, and the token
  paths color.*, semantic.color.* and semantic.focus.ring.color now use colour.

# [0.3.0](https://github.com/mariana-martins/FitMySpace/compare/v0.2.0...v0.3.0) (2026-11-15)

### Features

* **alert:** add Alert feedback component and tokens ([f3f2991](https://github.com/mariana-martins/FitMySpace/commit/f3f29916e7f58f184d0c659cd51a64eaf245f334))
* **badge:** add Badge component and soft colour tokens ([0bcd1c9](https://github.com/mariana-martins/FitMySpace/commit/0bcd1c9aeadd82525c3c7ff75c458814451ed627))
* **breadcrumb:** add Breadcrumb navigation components and tokens ([709e42e](https://github.com/mariana-martins/FitMySpace/commit/709e42e28fe1670d6ee7d9bb4488f8654ce09aa3))
* **card:** add Card and CardMedia surface components and tokens ([00c4d16](https://github.com/mariana-martins/FitMySpace/commit/00c4d1669bc71de6a52461a6f1c4d4f378854520))
* **checkbox:** add Checkbox component and shared joinIds utility ([2a75f17](https://github.com/mariana-martins/FitMySpace/commit/2a75f1769dc1163cc5ae551d193e323963a59d7c))
* **chip:** add Chip toggle button component and tier-3 tokens ([77825ae](https://github.com/mariana-martins/FitMySpace/commit/77825aed519161d49d1dfdea8f90259e9f321c38))
* **design-system:** add EmptyState and SearchField components and tokens ([231a6f3](https://github.com/mariana-martins/FitMySpace/commit/231a6f37aa101c0da4f7beac0b7025311069e4f8))
* **link:** add Link navigation component and tier-3 tokens ([e376c36](https://github.com/mariana-martins/FitMySpace/commit/e376c36b203f4bd6f2fe222e6f70a902b4c72313))
* **pagination:** add Pagination navigation components and tokens ([189b5a8](https://github.com/mariana-martins/FitMySpace/commit/189b5a84388c3fa67ef11a74a25ca08061b12dcf))
* **radio-group:** add RadioGroup and RadioGroupItem form components ([b8b1004](https://github.com/mariana-martins/FitMySpace/commit/b8b1004178aff7fa6a5bd1af5b6d053be1ad3552))
* **select:** add Select and SelectField form components and tokens ([6a206b5](https://github.com/mariana-martins/FitMySpace/commit/6a206b57edc814e7d6bf812dba0adac7570bf4c6))
* **skeleton:** add Skeleton loading placeholder component and tokens ([49c49b8](https://github.com/mariana-martins/FitMySpace/commit/49c49b8b334b8edd79264410c625444ed9def3e6))
* **switch:** add Switch form component and tokens ([13d71c3](https://github.com/mariana-martins/FitMySpace/commit/13d71c306639adf17ee81ccf5ffe1b8d770a2a9b))
* **textarea:** add Textarea and TextareaField form components and tokens ([46c646b](https://github.com/mariana-martins/FitMySpace/commit/46c646bb5d0b2af3512286d95b7286aee0b64a44))

# [0.2.0](https://github.com/mariana-martins/FitMySpace/compare/v0.1.0...v0.2.0) (2026-11-11)

### Bug Fixes

* **button:** allow submit and reset types ([2043dab](https://github.com/mariana-martins/FitMySpace/commit/2043daba0909e020737f12671451f845207f6f7b))
* **tokens:** darken utility-warning text base for contrast ([2b8ff64](https://github.com/mariana-martins/FitMySpace/commit/2b8ff649348d05265cccd00fe5c6ecc614f28a05))
* **tokens:** enforce WCAG contrast and button a11y ([df2e386](https://github.com/mariana-martins/FitMySpace/commit/df2e38660a37f6e32d54bb668e5559cb7d91e9a5))

### Features

* add storybook addon-designs and integrate figma link for button component ([8dc9ae8](https://github.com/mariana-martins/FitMySpace/commit/8dc9ae8059c16ba85f2887d10be9e0dab0c930d0))
* configure storybook linting, test scripts, and button interaction tests ([0a2630e](https://github.com/mariana-martins/FitMySpace/commit/0a2630e9798380c4deeef68f6a770399d6c190c3))
* **design-system:** add CopyTokenButton helper and update stories and docs ([96ba42d](https://github.com/mariana-martins/FitMySpace/commit/96ba42da36ba291aba7dffc2166de3a026a3af69))
* **design-system:** add ghost button appearance and input endAction ([08c222c](https://github.com/mariana-martins/FitMySpace/commit/08c222ca40c8ac9866c65f7cccf2cc6c0ae2e370))
* **design-system:** build token-driven foundation pages and docs json ([55e4a84](https://github.com/mariana-martins/FitMySpace/commit/55e4a846553c0d0a9244c47fd4d56497449dcab3))
* **design-system:** expand foundation tokens, regroup stories and add Stylelint ([806896c](https://github.com/mariana-martins/FitMySpace/commit/806896c022323d6990ce6b4db473579b0cce6569))
* **input:** add Input component and tier-3 tokens ([9f1ff66](https://github.com/mariana-martins/FitMySpace/commit/9f1ff66ea0636b4b8ecaab6a982b2aefbaa43ad9))
* **text-field:** add TextField and Radix Label ([c996a2d](https://github.com/mariana-martins/FitMySpace/commit/c996a2d6d2ef6ba0f74fab1a7985b629b43141e5))
* **tokens:** add ghost button and transparent colour tokens ([b1d1296](https://github.com/mariana-martins/FitMySpace/commit/b1d1296dfb6e9a1e960838ad73007302b77b8a08))

# 0.1.0 (2026-06-30)


### Features

*  define border-width design system variables ([d681e26](https://github.com/mariana-martins/FitMySpace/commit/d681e2650966fd9db9427992efc1901e7d9e8247))
* add design system introduction story and update documentation ([9f4874d](https://github.com/mariana-martins/FitMySpace/commit/9f4874d81a2af1fdeed71071de74592140b51f6c))
* add large semantic radii tokens and introduce Radii documentation in Storybook ([6e1e356](https://github.com/mariana-martins/FitMySpace/commit/6e1e356ff45ed1f09c78fc36680845d10cc43913))
* add letter spacing tokens and define semantic typography system ([99e6fe2](https://github.com/mariana-martins/FitMySpace/commit/99e6fe210caf223a5bac29fac4d958b05685fe79))
* add semantic radii and spacing tokens to design system definitions ([1c6cfae](https://github.com/mariana-martins/FitMySpace/commit/1c6cfaef5ccb294cfe317f9338761c1643529eb1))
* add Spacing foundation documentation to Storybook and reorganize typography components ([09964b2](https://github.com/mariana-martins/FitMySpace/commit/09964b29df50cfa844a2dc35bb30212186060e94))
* add tabIndex -1 to disabled buttons using asChild for improved accessibility ([5e4b813](https://github.com/mariana-martins/FitMySpace/commit/5e4b813bc6bc77c659051676eefb6805bc6fffa4))
* **design-system:** add Button component and tier-3 tokens ([8bdf83a](https://github.com/mariana-martins/FitMySpace/commit/8bdf83a6ce9e93f830b5018aa32b0e45f0011cf0))
* **design-system:** implement foundational typography components ([4c6a73c](https://github.com/mariana-martins/FitMySpace/commit/4c6a73c7f12b22bba2899ebf76afefd89a116ca3))
* **design-system:** implement Tier 1 core design tokens ([fe1ea6f](https://github.com/mariana-martins/FitMySpace/commit/fe1ea6fdac0dbb3ea397bc1933ab35a4ea9de22e))
* **design-system:** implement tier 2 semantic color tokens and restructure tokens folder ([87c8d62](https://github.com/mariana-martins/FitMySpace/commit/87c8d623f59fdbc8da6d7dad3a410117f548bae3))
* integrate Storybook with Vitest and initialize design system structure ([d7d3232](https://github.com/mariana-martins/FitMySpace/commit/d7d32320324be81ccb5433b5cd78ddb371f5c9dc))
* **tokens:** introduce tier-3 button tokens and update subtle colors ([9081f2e](https://github.com/mariana-martins/FitMySpace/commit/9081f2ee56316fa117d636fa8b7617acac2ae916))
