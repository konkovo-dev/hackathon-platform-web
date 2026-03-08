# Infinite Scroll

Реализация бесконечной прокрутки с cursor-based пагинацией на бекенде.

## Архитектура

### Entity Layer

**types.ts** — добавить пагинацию в query и response:

```typescript
export type HackathonListQuery = {
  // ... фильтры
  pageToken?: string
  pageSize?: number
}

export type HackathonListResponse = {
  hackathons: Hackathon[]
  page: {
    hasMore: boolean
    nextPageToken: string
  }
}
```

**API функция** — принимает `pageToken`:

```typescript
export async function getHackathonList(
  filters?: HackathonListFilters,
  pageToken?: string,
  pageSize?: number
): Promise<HackathonListResponse>
```

### Feature Layer: React Query хук

```typescript
export function useInfiniteHackathonListQuery(
  filters: HackathonListFilters,
  initialData?: HackathonListResponse
) {
  return useInfiniteQuery({
    queryKey: ['hackathons', 'list', 'infinite', filters],
    queryFn: ({ pageParam }) => getHackathonList(filters, pageParam),
    getNextPageParam: lastPage => (lastPage.page.hasMore ? lastPage.page.nextPageToken : undefined),
    initialPageParam: undefined as string | undefined,
    initialData: initialData ? { pages: [initialData], pageParams: [undefined] } : undefined,
    staleTime: 60_000,
  })
}
```

### UI компонент

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteHackathonListQuery(
  filters,
  initialData
)

const allHackathons = data?.pages.flatMap(page => page.hackathons) ?? []

// Intersection Observer
const handleObserver = useCallback(
  entries => {
    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  },
  [fetchNextPage, hasNextPage, isFetchingNextPage]
)

useEffect(() => {
  const observer = new IntersectionObserver(handleObserver, {
    rootMargin: '100px', // загружать за 100px до конца
    threshold: 0.1,
  })
  if (loadMoreRef.current) observer.observe(loadMoreRef.current)
  return () => observer.disconnect()
}, [handleObserver])
```

## Ключевые моменты

### 1. Автосброс при изменении фильтров

`queryKey` включает `filters` → изменение фильтров создаёт новый query и сбрасывает пагинацию:

```typescript
queryKey: ['hackathons', 'list', 'infinite', filters]
```

### 2. Intersection Observer

- `rootMargin: '100px'` — начинает загрузку **до** того, как пользователь доскролит до конца
- Создаёт плавный UX без "мигания" загрузчика
- Обязательно `disconnect()` в cleanup

### 3. Fallback кнопка

Показывается когда `hasNextPage && !isFetchingNextPage`:

- На случай если Intersection Observer не сработал
- Даёт пользователю контроль над загрузкой

### 4. SSR совместимость

```typescript
initialData: initialData ? { pages: [initialData], pageParams: [undefined] } : undefined
```

React Query превращает SSR-данные в формат `pages` и продолжает пагинацию.

### 5. Состояния загрузки

- `isLoading` — первая загрузка (показываем loader вместо списка)
- `isFetchingNextPage` — загрузка следующей страницы (список уже показан)
- `hasNextPage` — есть ли ещё данные

## Cursor vs Offset пагинация

**Cursor-based** (используем):

- ✅ Нет дубликатов при изменении данных
- ✅ Корректно работает при добавлении/удалении элементов
- ❌ Нельзя перейти на N-ю страницу

**Offset-based**:

- ✅ Можно перейти на любую страницу
- ❌ Дубликаты при изменении данных во время пагинации
- ❌ Медленнее на больших offset'ах

Используем cursor-based, потому что список хакатонов динамический (публикуются/архивируются), и важна целостность результатов.
