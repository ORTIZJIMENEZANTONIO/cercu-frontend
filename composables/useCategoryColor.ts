/**
 * Provides consistent color classes for categories across all pages.
 * Colors are assigned based on the category's index in the store's full list,
 * so the same category always gets the same color everywhere.
 */
export function useCategoryColor() {
  const categoriesStore = useCategoriesStore()

  const colorClasses = [
    'coral',
    'warning',
    'success',
    'info',
    'indigo',
    'danger',
    'teal',
    'purple',
  ] as const

  type ColorClass = (typeof colorClasses)[number]

  function getColorForCategory(categorySlugOrId: string | number): ColorClass {
    const idx = categoriesStore.categories.findIndex(
      (c: any) => c.slug === categorySlugOrId || c.id === categorySlugOrId
    )
    if (idx === -1) return 'indigo'
    return colorClasses[idx % colorClasses.length]
  }

  function getColorByIndex(idx: number): ColorClass {
    return colorClasses[idx % colorClasses.length]
  }

  return {
    colorClasses,
    getColorForCategory,
    getColorByIndex,
  }
}
