# Tooling / скрипты

## Основные команды

- `pnpm dev` — запуск dev сервера
- `pnpm build` — сборка проекта
- `pnpm start` — запуск production сервера
- `pnpm lint` — линт (Next ESLint) + `pnpm i18n:check` + `pnpm strings:check`
- `pnpm format` — форматирование (Prettier)
- `pnpm typecheck` — проверка типов (TypeScript)

## OpenAPI

- `pnpm api:gen` — генерация типов из OpenAPI по конфигу `openapi/openapi.config.json`

## i18n / строки

- `pnpm i18n:check` — проверка консистентности переводов (ru/en)
- `pnpm i18n:gen` — генерация типобезопасных ключей (`src/shared/i18n/generated.ts`)
- `pnpm strings:check` — запрет “сырого” текста в UI (см. `docs/i18n/README.md`)
