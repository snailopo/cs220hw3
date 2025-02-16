import { List, node, empty } from "../include/lists.js";

export function insertOrdered(lst: List<number>, el: number): List<number> {
  if (lst.isEmpty()) {
    return node(el, empty());
  }
  if (el <= lst.head()) {
    return node(el, lst);
  } else {
    return node(lst.head(), insertOrdered(lst.tail(), el));
  }
}

export function everyNRev<T>(lst: List<T>, n: number): List<T> {
  type Acc = { count: number; res: List<T> };
  const initial: Acc = { count: 0, res: empty() };
  const final = lst.reduce((acc: Acc, e: T) => {
    const newCount = acc.count + 1;
    if (newCount % n === 0) {
      return { count: newCount, res: node(e, acc.res) };
    } else {
      return { count: newCount, res: acc.res };
    }
  }, initial);
  return final.res;
}

export function everyNCond<T>(lst: List<T>, n: number, cond: (e: T) => boolean): List<T> {
  function helper(lst: List<T>, count: number): List<T> {
    if (lst.isEmpty()) {
      return empty();
    }
    const headVal = lst.head();
    if (cond(headVal)) {
      const newCount = count + 1;
      if (newCount % n === 0) {
        return node(headVal, helper(lst.tail(), newCount));
      } else {
        return helper(lst.tail(), newCount);
      }
    } else {
      return helper(lst.tail(), count);
    }
  }
  return helper(lst, 0);
}

export function keepTrendMiddles(
  lst: List<number>,
  allSatisfy: (prev: number, curr: number, next: number) => boolean
): List<number> {
  if (lst.isEmpty() || lst.tail().isEmpty() || lst.tail().tail().isEmpty()) {
    return empty();
  }
  const prev = lst.head();
  const curr = lst.tail().head();
  const next = lst.tail().tail().head();
  const rest = keepTrendMiddles(lst.tail(), allSatisfy);
  return allSatisfy(prev, curr, next) ? node(curr, rest) : rest;
}

export function keepLocalMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev < curr && next < curr);
}

export function keepLocalMinima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => prev > curr && next > curr);
}

export function keepLocalMinimaAndMaxima(lst: List<number>): List<number> {
  return keepTrendMiddles(lst, (prev, curr, next) => (prev < curr && next < curr) || (prev > curr && next > curr));
}

function contiguousProducts(lst: List<number>, pred: (n: number) => boolean): List<number> {
  function helper(lst: List<number>, currentProduct: number | null): List<number> {
    if (lst.isEmpty()) {
      return empty();
    }
    const x = lst.head();
    if (pred(x)) {
      const newProduct = currentProduct !== null ? currentProduct * x : x;
      return node(newProduct, helper(lst.tail(), newProduct));
    } else {
      return helper(lst.tail(), null);
    }
  }
  return helper(lst, null);
}

export function nonNegativeProducts(lst: List<number>): List<number> {
  return contiguousProducts(lst, n => n >= 0);
}

export function negativeProducts(lst: List<number>): List<number> {
  return contiguousProducts(lst, n => n < 0);
}

export function deleteFirst<T>(lst: List<T>, el: T): List<T> {
  if (lst.isEmpty()) {
    return lst;
  }
  if (lst.head() === el) {
    return lst.tail();
  } else {
    return node(lst.head(), deleteFirst(lst.tail(), el));
  }
}

function deleteLastHelper<T>(lst: List<T>, el: T): { result: List<T>; deleted: boolean } {
  if (lst.isEmpty()) {
    return { result: lst, deleted: false };
  }
  const tailPair = deleteLastHelper(lst.tail(), el);
  if (!tailPair.deleted && lst.head() === el) {
    return { result: lst.tail(), deleted: true };
  } else if (tailPair.deleted) {
    if (tailPair.result === lst.tail()) {
      return { result: lst, deleted: true };
    } else {
      return { result: node(lst.head(), tailPair.result), deleted: true };
    }
  } else {
    if (tailPair.result === lst.tail()) {
      return { result: lst, deleted: false };
    } else {
      return { result: node(lst.head(), tailPair.result), deleted: false };
    }
  }
}

export function deleteLast<T>(lst: List<T>, el: T): List<T> {
  return deleteLastHelper(lst, el).result;
}

export function squashList(lst: List<number | List<number>>): List<number> {
  if (lst.isEmpty()) {
    return empty();
  }
  const headVal = lst.head();
  let num: number;
  if (typeof headVal === "number") {
    num = headVal;
  } else {
    num = headVal.reduce((acc, x) => acc + x, 0);
  }
  return node(num, squashList(lst.tail()));
}
