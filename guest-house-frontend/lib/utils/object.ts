
export const removeEmptyValue = (data: Record<number | string, any>, removeArrayType?: boolean) => {
  return Object.keys(data).reduce<Record<number | string, any>>((a, c) => {
    if (!(data[c] === null || data[c] === undefined || data[c] === '')) {
      if (!removeArrayType || !Array.isArray(data[c]) || data[c].filter((el: any) => !!el).length > 0) {
        a[c] = data[c]
      }
    }
    return a
  }, {})
}
