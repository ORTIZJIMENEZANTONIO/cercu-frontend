export function useTableSort<T = any>(data: Ref<T[]>) {
  const sortKey = ref<string>('')
  const sortDir = ref<'asc' | 'desc'>('asc')

  function toggleSort(key: string) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  const sorted = computed(() => {
    if (!sortKey.value) return data.value

    return [...data.value].sort((a: any, b: any) => {
      let valA = getNestedValue(a, sortKey.value)
      let valB = getNestedValue(b, sortKey.value)

      // Handle nulls
      if (valA == null && valB == null) return 0
      if (valA == null) return 1
      if (valB == null) return -1

      // Dates
      if (typeof valA === 'string' && isDateString(valA)) {
        valA = new Date(valA).getTime()
        valB = new Date(valB as string).getTime()
      }

      // Numbers
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir.value === 'asc' ? valA - valB : valB - valA
      }

      // Strings
      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      const cmp = strA.localeCompare(strB)
      return sortDir.value === 'asc' ? cmp : -cmp
    })
  })

  return { sortKey, sortDir, toggleSort, sorted }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

function isDateString(val: string): boolean {
  return /^\d{4}-\d{2}-\d{2}/.test(val)
}
