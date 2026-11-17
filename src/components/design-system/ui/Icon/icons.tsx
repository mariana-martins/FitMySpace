import {
  ArrowRight,
  ArrowUpDown,
  ArrowUpRight,
  Bath,
  Bed,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  CookingPot,
  Copy,
  Download,
  Eye,
  EyeOff,
  Filter,
  Home,
  ImageIcon,
  Info,
  Mail,
  MapPin,
  Minus,
  PackageCheck,
  PackageOpen,
  Plus,
  RotateCcw,
  Ruler,
  Search,
  SearchX,
  SlidersHorizontal,
  Sofa,
  Sparkles,
  Star,
  Store,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';

import type { ReactElement } from 'react';

/* ---------------------------------------------------------------
 * The icons the design system ships
 *
 * This is the only file in the design system that imports
 * `lucide-react`. Because every icon is drawn from here, the set is
 * enumerable: the `Used in the Design System` story renders this
 * object, so the list cannot drift from what the components actually
 * use, and a component's `icon` prop can be typed as the names below.
 *
 * `usedIn` says who draws the icon. An icon that only stories use is
 * listed as such: it is part of the set people may pick for an `icon`
 * prop, but no component draws it by itself.
 *
 * `focusable="false"` keeps an old Blink from putting the SVG itself
 * in the tab order behind the control that owns it.
 *
 * The artwork is not ours: every icon here is drawn by Lucide
 * (https://lucide.dev, ISC licence). This file reuses their icons and
 * never redraws them, which is why the credit belongs here as well as
 * on the Icon page.
 * --------------------------------------------------------------- */

type RegisteredIcon = {
  /** The icon element, drawn inside an `Icon`. */
  icon: ReactElement;
  /** Who draws it, so a reader knows whether a component owns it or only stories do. */
  usedIn: string;
};

export const DS_ICONS = {
  'arrow-right': { icon: <ArrowRight focusable="false" />, usedIn: 'Button stories (example)' },
  'arrow-up-down': { icon: <ArrowUpDown focusable="false" />, usedIn: 'Select stories (example)' },
  'arrow-up-right': {
    icon: <ArrowUpRight focusable="false" />,
    usedIn: 'Link, when the link opens a new tab',
  },
  bath: { icon: <Bath focusable="false" />, usedIn: 'Chip and Breadcrumb stories (room example)' },
  bed: { icon: <Bed focusable="false" />, usedIn: 'Chip stories (room example)' },
  check: {
    icon: <Check focusable="false" />,
    usedIn: 'Checkbox, Chip, Select, and the docs copy button',
  },
  'chevron-down': { icon: <ChevronDown focusable="false" />, usedIn: 'Select trigger' },
  'chevron-left': { icon: <ChevronLeft focusable="false" />, usedIn: 'Pagination previous step' },
  'chevron-right': {
    icon: <ChevronRight focusable="false" />,
    usedIn: 'Breadcrumb separator, Pagination next step',
  },
  'chevron-up': { icon: <ChevronUp focusable="false" />, usedIn: 'Select list, scroll up' },
  'circle-alert': {
    icon: <CircleAlert focusable="false" />,
    usedIn: 'The error variant of Alert and Toast, and every field error',
  },
  'circle-check': {
    icon: <CircleCheck focusable="false" />,
    usedIn: 'The success variant of Alert and Toast',
  },
  clock: { icon: <Clock focusable="false" />, usedIn: 'Alert and Badge stories (example)' },
  'cooking-pot': { icon: <CookingPot focusable="false" />, usedIn: 'Chip stories (room example)' },
  copy: { icon: <Copy focusable="false" />, usedIn: 'The docs copy button' },
  download: { icon: <Download focusable="false" />, usedIn: 'Button stories (example)' },
  eye: { icon: <Eye focusable="false" />, usedIn: 'Input stories (show a password)' },
  'eye-off': { icon: <EyeOff focusable="false" />, usedIn: 'Input stories (hide a password)' },
  filter: { icon: <Filter focusable="false" />, usedIn: 'Tooltip stories (toolbar)' },
  home: { icon: <Home focusable="false" />, usedIn: 'Breadcrumb home step' },
  image: { icon: <ImageIcon focusable="false" />, usedIn: 'Foundation Size stories (example)' },
  info: {
    icon: <Info focusable="false" />,
    usedIn: 'The information variant of Alert and Toast',
  },
  mail: { icon: <Mail focusable="false" />, usedIn: 'Input and TextField stories (example)' },
  'map-pin': { icon: <MapPin focusable="false" />, usedIn: 'Alert stories (example)' },
  minus: { icon: <Minus focusable="false" />, usedIn: 'Checkbox, in its indeterminate state' },
  'package-check': { icon: <PackageCheck focusable="false" />, usedIn: 'Badge stories (example)' },
  'package-open': {
    icon: <PackageOpen focusable="false" />,
    usedIn: 'EmptyState stories (example)',
  },
  plus: { icon: <Plus focusable="false" />, usedIn: 'Button stories (example)' },
  'rotate-ccw': {
    icon: <RotateCcw focusable="false" />,
    usedIn: 'Tooltip stories (clear filters)',
  },
  ruler: { icon: <Ruler focusable="false" />, usedIn: 'Input stories (a measured size)' },
  search: { icon: <Search focusable="false" />, usedIn: 'SearchField, and the search recipes' },
  'search-x': { icon: <SearchX focusable="false" />, usedIn: 'EmptyState, its default icon' },
  'sliders-horizontal': {
    icon: <SlidersHorizontal focusable="false" />,
    usedIn: 'EmptyState and Tooltip stories (example)',
  },
  sofa: { icon: <Sofa focusable="false" />, usedIn: 'Chip stories (room example)' },
  sparkles: { icon: <Sparkles focusable="false" />, usedIn: 'Badge stories (example)' },
  star: { icon: <Star focusable="false" />, usedIn: 'Button stories (example)' },
  store: { icon: <Store focusable="false" />, usedIn: 'Select and SelectField stories (example)' },
  'trash-2': { icon: <Trash2 focusable="false" />, usedIn: 'Button stories (destructive example)' },
  'triangle-alert': {
    icon: <TriangleAlert focusable="false" />,
    usedIn: 'The warning variant of Alert and Toast',
  },
  x: {
    icon: <X focusable="false" />,
    usedIn: 'The Close of Dialog and Toast, the Clear of SearchField',
  },
} satisfies Record<string, RegisteredIcon>;

/** The name a component takes when it draws one of these icons. */
export type IconName = keyof typeof DS_ICONS;
