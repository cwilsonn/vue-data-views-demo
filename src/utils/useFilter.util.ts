// Third-party
import {
  filter as _filter,
  isEqual as _isEqual,
  negate as _negate,
  lt as _lt,
  lte as _lte,
  gt as _gt,
  gte as _gte,
} from 'lodash-es';

// Types
import type { FilterCondition } from '@/types/composables/useFilter.types';

/**
 * A constant object defining all available filter condition keys.
 * These keys are used to identify the condition functions.
 */
export const filterConditions = {
  eq: 'eq',
  ne: 'ne',
  lt: 'lt',
  lte: 'lte',
  gt: 'gt',
  gte: 'gte',
  in: 'in',
  nin: 'nin',
  between: 'between',
  regex: 'regex',
  empty: 'empty',
  notEmpty: 'notEmpty',
} as const;

/**
 * A mapping of filter condition keys to their human-readable labels.
 * These labels are typically used in UI components.
 */
export const filterConditionLabels = {
  eq: 'Equals',
  ne: 'Not equals',
  lt: 'Less than',
  lte: 'Less than or equal',
  gt: 'Greater than',
  gte: 'Greater than or equal',
  in: 'Includes',
  nin: 'Does not include',
  between: 'Between',
  regex: 'Regex',
  empty: 'Empty',
  notEmpty: 'Not empty',
};

/**
 * A mapping of filter condition keys to their descriptive phrases.
 * These descriptions are useful for tooltips or detailed UI explanations.
 */
export const filterConditionDescriptions = {
  eq: 'is equal to',
  ne: 'is not equal to',
  lt: 'is less than',
  lte: 'is less than or equal to',
  gt: 'is greater than',
  gte: 'is greater than or equal to',
  in: 'is one of',
  nin: 'is not one of',
  between: 'is between',
  regex: 'matches regex',
  empty: 'is empty',
  notEmpty: 'is not empty',
};

/**
 * A mapping of filter condition keys to their symbolic representations.
 * These symbols are useful for compact UI displays.
 */
export const filterConditionSymbols = {
  eq: '=',
  ne: '≠',
  lt: '<',
  lte: '≤',
  gt: '>',
  gte: '≥',
  in: 'includes',
  nin: '!includes',
  between: '-',
  regex: '∼',
  empty: '∅',
  notEmpty: '≠ ∅',
};

/**
 * A mapping of filter condition keys to their corresponding functions.
 * These functions implement the actual filtering logic.
 */
export const conditionFns: Record<
  Extract<FilterCondition, string>,
  (a: any, b: any) => boolean
> = {
  eq: _isEqual,
  ne: _negate(_isEqual),
  lt: _lt,
  lte: _lte,
  gt: _gt,
  gte: _gte,
  in: (a, b) => (Array.isArray(a) || typeof a === 'string') && a.includes(b),
  nin: (a, b) => (Array.isArray(a) || typeof a === 'string') && !a.includes(b),
  between: (value, range) =>
    Array.isArray(range) &&
    range.length === 2 &&
    value >= range[0] &&
    value <= range[1],
  regex: (value, pattern) => {
    if (typeof value !== 'string' || typeof pattern !== 'string') return false;
    try {
      const re = new RegExp(pattern);
      return re.test(value);
    } catch {
      return false; // Invalid regex
    }
  },
  empty: (value) => value == null || value === '',
  notEmpty: (value) => value != null && value !== '',
};
