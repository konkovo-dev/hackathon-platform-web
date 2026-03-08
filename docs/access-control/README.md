# Доступ и роли (Frontend Policy)

Цель: организовать на фронтенде **чёткую, единую и тестируемую** систему проверки доступа, которая:

- повторяет модель и терминологию бекенда (`hackaton-platform-api/docs/rules/*`);
- не расползается проверками по компонентам (`if (role === ...)` / `if (stage === ...)` в UI);
- даёт **предсказуемый UX** (скрыть/задизейблить/редирект + понятные причины);
- остаётся безопасной: **истина на бекенде**, фронт — только UX и защита от “лишних” действий.

---

## Ключевая идея

На бекенде политика описана как:

- **действие** (`<ACTION>`)
- - **предикаты** (роль/участие/стадия/принадлежность/поля)

На фронте делаем то же самое: любой доступ в UI выражаем **через action** и проверяем единым policy-слоем:

- `can(action, ctx, target?) -> { allowed, reason }`

Где:

- `ctx` — контекст “актора” и окружения (auth, roles, participation, stage, policy, …)
- `target` — “цель” (конкретная команда/инвайт/тикет), если правило зависит от неё.

---

## Глоссарий (как в бекенде)

- **roles** (staff roles, на хакатон): `OWNER | ORGANIZER | MENTOR | JURY`
- **particip.kind** (участие, на хакатон): `NONE | LOOKING_FOR_TEAM | SINGLE | TEAM`
- **particip.team_id**: `uuid | null`
- **stage** (хакатон): `DRAFT | UPCOMING | REGISTRATION | PRESTART | RUNNING | JUDGING | FINISHED`
- **team права**:
  - `is_team_member(team)`
  - `is_team_captain(team)`
- **инвариант** (важно для UX): в одном хакатоне запрещено одновременно быть staff (`roles[]` не пуст) и participant (`particip.kind != NONE`).

---

## Что фронту нужно знать (минимальный контракт данных)

Чтобы корректно принимать UI-решения по правилам из `docs/rules/*`, фронту нужен **снимок контекста на хакатон**:

### 1) Глобальный контекст (Auth)

Берём из `GET /api/auth/session`:

- `active`
- `userId`
- `expiresAt`

### 2) HackathonContext (на конкретный `hackathonId`)

Должен приходить из продуктового API (или через отдельный BFF-агрегатор).
Минимально:

- `hackathonId`
- `stage`
- `policy.allow_team`, `policy.allow_individual`, `policy.team_size_max`
- `result_published_at` (для окон JUDGING/FINISHED в judging-политике)
- `roles[]`
- `particip.kind`, `particip.team_id`
- (опционально/кэшируемо) `teamRights`:
  - `is_team_member(team_id)` и `is_team_captain(team_id)`
  - можно отдавать прямо как `myTeam: { teamId, isCaptain }`, чтобы не плодить дополнительные запросы

**Важно**: если этого контракта нет в OpenAPI продукта — мы сознательно не хардкодим “роли из воздуха”.
Сначала появляется эндпоинт “me@hackathon context”, потом строим policy/UI.

---

## Где это живёт по FSD-lite

Предлагаемая раскладка (чисто и масштабируемо):

- `src/shared/policy/`
  - общие типы (Decision/Reason), утилиты, базовые helper’ы
- `src/entities/hackathon/policy/`
  - `Hackathon.*` действия (по `docs/rules/hackathon.md`)
- `src/entities/team/policy/`
  - `Team.*` действия (по `docs/rules/team.md`)
- `src/entities/judging/policy/`
  - `Judging.*`, `Verdict.*` (по `docs/rules/judging.md`)
- `src/entities/mentors/policy/`
  - support/mentors чат (по `docs/rules/support.md`)
- `src/entities/submissions/policy/`
  - посылки (по `docs/rules/submissions.md`)
- `src/entities/hackathon-staff/policy/`
  - staff инвайты/роли (по `docs/rules/hackathon-staff.md`)

А также “точка получения контекста”:

- `src/entities/session/` (или `entities/auth/model`): глобальная сессия (уже есть `useSessionQuery`)
- `src/entities/hackathon-context/`:
  - запрос `useHackathonContextQuery(hackathonId)`
  - нормализация в `HackathonActorContext`

---

## Стандартные UI-примитивы (без самодеятельности)

Чтобы правила не расползались:

- **`useCan(action, params)`**:
  - возвращает `{ allowed, reason }`
  - внутри берёт `session + hackathonContext` и вызывает соответствующий policy

- **`<AccessGate action=... fallback=...>`**:
  - если нельзя — либо скрываем блок, либо показываем fallback (например, текст/кнопку “Недоступно”)

- **`<RequireAccess action=... redirectTo=...>`** (для страниц):
  - если нельзя — редирект/404 (зависит от типа страницы)
  - предпочтительно делать _server-side_ там, где это оправдано (меньше мерцаний)

Правило команды:

- **Никаких** прямых проверок `roles/stage/particip` в UI.
- Только через `policy` + `useCan`/`AccessGate`.

---

## Текущее состояние реализации в коде

- `src/shared/policy/decision.ts` — `Decision` + `ReasonCode`
- `src/shared/policy/useCan.ts` — `useCan(action, params?)` (связывает session + hackathon context)
- `src/shared/policy/AccessGate.tsx` — минимальный UI-gate
- `src/entities/hackathon-context/**` — типы + query `useHackathonContextQuery`
- Примеры policy:
  - `src/entities/team/policy/teamPolicy.ts` (`Team.Create`)
  - `src/entities/hackathon/policy/hackathonPolicy.ts` (`Hackathon.ReadDraft`)

---

## Как решаем “скрыть vs disable vs редирект”

Единая матрица поведения:

- **Навигация/меню**: чаще **скрываем**, чтобы не раздражать “лишними” пунктами.
- **Кнопки действий**: чаще **disable** + tooltip/reason (помогает понять условия).
- **Страницы**:
  - если “страница существует, но вам нельзя” → редирект на безопасный маршрут + объяснение
  - если “страница концептуально не для вас” (например, draft-only раздел) → можно 404, чтобы не светить структуру

Решение “403 vs 404” фиксируем отдельно на уровень `RequireAccess`.

---

## Примеры маппинга правил (в терминах бекенда)

### Team.Create (из `docs/rules/team.md`)

UI должен разрешать “Создать команду” только если:

- `auth`
- `stage == REGISTRATION`
- `policy.allow_team == true`
- `CanJoinTeam(actor)`:
  - не staff (`roles` пуст или не пересекается со staff-набором)
  - `particip.kind != TEAM`

### Hackathon.ReadDraft (из `docs/rules/hackathon.md`)

Показываем “Draft режим/редактирование” только если:

- `stage == DRAFT`
- `role in {OWNER, ORGANIZER}`

### Judging: анонимность для жюри (из `docs/rules/judging.md`)

Frontend должен считать нормальным, что для `JURY`:

- **нет** `team_id` и связанной информации;
- UI компонентов должен уметь рендерить `JudgingItemView` без идентичности команды;
- “раскрыть команду” в интерфейсе жюри запрещено архитектурно (нет данных + policy).

### Identity: фильтрация полей (из `docs/rules/identity.md`)

Это ABAC на уровне данных:

- UI **не делает выводов** по visibility-флагам напрямую
- UI просто рендерит то, что пришло:
  - если `contacts` отсутствуют — секция контактов скрыта
  - если `skills` отсутствуют — секция навыков скрыта

---

## Причины отказа (Reason Codes) — для UX

Каждый policy возвращает не только `allowed: false`, но и причину (для tooltip/alert/analytics).
Примерный набор (унифицированный):

- `AUTH_REQUIRED`
- `ROLE_REQUIRED`
- `PARTICIP_REQUIRED`
- `STAGE_RULE`
- `POLICY_RULE`
- `OWNERSHIP_REQUIRED` (например, “только капитан”)
- `LIMIT_RULE` (например, ограничения размера команды)
- `CONFLICT` (например, staff vs participant)

---

## Обработка ошибок с бекенда

Даже если UI всё правильно посчитал, сервер может отказать (гонки по времени/стадии/слотам).
Правило:

- на любой `403/STAGE_RULE/POLICY_RULE/LIMIT_RULE`:
  - показываем пользователю понятное сообщение
  - **инвалидируем** `HackathonContext` (или related queries), чтобы UI пересчитал доступ по актуальным данным.

---

## Как тестируем policy

Policy-функции должны тестироваться **таблично** (как спеки):

- набор кейсов `(ctx, target) -> allowed/reason`
- отдельные кейсы на инварианты (staff vs participant)
- отдельные кейсы на окна стадий (REGISTRATION/RUNNING/JUDGING/…)

Это дешёвые тесты, но дают 80% уверенности, что UI не “поплыл”.

---

## Ссылки на бекенд-источник истины

- `hackaton-platform-api/docs/rules/hackathon.md`
- `hackaton-platform-api/docs/rules/team.md`
- `hackaton-platform-api/docs/rules/hackathon-staff.md`
- `hackaton-platform-api/docs/rules/judging.md`
- `hackaton-platform-api/docs/rules/submissions.md`
- `hackaton-platform-api/docs/rules/support.md`
- `hackaton-platform-api/docs/rules/identity.md`
