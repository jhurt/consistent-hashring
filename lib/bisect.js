/**
 *
 * Bisection algorithms.
 *
 * @author Jason Hurt
 *
 * As close as possible to the CPython implementations: https://github.com/python/cpython/blob/3.8/Lib/bisect.py,
 * including the non-descriptive variable names a and x
 */

/**
 * @returns the index where to insert item x in list a, assuming a is sorted.
 * The return value i is such that all e in a[:i] have e <= x, and all e in
 * a[i:] have e > x.  So if x already appears in the list, a.insert(x) will
 * insert just after the rightmost x already there.
 *
 * Optional args lo (default 0) and hi (default len(a)) bound the
 * slice of a to be searched.
 */
const bisectRight = function (a, x, lo = 0, hi) {
  if (lo < 0) {
    throw 'lo must be non-negative';
  }
  hi = hi || a.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (x < a[mid]) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
};

/**
 * Insert item x in list a, and keep it sorted assuming a is sorted.
 *
 * If x is already in a, insert it to the right of the rightmost x.
 *
 * Optional args lo (default 0) and hi (default a.length) bound the
 * slice of a to be searched.
 */
const insortRight = function (a, x, lo = 0, hi) {
  a.splice(bisectRight(a, x, lo, hi), 0, x);
};

/**
 *
 * @returns the index where to insert item x in list a, assuming a is sorted.
 * The return value i is such that all e in a[:i] have e < x, and all e in
 * a[i:] have e >= x.  So if x already appears in the list, a.insert(x) will
 * insert just before the leftmost x already there.
 *
 * Optional args lo (default 0) and hi (default a.length) bound the
 * slice of a to be searched.
 */
const bisectLeft = function (a, x, lo = 0, hi) {
  if (lo < 0) {
    throw 'lo must be non-negative';
  }
  hi = hi || a.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] < x) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
};

/**
 * Insert item x in list a, and keep it sorted assuming a is sorted.
 *
 * If x is already in a, insert it to the left of the leftmost x.
 *
 * Optional args lo (default 0) and hi (default a.length) bound the
 * slice of a to be searched.
 */
const insortLeft = function (a, x, lo = 0, hi) {
  a.splice(bisectLeft(a, x, lo, hi), 0, x);
};

module.exports = {bisectLeft, bisectRight, insortLeft, insortRight};
