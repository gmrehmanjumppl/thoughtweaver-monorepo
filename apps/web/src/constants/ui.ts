/**
 * UI Constants
 * 
 * Centralized constants for UI-related values to ensure consistency across the application.
 * 
 * @created v1.6.1 - Phase 1: Extract hardcoded UI values
 * @author CTO Review Phase 1
 */

// ============================================================================
// LAYOUT & SPACING
// ============================================================================

/**
 * Standard header height used across all pages
 * Used in: HomePage, ConversationView, WorkflowBuilder, etc.
 */
export const HEADER_HEIGHT = '3.5rem'; // 56px / h-14

/**
 * Standard sidebar width
 */
export const SIDEBAR_WIDTH = '16rem'; // 256px

/**
 * Standard content max-width for centered layouts
 */
export const CONTENT_MAX_WIDTH = '80rem'; // 1280px / max-w-5xl

/**
 * Standard content max-width for wider layouts
 */
export const CONTENT_MAX_WIDTH_WIDE = '96rem'; // 1536px / max-w-7xl

// ============================================================================
// ANIMATION & TIMING
// ============================================================================

/**
 * Standard transition duration for most UI elements
 */
export const TRANSITION_DURATION = 200; // milliseconds

/**
 * Debounce delay for search inputs
 */
export const SEARCH_DEBOUNCE_DELAY = 300; // milliseconds

/**
 * Auto-save delay for forms
 */
export const AUTOSAVE_DELAY = 1000; // milliseconds

/**
 * Toast notification duration
 */
export const TOAST_DURATION = 3000; // milliseconds

// ============================================================================
// SIZING
// ============================================================================

/**
 * Avatar sizes
 */
export const AVATAR_SIZES = {
  xs: '1.5rem', // 24px
  sm: '2rem',   // 32px
  md: '2.5rem', // 40px
  lg: '3rem',   // 48px
  xl: '4rem',   // 64px
  '2xl': '5rem', // 80px
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZES = {
  xs: '0.75rem', // 12px / w-3 h-3
  sm: '1rem',    // 16px / w-4 h-4
  md: '1.25rem', // 20px / w-5 h-5
  lg: '1.5rem',  // 24px / w-6 h-6
  xl: '2rem',    // 32px / w-8 h-8
} as const;

/**
 * Button heights
 */
export const BUTTON_HEIGHTS = {
  sm: '2rem',    // 32px / h-8
  md: '2.25rem', // 36px / h-9
  lg: '2.5rem',  // 40px / h-10
  xl: '3rem',    // 48px / h-12
} as const;

/**
 * Input heights
 */
export const INPUT_HEIGHTS = {
  sm: '2rem',    // 32px / h-8
  md: '2.25rem', // 36px / h-9
  lg: '2.5rem',  // 40px / h-10
} as const;

// ============================================================================
// CAROUSEL & SCROLLING
// ============================================================================

/**
 * Number of items visible in assistant carousel (desktop)
 */
export const CAROUSEL_VISIBLE_ITEMS_DESKTOP = 8;

/**
 * Number of items visible in assistant carousel (tablet)
 */
export const CAROUSEL_VISIBLE_ITEMS_TABLET = 5;

/**
 * Number of items visible in assistant carousel (mobile)
 */
export const CAROUSEL_VISIBLE_ITEMS_MOBILE = 3;

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Minimum length for assistant name
 */
export const MIN_ASSISTANT_NAME_LENGTH = 2;

/**
 * Maximum length for assistant name
 */
export const MAX_ASSISTANT_NAME_LENGTH = 50;

/**
 * Minimum length for conversation title
 */
export const MIN_CONVERSATION_TITLE_LENGTH = 1;

/**
 * Maximum length for conversation title
 */
export const MAX_CONVERSATION_TITLE_LENGTH = 100;

/**
 * Minimum length for context card content
 */
export const MIN_CONTEXT_CONTENT_LENGTH = 10;

/**
 * Maximum length for context card content
 */
export const MAX_CONTEXT_CONTENT_LENGTH = 5000;

/**
 * Maximum length for prompt input on home page
 * 
 * @phase Phase 2 - Added for HomePage refactoring
 */
export const MAX_PROMPT_LENGTH = 5000;

/**
 * Minimum length for workflow name
 */
export const MIN_WORKFLOW_NAME_LENGTH = 2;

/**
 * Maximum length for workflow name
 */
export const MAX_WORKFLOW_NAME_LENGTH = 50;

/**
 * Maximum number of workflow steps
 */
export const MAX_WORKFLOW_STEPS = 10;

// ============================================================================
// TEXTAREA
// ============================================================================

/**
 * Minimum height for textarea (prompt input)
 */
export const TEXTAREA_MIN_HEIGHT = '120px';

/**
 * Minimum height for small textarea
 */
export const TEXTAREA_MIN_HEIGHT_SM = '80px';

/**
 * Minimum height for context textarea
 */
export const TEXTAREA_MIN_HEIGHT_CONTEXT = '150px';

// ============================================================================
// GRID & LAYOUT
// ============================================================================

/**
 * Number of columns for assistant grid (desktop)
 */
export const ASSISTANT_GRID_COLS_DESKTOP = 3;

/**
 * Number of columns for assistant grid (tablet)
 */
export const ASSISTANT_GRID_COLS_TABLET = 2;

/**
 * Number of columns for assistant grid (mobile)
 */
export const ASSISTANT_GRID_COLS_MOBILE = 1;

/**
 * Gap between grid items
 */
export const GRID_GAP = '1rem'; // 16px / gap-4

/**
 * Gap between grid items (large)
 */
export const GRID_GAP_LG = '1.5rem'; // 24px / gap-6

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

/**
 * Z-index values for layering elements
 * Lower values are behind, higher values are in front
 */
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// LOADING STATES
// ============================================================================

/**
 * Loading spinner size (default)
 */
export const LOADING_SPINNER_SIZE = '2rem'; // 32px / w-8 h-8

/**
 * Loading spinner border width
 */
export const LOADING_SPINNER_BORDER_WIDTH = '4px'; // border-4

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type AvatarSize = keyof typeof AVATAR_SIZES;
export type IconSize = keyof typeof ICON_SIZES;
export type ButtonHeight = keyof typeof BUTTON_HEIGHTS;
export type InputHeight = keyof typeof INPUT_HEIGHTS;
export type ZIndex = keyof typeof Z_INDEX;
