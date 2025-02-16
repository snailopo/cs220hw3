import assert from "assert";
import { List, node, empty, listToArray, arrayToList } from "../include/lists.js";
import {
  insertOrdered,
  everyNRev,
  everyNCond,
  keepTrendMiddles,
  keepLocalMaxima,
  keepLocalMinima,
  keepLocalMinimaAndMaxima,
  nonNegativeProducts,
  negativeProducts,
  deleteFirst,
  deleteLast,
  squashList,
} from "./lists.js";

describe("insertOrdered", () => {
  it("inserts into an empty list", () => {
    const lst = empty<number>();
    const result = insertOrdered(lst, 5);
    assert.deepStrictEqual(listToArray(result), [5]);
  });

  it("inserts at the beginning", () => {
    const lst = arrayToList([10, 20, 30]);
    const result = insertOrdered(lst, 5);
    assert.deepStrictEqual(listToArray(result), [5, 10, 20, 30]);
  });

  it("inserts in the middle", () => {
    const lst = arrayToList([10, 20, 30]);
    const result = insertOrdered(lst, 25);
    assert.deepStrictEqual(listToArray(result), [10, 20, 25, 30]);
  });

  it("inserts at the end", () => {
    const lst = arrayToList([10, 20, 30]);
    const result = insertOrdered(lst, 40);
    assert.deepStrictEqual(listToArray(result), [10, 20, 30, 40]);
  });

  it("inserts a duplicate element", () => {
    const lst = arrayToList([10, 20, 30]);
    const result = insertOrdered(lst, 20);
    assert.deepStrictEqual(listToArray(result), [10, 20, 20, 30]);
  });

  it("inserts negative numbers properly", () => {
    const lst = arrayToList([-10, 0, 10]);
    const result = insertOrdered(lst, -5);
    assert.deepStrictEqual(listToArray(result), [-10, -5, 0, 10]);
  });

  it("inserts into a single-element list when element is smaller", () => {
    const lst = arrayToList([10]);
    const result = insertOrdered(lst, 5);
    assert.deepStrictEqual(listToArray(result), [5, 10]);
  });

  it("inserts into a single-element list when element is larger", () => {
    const lst = arrayToList([10]);
    const result = insertOrdered(lst, 15);
    assert.deepStrictEqual(listToArray(result), [10, 15]);
  });

  it("inserts correctly when all elements are equal", () => {
    const lst = arrayToList([5, 5, 5]);
    const result = insertOrdered(lst, 5);
    assert.deepStrictEqual(listToArray(result), [5, 5, 5, 5]);
  });

  it("does not mutate the original list", () => {
    const lst = arrayToList([10, 20, 30]);
    const originalArray = listToArray(lst);
    insertOrdered(lst, 25);
    assert.deepStrictEqual(listToArray(lst), originalArray);
  });
});

describe("everyNRev", () => {
  it("returns every nth element in reverse order", () => {
    const lst = arrayToList(["a", "b", "c", "d", "e", "f"]);
    const result = everyNRev(lst, 3);
    assert.deepStrictEqual(listToArray(result), ["f", "c"]);
  });

  it("works correctly with n = 1", () => {
    const lst = arrayToList([1, 2, 3, 4]);
    const result = everyNRev(lst, 1);
    assert.deepStrictEqual(listToArray(result), [4, 3, 2, 1]);
  });

  it("returns an empty list if no nth element exists", () => {
    const lst = arrayToList([1, 2]);
    const result = everyNRev(lst, 3);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns an empty list for an empty input", () => {
    const lst = empty<string>();
    const result = everyNRev(lst, 2);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("works when list length equals n", () => {
    const lst = arrayToList([10, 20, 30]);
    const result = everyNRev(lst, 3);
    assert.deepStrictEqual(listToArray(result), [30]);
  });

  it("returns an empty list when n is greater than list length", () => {
    const lst = arrayToList([10, 20]);
    const result = everyNRev(lst, 5);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("can use node to construct the list", () => {
    const lst = node("x", node("y", node("z", empty())));
    const result = everyNRev(lst, 2);
    assert.deepStrictEqual(listToArray(result), ["y"]);
  });

  it("works correctly with a number list", () => {
    const lst = arrayToList([5, 10, 15, 20]);
    const result = everyNRev(lst, 2);
    assert.deepStrictEqual(listToArray(result), [20, 10]);
  });
});

describe("everyNCond", () => {
  it("returns every nth element among those satisfying the condition", () => {
    const lst = arrayToList([1, 2, 3, 4, 5, 6]);
    const result = everyNCond(lst, 2, x => x % 2 === 0);
    assert.deepStrictEqual(listToArray(result), [4]);
  });

  it("preserves original order", () => {
    const lst = arrayToList([10, 15, 20, 25, 30, 35, 40]);
    const result = everyNCond(lst, 2, x => x > 20);
    assert.deepStrictEqual(listToArray(result), [30, 40]);
  });

  it("returns an empty list if no elements satisfy the condition", () => {
    const lst = arrayToList([1, 2, 3]);
    const result = everyNCond(lst, 2, x => x > 10);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns an empty list for an empty input", () => {
    const lst = empty<number>();
    const result = everyNCond(lst, 3, x => x > 0);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns the full list when n=1 and all satisfy the condition", () => {
    const lst = arrayToList([2, 4, 6]);
    const result = everyNCond(lst, 1, x => x % 2 === 0);
    assert.deepStrictEqual(listToArray(result), [2, 4, 6]);
  });

  it("returns an empty list when the condition is never satisfied", () => {
    const lst = arrayToList([1, 3, 5]);
    const result = everyNCond(lst, 1, x => x % 2 === 0);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("works with a prime-check condition", () => {
    const isPrime = (n: number) => {
      if (n < 2) return false;
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
      }
      return true;
    };
    const lst = arrayToList([2, 4, 3, 6, 5, 8, 7]);
    const result = everyNCond(lst, 2, isPrime);
    assert.deepStrictEqual(listToArray(result), [3, 7]);
  });

  it("can use node to create a list", () => {
    const lst = node(10, node(20, node(30, empty())));
    const result = everyNCond(lst, 2, x => x > 5);
    assert.deepStrictEqual(listToArray(result), [20]);
  });
});

describe("keepTrendMiddles", () => {
  it("keeps the middle element of triples that satisfy the predicate", () => {
    const predicate = (prev: number, curr: number, next: number) => prev < curr && curr < next;
    const lst = arrayToList([1, 2, 3, 2, 3, 4, 5]);
    const result = keepTrendMiddles(lst, predicate);
    assert.deepStrictEqual(listToArray(result), [2, 3, 4]);
  });

  it("returns an empty list if the list is too short", () => {
    const lst = arrayToList([1, 2]);
    const result = keepTrendMiddles(lst, () => true);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns an empty list for an empty input", () => {
    const lst = empty<number>();
    const result = keepTrendMiddles(lst, (a, b, c) => a < b && b < c);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("with exactly three elements and a true predicate returns the middle", () => {
    const lst = arrayToList([4, 5, 6]);
    const result = keepTrendMiddles(lst, () => true);
    assert.deepStrictEqual(listToArray(result), [5]);
  });

  it("with exactly three elements and a false predicate returns empty", () => {
    const lst = arrayToList([4, 5, 6]);
    const result = keepTrendMiddles(lst, () => false);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns empty when predicate always returns false", () => {
    const lst = arrayToList([1, 2, 3, 4, 5]);
    const result = keepTrendMiddles(lst, () => false);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns all possible middles when predicate always returns true", () => {
    const lst = arrayToList([10, 20, 30, 40, 50]);
    const result = keepTrendMiddles(lst, () => true);
    assert.deepStrictEqual(listToArray(result), [20, 30, 40]);
  });
});

describe("keepLocalMaxima", () => {
  it("keeps local maxima", () => {
    const lst = arrayToList([1, 3, 2, 4, 1, 5, 4]);
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [3, 4, 5]);
  });

  it("returns an empty list if there is no local maximum", () => {
    const lst = arrayToList([5, 4, 3, 2, 1]);
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("identifies a local maximum in a three-element list", () => {
    const lst = arrayToList([1, 10, 2]);
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [10]);
  });

  it("returns empty for a list of identical numbers", () => {
    const lst = arrayToList([7, 7, 7, 7]);
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns empty for a strictly increasing list", () => {
    const lst = arrayToList([1, 2, 3, 4, 5]);
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("can be constructed using node", () => {
    const lst = node(2, node(5, node(3, empty())));
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [5]);
  });

  it("handles negative numbers correctly", () => {
    const lst = arrayToList([-5, -2, -4, -1, -3]);
    const result = keepLocalMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [-2, -1]);
  });
});

describe("keepLocalMinima", () => {
  it("keeps local minima", () => {
    const lst = arrayToList([3, 1, 4, 2, 5, 3, 6]);
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), [1, 2, 3]);
  });

  it("returns an empty list if there is no local minimum", () => {
    const lst = arrayToList([1, 2, 3, 4]);
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("identifies a local minimum in a three-element list", () => {
    const lst = arrayToList([10, 2, 15]);
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), [2]);
  });

  it("returns empty for a list of identical numbers", () => {
    const lst = arrayToList([4, 4, 4, 4]);
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns empty for a strictly decreasing list", () => {
    const lst = arrayToList([9, 8, 7, 6]);
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("can be constructed using node", () => {
    const lst = node(10, node(3, node(20, empty())));
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), [3]);
  });

  it("handles negative numbers correctly", () => {
    const lst = arrayToList([-1, -5, -2, -6, -3]);
    const result = keepLocalMinima(lst);
    assert.deepStrictEqual(listToArray(result), [-5, -6]);
  });
});

describe("keepLocalMinimaAndMaxima", () => {
  it("keeps both local minima and maxima", () => {
    const lst = arrayToList([3, 1, 4, 2, 5, 3, 6]);
    const result = keepLocalMinimaAndMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [1, 4, 2, 5, 3]);
  });

  it("returns an empty list if the list is too short", () => {
    const lst = arrayToList([10, 20]);
    const result = keepLocalMinimaAndMaxima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns the correct value for a three-element list", () => {
    const lst = arrayToList([8, 3, 10]);
    const result = keepLocalMinimaAndMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [3]);
  });

  it("returns empty for a constant list", () => {
    const lst = arrayToList([5, 5, 5, 5]);
    const result = keepLocalMinimaAndMaxima(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("returns correct values for an oscillating list", () => {
    const lst = arrayToList([1, 3, 2, 4, 3, 5, 4]);
    const result = keepLocalMinimaAndMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [3, 2, 4, 3, 5]);
  });

  it("can be constructed using node", () => {
    const lst = node(5, node(2, node(8, node(3, empty()))));
    const result = keepLocalMinimaAndMaxima(lst);
    assert.deepStrictEqual(listToArray(result), [2]);
  });
});

describe("nonNegativeProducts", () => {
  it("computes products for nonnegative contiguous segments", () => {
    const lst = arrayToList([2, 3, -1, 0.5, 2]);
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [2, 6, 0.5, 1]);
  });

  it("skips negatives", () => {
    const lst = arrayToList([-2, -3, -4]);
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("works when all elements are nonnegative", () => {
    const lst = arrayToList([1, 2, 3]);
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [1, 2, 6]);
  });

  it("returns an empty list for an empty input", () => {
    const lst = empty<number>();
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("works with a single nonnegative element", () => {
    const lst = arrayToList([7]);
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [7]);
  });

  it("resets product when encountering zero", () => {
    const lst = arrayToList([2, 0, 3, 4]);
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [2, 0, 3, 12]);
  });

  it("handles alternating nonnegative and negative values", () => {
    const lst = arrayToList([4, -1, 5, -2, 6]);
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [4, 5, 6]);
  });

  it("can be constructed using node", () => {
    const lst = node(3, node(3, node(-1, empty())));
    const result = nonNegativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [3, 9]);
  });
});

describe("negativeProducts", () => {
  it("computes products for negative contiguous segments", () => {
    const lst = arrayToList([-3, -6, 2, -2, -1, -2]);
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [-3, 18, -2, 2, -4]);
  });

  it("skips nonnegative numbers", () => {
    const lst = arrayToList([3, 4, 5]);
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("works when all elements are negative", () => {
    const lst = arrayToList([-1, -2, -3]);
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [-1, 2, -6]);
  });

  it("returns an empty list for an empty input", () => {
    const lst = empty<number>();
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("works with a single negative element", () => {
    const lst = arrayToList([-7]);
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [-7]);
  });

  it("skips zeros since zero is nonnegative", () => {
    const lst = arrayToList([-2, 0, -3]);
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [-2, -3]);
  });

  it("handles alternating negatives and positives", () => {
    const lst = arrayToList([-2, 3, -4, 5, -6]);
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [-2, -4, -6]);
  });

  it("can be constructed using node", () => {
    const lst = node(-3, node(-2, node(4, empty())));
    const result = negativeProducts(lst);
    assert.deepStrictEqual(listToArray(result), [-3, 6]);
  });
});

describe("deleteFirst", () => {
  it("deletes the first occurrence of the element", () => {
    const lst = arrayToList([1, 2, 3, 2, 4]);
    const result = deleteFirst(lst, 2);
    assert.deepStrictEqual(listToArray(result), [1, 3, 2, 4]);
  });

  it("deletes only the first occurrence", () => {
    const lst = arrayToList([2, 2, 2]);
    const result = deleteFirst(lst, 2);
    assert.deepStrictEqual(listToArray(result), [2, 2]);
  });

  it("returns the same list if the element is not found", () => {
    const lst = arrayToList([1, 3, 5]);
    const result = deleteFirst(lst, 2);
    assert.deepStrictEqual(listToArray(result), [1, 3, 5]);
  });

  it("returns an empty list when deleting from an empty list", () => {
    const lst = empty<number>();
    const result = deleteFirst(lst, 10);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("deletes the element if it is the first element", () => {
    const lst = arrayToList([7, 8, 9]);
    const result = deleteFirst(lst, 7);
    assert.deepStrictEqual(listToArray(result), [8, 9]);
  });

  it("deletes the element if it is the last element", () => {
    const lst = arrayToList([7, 8, 9]);
    const result = deleteFirst(lst, 9);
    assert.deepStrictEqual(listToArray(result), [7, 8]);
  });

  it("handles a single occurrence correctly", () => {
    const lst = arrayToList([10]);
    const result = deleteFirst(lst, 10);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("can be constructed using node", () => {
    const lst = node(4, node(5, node(6, empty())));
    const result = deleteFirst(lst, 5);
    assert.deepStrictEqual(listToArray(result), [4, 6]);
  });
});

describe("deleteLast", () => {
  it("deletes the last occurrence of the element", () => {
    const lst = arrayToList([1, 2, 3, 2, 4]);
    const result = deleteLast(lst, 2);
    assert.deepStrictEqual(listToArray(result), [1, 2, 3, 4]);
  });

  it("deletes only the last occurrence", () => {
    const lst = arrayToList([2, 2, 2]);
    const result = deleteLast(lst, 2);
    assert.deepStrictEqual(listToArray(result), [2, 2]);
  });

  it("returns the same list if the element is not found", () => {
    const lst = arrayToList([1, 3, 5]);
    const result = deleteLast(lst, 2);
    assert.deepStrictEqual(listToArray(result), [1, 3, 5]);
  });

  it("returns an empty list when deleting from an empty list", () => {
    const lst = empty<number>();
    const result = deleteLast(lst, 10);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("deletes the element if it is the last element", () => {
    const lst = arrayToList([7, 8, 9]);
    const result = deleteLast(lst, 9);
    assert.deepStrictEqual(listToArray(result), [7, 8]);
  });

  it("deletes the element if it is the first element and only occurrence", () => {
    const lst = arrayToList([7, 8, 9]);
    const result = deleteLast(lst, 7);
    assert.deepStrictEqual(listToArray(result), [8, 9]);
  });

  it("handles a single occurrence correctly", () => {
    const lst = arrayToList([10]);
    const result = deleteLast(lst, 10);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("can be constructed using node", () => {
    const lst = node(4, node(5, node(6, empty())));
    const result = deleteLast(lst, 5);
    assert.deepStrictEqual(listToArray(result), [4, 6]);
  });
});

describe("squashList", () => {
  it("leaves a list of only numbers unchanged", () => {
    const lst = arrayToList([1, 2, 3]);
    const result = squashList(lst);
    assert.deepStrictEqual(listToArray(result), [1, 2, 3]);
  });

  it("squashes a list with nested lists", () => {
    const lst = arrayToList([1, arrayToList([2, 3]), 4, arrayToList([5, -1, 2])]);
    const result = squashList(lst);
    assert.deepStrictEqual(listToArray(result), [1, 5, 4, 6]);
  });

  it("returns an empty list for an empty input", () => {
    const lst = empty<number | List<number>>();
    const result = squashList(lst);
    assert.deepStrictEqual(listToArray(result), []);
  });

  it("handles a list of nested empty lists", () => {
    const lst = arrayToList([arrayToList([]), arrayToList([])]);
    const result = squashList(lst);
    assert.deepStrictEqual(listToArray(result), [0, 0]);
  });

  it("handles a single nested list", () => {
    const lst = arrayToList([arrayToList([10, 20, 30])]);
    const result = squashList(lst);
    assert.deepStrictEqual(listToArray(result), [60]);
  });

  it("handles nested lists with negative numbers", () => {
    const lst = arrayToList([arrayToList([-5, 5]), 10]);
    const result = squashList(lst);
    assert.deepStrictEqual(listToArray(result), [0, 10]);
  });
});
