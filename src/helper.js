const defaultCmp = (x, y) => x < y ? -1 : +(x > y)

exports.compareMap = function compareMap(fn, cmp = defaultCmp) {
  return (x, y) => cmp(fn(x), fn(y))
}

exports.compareLexically = function compareLexically(cmp = defaultCmp) {
  return (arr1, arr2) => {
    let inner = i => {
      if (i >= arr1.length || i >= arr2.length) return arr1.length - arr2.length

      let s = cmp(arr1[i], arr2[i])
      return s !== 0 ? s : inner(i + 1)
    }

    return inner(0)
  }
}
