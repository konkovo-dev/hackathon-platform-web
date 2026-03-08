# Location Reference

## Назначение

Модуль `entities/location` — **единый справочник городов** для всего приложения. Используется как в фильтрах списка хакатонов, так и в формах создания/редактирования хакатонов.

**Цель**: обеспечить консистентность данных о городах во всём приложении — пользователь выбирает город из одного и того же списка везде.

## Источник данных

Справочник генерируется из **публичных API**:
- **REST Countries API** — список стран с переводами на русский
- **GeoNames API** — крупные города (население > 100k) по странам

Данные сохраняются в **статический JSON-файл** (`src/entities/location/model/cities.json`), который используется в runtime.

## Обновление справочника

```bash
GEONAMES_USERNAME=your_username pnpm cities:gen
```

Результат: обновлённый файл `cities.json` с актуальными городами.

**Рекомендуемая частота обновления**: раз в месяц или при добавлении новых стран.

## Использование в коде

```typescript
import { getCities, searchCities, getCityName } from '@/entities/location'
import { useLocale } from '@/shared/i18n/useLocale'

// Получить все города
const cities = getCities()

// Поиск по названию (работает с обоими языками)
const filtered = searchCities('Москва')  // найдёт Москву
const filtered2 = searchCities('Moscow')  // тоже найдёт Москву

// Получить локализованное название города
const locale = useLocale()  // 'ru' или 'en'
const cityName = getCityName(cities[0], locale)  
// locale='ru' → "Москва"
// locale='en' → "Moscow"
```

## Автоопределение города по геопозиции

При первой загрузке страницы со списком хакатонов, если пользователь **не указал город в URL**, система автоматически:

1. **Попытка 1 (геолокация)**: Запрашивает геопозицию через браузерный API (`navigator.geolocation`) и определяет ближайший город из справочника
2. **Попытка 2 (fallback)**: Если геолокация не сработала, отклонена или не нашла город в радиусе ~500 км, устанавливается **первый город из списка** (Москва, как самый крупный)

**Реализация**: 
- `src/shared/lib/geolocation/useGeolocation.ts` — хук `useGeolocation()` + функция `findNearestCity()`
- `useFiltersFromUrl` интегрирует геопозицию в логику фильтров с fallback на первый город

**Алгоритм определения**: 
- Используются реальные координаты (latitude, longitude) всех городов из справочника
- Вычисляется евклидово расстояние между геопозицией пользователя и каждым городом
- Выбирается ближайший город (если в радиусе ~500 км), иначе — первый в списке

**Приватность**: запрос геопозиции требует явного разрешения пользователя (браузерный диалог). При отказе используется первый город из списка.

## Структура данных

```typescript
type City = {
  country: string       // "Россия"
  countryCode: string   // "RU"
  cityRu: string        // "Москва"
  cityEn: string        // "Moscow"
  population: number    // 10381222
  latitude: string      // "55.75204"
  longitude: string     // "37.61781"
}
```

**Локализованные названия**: `cityRu` и `cityEn` — русское и английское название города соответственно. Используйте хелпер `getCityName(city, locale)` для получения названия на нужном языке.

**Координаты** (latitude, longitude) используются для геопозиционирования — определения ближайшего города по геолокации пользователя.

## Перспектива

Модуль готов к переходу на backend API:
- Интерфейс `getCities()` останется прежним
- Потребуется только заменить реализацию на HTTP-запрос
- UI-компоненты не изменятся

## Примеры использования

### В фильтрах хакатонов

```typescript
// features/hackathon-list/ui/CitySelectModal.tsx
import { getCities } from '@/entities/location'

const cities = getCities()
// → используется для отображения списка в модалке
```

### В формах создания хакатона (будущее)

```typescript
// features/hackathon-create/ui/LocationField.tsx
import { getCities } from '@/entities/location'

const cities = getCities()
// → dropdown для выбора города проведения
```

## Ключевые файлы

- `src/entities/location/model/types.ts` — типы `City`, `Country`
- `src/entities/location/model/cities.json` — справочник (генерируется)
- `src/entities/location/api/getCities.ts` — функции получения и поиска
- `src/entities/location/index.ts` — публичный API модуля
- `scripts/generate-cities.mjs` — скрипт генерации справочника

## Текущий охват

43 города из России, Казахстана, Беларуси (население > 100k).

**Примеры**:
- Москва / Moscow (10.4M чел., 55.75°, 37.61°)
- Санкт-Петербург / St Petersburg (5.4M чел., 59.93°, 30.31°)
- Алматы / Almaty (2.0M чел., 43.25°, 76.92°)
- Минск / Minsk (1.7M чел., 53.90°, 27.57°)

**Локализация**: каждый город имеет русское (`cityRu`) и английское (`cityEn`) название, отображаемое в зависимости от выбранного языка интерфейса.

Для расширения списка:
1. Отредактируйте `priorityCountries` в `scripts/generate-cities.mjs`
2. Запустите `pnpm cities:gen`
