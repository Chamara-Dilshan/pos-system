// ============================================================================
// CloudPOS - Centralized Color System
// ============================================================================
// All colors are managed from this single file for consistency across the app.
// Uses Tailwind CSS color palette conventions (50-900 shades).
// ============================================================================

export const colorScheme = {
  // ─────────────────────────────────────────────────────────────────────────
  // PRIMARY - Blue
  // Use for: main actions, links, primary buttons, active states
  // ─────────────────────────────────────────────────────────────────────────
  primary: {
    50:  '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',   // Main
    600: '#2563eb',   // Hover
    700: '#1d4ed8',   // Active
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS - Green
  // Use for: confirmations, success messages, positive actions, completed
  // ─────────────────────────────────────────────────────────────────────────
  success: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',   // Main
    600: '#16a34a',   // Hover
    700: '#15803d',   // Active
    800: '#166534',
    900: '#14532d',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DANGER - Red
  // Use for: errors, deletions, critical alerts, destructive actions
  // ─────────────────────────────────────────────────────────────────────────
  danger: {
    50:  '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',   // Main
    600: '#dc2626',   // Hover
    700: '#b91c1c',   // Active
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // WARNING - Orange
  // Use for: low stock alerts, caution states, pending actions
  // ─────────────────────────────────────────────────────────────────────────
  warning: {
    50:  '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',   // Main
    600: '#ea580c',   // Hover
    700: '#c2410c',   // Active
    800: '#9a3412',
    900: '#7c2d12',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INFO - Cyan
  // Use for: informational messages, tips, help text
  // ─────────────────────────────────────────────────────────────────────────
  info: {
    50:  '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',   // Main
    600: '#0891b2',   // Hover
    700: '#0e7490',   // Active
    800: '#155e75',
    900: '#164e63',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEUTRAL - Gray
  // Use for: text, borders, backgrounds, disabled states
  // ─────────────────────────────────────────────────────────────────────────
  neutral: {
    white: '#ffffff',
    50:    '#f9fafb',
    100:   '#f3f4f6',
    200:   '#e5e7eb',
    300:   '#d1d5db',
    400:   '#9ca3af',
    500:   '#6b7280',
    600:   '#4b5563',
    700:   '#374151',
    800:   '#1f2937',
    900:   '#111827',
    black: '#000000',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PURPLE - Violet
  // Use for: admin badges, premium features, special highlights
  // ─────────────────────────────────────────────────────────────────────────
  purple: {
    50:  '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',   // Main
    600: '#9333ea',   // Hover
    700: '#7e22ce',   // Active
    800: '#6b21a8',
    900: '#581c87',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // INDIGO - Deep Blue
  // Use for: secondary accents, alternative primary, charts
  // ─────────────────────────────────────────────────────────────────────────
  indigo: {
    50:  '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',   // Main
    600: '#4f46e5',   // Hover
    700: '#4338ca',   // Active
    800: '#3730a3',
    900: '#312e81',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TEAL - Blue-Green
  // Use for: charts, data visualization, alternative success
  // ─────────────────────────────────────────────────────────────────────────
  teal: {
    50:  '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',   // Main
    600: '#0d9488',   // Hover
    700: '#0f766e',   // Active
    800: '#115e59',
    900: '#134e4a',
  },
};

// ============================================================================
// TAILWIND CLASS MAPPINGS
// ============================================================================
// Maps semantic color names to Tailwind CSS class names

const colorMap = {
  primary:  'blue',
  success:  'green',
  danger:   'red',
  warning:  'orange',
  info:     'cyan',
  neutral:  'gray',
  purple:   'purple',
  indigo:   'indigo',
  teal:     'teal',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a Tailwind color class
 * @param {string} type     - Color type (primary, success, danger, etc.)
 * @param {number} shade    - Color shade (50-900)
 * @param {string} property - CSS property (bg, text, border, ring)
 * @returns {string} Tailwind class
 */
export const getColorClass = (type, shade = 500, property = 'bg') => {
  const color = colorMap[type] || 'gray';
  return `${property}-${color}-${shade}`;
};

/**
 * Get hex color value from color scheme
 * @param {string} type  - Color type (primary, success, etc.)
 * @param {number} shade - Color shade (50-900)
 * @returns {string} Hex color value
 */
export const getHexColor = (type, shade = 500) => {
  return colorScheme[type]?.[shade] || colorScheme.neutral[500];
};

// ============================================================================
// BUTTON STYLES
// ============================================================================
// Pre-configured button classes with hover and focus states

export const buttonColors = {
  // ── Solid Buttons ─────────────────────────────────────────────────────────
  primary:   'bg-blue-600   hover:bg-blue-700   active:bg-blue-800   text-white focus:ring-blue-500',
  success:   'bg-green-600  hover:bg-green-700  active:bg-green-800  text-white focus:ring-green-500',
  danger:    'bg-red-600    hover:bg-red-700    active:bg-red-800    text-white focus:ring-red-500',
  warning:   'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white focus:ring-orange-500',
  info:      'bg-cyan-600   hover:bg-cyan-700   active:bg-cyan-800   text-white focus:ring-cyan-500',
  secondary: 'bg-gray-200   hover:bg-gray-300   active:bg-gray-400   text-gray-800 focus:ring-gray-500',
  dark:      'bg-gray-800   hover:bg-gray-900   active:bg-gray-950   text-white focus:ring-gray-500',

  // ── Outline Buttons ───────────────────────────────────────────────────────
  outlinePrimary:   'border-2 border-blue-600   text-blue-600   hover:bg-blue-50   active:bg-blue-100',
  outlineSuccess:   'border-2 border-green-600  text-green-600  hover:bg-green-50  active:bg-green-100',
  outlineDanger:    'border-2 border-red-600    text-red-600    hover:bg-red-50    active:bg-red-100',
  outlineWarning:   'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 active:bg-orange-100',
  outlineSecondary: 'border-2 border-gray-300   text-gray-700   hover:bg-gray-50   active:bg-gray-100',

  // ── Ghost Buttons ─────────────────────────────────────────────────────────
  ghostPrimary: 'text-blue-600  hover:bg-blue-50  active:bg-blue-100',
  ghostDanger:  'text-red-600   hover:bg-red-50   active:bg-red-100',
  ghostNeutral: 'text-gray-600  hover:bg-gray-100 active:bg-gray-200',

  // ── Disabled State ────────────────────────────────────────────────────────
  disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
};

// ============================================================================
// BADGE STYLES
// ============================================================================
// Lightweight labels for status, categories, and tags

export const badgeColors = {
  primary:  'bg-blue-100   text-blue-800   border border-blue-200',
  success:  'bg-green-100  text-green-800  border border-green-200',
  danger:   'bg-red-100    text-red-800    border border-red-200',
  warning:  'bg-orange-100 text-orange-800 border border-orange-200',
  info:     'bg-cyan-100   text-cyan-800   border border-cyan-200',
  neutral:  'bg-gray-100   text-gray-800   border border-gray-200',
  purple:   'bg-purple-100 text-purple-800 border border-purple-200',
  indigo:   'bg-indigo-100 text-indigo-800 border border-indigo-200',
  teal:     'bg-teal-100   text-teal-800   border border-teal-200',
};

// ============================================================================
// STATUS COLORS
// ============================================================================
// For order status, product availability, user status, etc.

export const statusColors = {
  // ── Order Status ──────────────────────────────────────────────────────────
  completed: 'bg-green-100  text-green-800  border border-green-200',
  pending:   'bg-orange-100 text-orange-800 border border-orange-200',
  cancelled: 'bg-gray-100   text-gray-800   border border-gray-200',
  refunded:  'bg-red-100    text-red-800    border border-red-200',

  // ── Payment Status ────────────────────────────────────────────────────────
  paid:      'bg-green-100  text-green-800  border border-green-200',
  unpaid:    'bg-red-100    text-red-800    border border-red-200',
  partial:   'bg-orange-100 text-orange-800 border border-orange-200',
  cash:      'bg-green-50   text-green-700  border border-green-200',
  card:      'bg-blue-50    text-blue-700   border border-blue-200',

  // ── General Status ────────────────────────────────────────────────────────
  active:    'bg-green-100  text-green-800  border border-green-200',
  inactive:  'bg-gray-100   text-gray-600   border border-gray-200',
  blocked:   'bg-red-100    text-red-800    border border-red-200',

  // ── Stock Status ──────────────────────────────────────────────────────────
  inStock:   'bg-green-100  text-green-800  border border-green-200',
  lowStock:  'bg-orange-100 text-orange-800 border border-orange-200',
  outOfStock:'bg-red-100    text-red-800    border border-red-200',
};

// ============================================================================
// GRADIENT COLORS
// ============================================================================
// For cards, headers, and decorative elements

export const gradientColors = {
  // ── Simple Gradients ──────────────────────────────────────────────────────
  primary:  'bg-gradient-to-r from-blue-500   to-blue-600',
  success:  'bg-gradient-to-r from-green-500  to-green-600',
  danger:   'bg-gradient-to-r from-red-500    to-red-600',
  warning:  'bg-gradient-to-r from-orange-400 to-orange-500',
  info:     'bg-gradient-to-r from-cyan-500   to-cyan-600',
  purple:   'bg-gradient-to-r from-purple-500 to-purple-600',
  indigo:   'bg-gradient-to-r from-indigo-500 to-indigo-600',
  teal:     'bg-gradient-to-r from-teal-500   to-teal-600',
  dark:     'bg-gradient-to-r from-gray-700   to-gray-800',

  // ── Multi-color Gradients ─────────────────────────────────────────────────
  sunset:   'bg-gradient-to-r from-orange-500 via-pink-500  to-purple-500',
  ocean:    'bg-gradient-to-r from-cyan-500   via-blue-500  to-indigo-500',
  forest:   'bg-gradient-to-r from-green-500  via-teal-500  to-cyan-500',
  fire:     'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',

  // ── Subtle Gradients (for backgrounds) ────────────────────────────────────
  subtlePrimary: 'bg-gradient-to-br from-blue-50  to-indigo-100',
  subtleSuccess: 'bg-gradient-to-br from-green-50 to-teal-100',
  subtleWarning: 'bg-gradient-to-br from-orange-50 to-yellow-100',
  subtleNeutral: 'bg-gradient-to-br from-gray-50  to-gray-100',
};

// ============================================================================
// ICON STYLES
// ============================================================================
// Icon colors and background combinations

export const iconBgColors = {
  primary:  'bg-blue-100',
  success:  'bg-green-100',
  danger:   'bg-red-100',
  warning:  'bg-orange-100',
  info:     'bg-cyan-100',
  neutral:  'bg-gray-100',
  purple:   'bg-purple-100',
  indigo:   'bg-indigo-100',
  teal:     'bg-teal-100',
};

export const iconColors = {
  primary:  'text-blue-600',
  success:  'text-green-600',
  danger:   'text-red-600',
  warning:  'text-orange-600',
  info:     'text-cyan-600',
  neutral:  'text-gray-600',
  purple:   'text-purple-600',
  indigo:   'text-indigo-600',
  teal:     'text-teal-600',
};

// Combined icon with background
export const iconWithBg = {
  primary:  'bg-blue-100   text-blue-600',
  success:  'bg-green-100  text-green-600',
  danger:   'bg-red-100    text-red-600',
  warning:  'bg-orange-100 text-orange-600',
  info:     'bg-cyan-100   text-cyan-600',
  neutral:  'bg-gray-100   text-gray-600',
  purple:   'bg-purple-100 text-purple-600',
  indigo:   'bg-indigo-100 text-indigo-600',
  teal:     'bg-teal-100   text-teal-600',
};

// ============================================================================
// ALERT / NOTIFICATION STYLES
// ============================================================================
// For toast messages, alerts, and notifications

export const alertColors = {
  success: {
    bg:     'bg-green-50',
    border: 'border-green-400',
    text:   'text-green-800',
    icon:   'text-green-500',
    full:   'bg-green-50 border-l-4 border-green-400 text-green-800',
  },
  error: {
    bg:     'bg-red-50',
    border: 'border-red-400',
    text:   'text-red-800',
    icon:   'text-red-500',
    full:   'bg-red-50 border-l-4 border-red-400 text-red-800',
  },
  warning: {
    bg:     'bg-orange-50',
    border: 'border-orange-400',
    text:   'text-orange-800',
    icon:   'text-orange-500',
    full:   'bg-orange-50 border-l-4 border-orange-400 text-orange-800',
  },
  info: {
    bg:     'bg-cyan-50',
    border: 'border-cyan-400',
    text:   'text-cyan-800',
    icon:   'text-cyan-500',
    full:   'bg-cyan-50 border-l-4 border-cyan-400 text-cyan-800',
  },
};

// ============================================================================
// INPUT / FORM STYLES
// ============================================================================
// For form inputs, selects, and textareas

export const inputColors = {
  // Base + focus tokens let pages compose inputs without duplicating classes
  base:     'bg-white border border-gray-200 text-gray-900 placeholder-gray-400',
  focus:    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',

  // Legacy aliases used by shared components
  default:  'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500',
  error:    'border-red-500  focus:border-red-500  focus:ring-red-500  text-red-900 placeholder-red-400',
  success:  'border-green-500 focus:border-green-500 focus:ring-green-500',
  disabled: 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed',
};

// ============================================================================
// TABLE STYLES
// ============================================================================
// For table rows and cells

export const tableColors = {
  wrapper:   'bg-white border border-gray-200 shadow-sm',
  header:     'bg-gray-50 text-gray-700',
  rowDefault: 'bg-white hover:bg-gray-50',
  rowAlt:     'bg-gray-50 hover:bg-gray-100',
  rowSelected:'bg-blue-50 hover:bg-blue-100',
  row:        'bg-white hover:bg-gray-50',
  border:     'border-gray-200',
};

// ============================================================================
// SIDEBAR / NAVIGATION STYLES
// ============================================================================
// For navigation items and menus

export const navColors = {
  default:    'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  active:     'bg-blue-50 text-blue-700 border-r-2 border-blue-600',
  activeIcon: 'text-blue-600',
  icon:       'text-gray-400 group-hover:text-gray-600',
};

// ============================================================================
// CARD STYLES
// ============================================================================
// For card components

export const cardColors = {
  default:   'bg-white border border-gray-200 shadow-sm',
  elevated:  'bg-white border border-gray-100 shadow-md',
  outlined:  'bg-white border-2 border-gray-200',
  filled:    'bg-gray-50 border border-gray-200',
  primary:   'bg-blue-50 border border-blue-200',
  success:   'bg-green-50 border border-green-200',
  danger:    'bg-red-50 border border-red-200',
  warning:   'bg-orange-50 border border-orange-200',
};

// ============================================================================
// CHART COLORS
// ============================================================================
// Color palette for charts and data visualization

export const chartColors = {
  palette: [
    colorScheme.primary[500],    // Blue
    colorScheme.success[500],    // Green
    colorScheme.warning[500],    // Orange
    colorScheme.danger[500],     // Red
    colorScheme.purple[500],     // Purple
    colorScheme.info[500],       // Cyan
    colorScheme.indigo[500],     // Indigo
    colorScheme.teal[500],       // Teal
  ],
  light: [
    colorScheme.primary[200],
    colorScheme.success[200],
    colorScheme.warning[200],
    colorScheme.danger[200],
    colorScheme.purple[200],
    colorScheme.info[200],
    colorScheme.indigo[200],
    colorScheme.teal[200],
  ],
};

// ============================================================================
// SEMANTIC TOKENS
// ============================================================================
// Common UI tokens mapped to specific colors

export const tokens = {
  // ── Text Colors ───────────────────────────────────────────────────────────
  text: {
    primary:   'text-gray-900',
    secondary: 'text-gray-600',
    muted:     'text-gray-500',
    disabled:  'text-gray-400',
    inverse:   'text-white',
    link:      'text-blue-600 hover:text-blue-700',
    error:     'text-red-600',
    success:   'text-green-600',
  },

  // ── Background Colors ─────────────────────────────────────────────────────
  bg: {
    page:      'bg-gray-50',
    card:      'bg-white',
    sidebar:   'bg-white',
    header:    'bg-white',
    hover:     'bg-gray-50',
    selected:  'bg-blue-50',
    disabled:  'bg-gray-100',
  },

  // ── Border Colors ─────────────────────────────────────────────────────────
  border: {
    default:   'border-gray-200',
    light:     'border-gray-100',
    strong:    'border-gray-300',
    hover:     'border-gray-300',
    focus:     'border-blue-500',
    error:     'border-red-500',
    success:   'border-green-500',
  },

  // ── Ring Colors (focus) ───────────────────────────────────────────────────
  ring: {
    default:   'ring-blue-500',
    error:     'ring-red-500',
    success:   'ring-green-500',
  },
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default colorScheme;
