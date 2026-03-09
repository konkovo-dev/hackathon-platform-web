# Deployment

## Архитектура

```
Developer → Git push → GitHub Actions → SSH → Production Server
                           ↓
                    CI проверки (typecheck, lint, tests)
                           ↓
                    CD: git pull + docker build на сервере
```

## 🔄 CI/CD Pipeline

### CI (каждый push/PR)

`.github/workflows/ci.yml` запускает:
- TypeScript check, ESLint, strings/i18n проверки
- Unit tests (Vitest) + coverage
- E2E tests (Playwright)
- Docker build тест (без push)

**Время:** ~2 минуты

### CD (только push в main)

`.github/workflows/cd.yml` выполняет:

```yaml
- SSH на production server
- cd /opt/hackathon-platform/hackathon-platform-web/
- git pull origin main
- docker compose build web
- docker compose up -d web
- docker image prune -f
```

**Время:** ~3-5 минут (Docker build на сервере)

## Требования

### GitHub Secrets

| Secret | Назначение |
|--------|------------|
| `DEPLOY_HOST` | IP сервера |
| `DEPLOY_USER` | SSH пользователь |
| `DEPLOY_KEY` | Приватный SSH ключ |

### Сервер

- Docker + Docker Compose
- Git с доступом к репо (Deploy Key для приватных)
- Открыт порт 3000 (или 80/443 с Nginx)

### Environment Variables (.env на сервере)

```bash
AUTH_GATEWAY_BASE_URL=http://178.154.192.57:8080
PLATFORM_API_BASE_URL=http://178.154.192.57:8080
NODE_ENV=production
# FORCE_SECURE_COOKIES=true  # Только для HTTPS!
```

## 🔍 Health Check

```bash
curl http://YOUR_IP:3000/api/health
# {"status":"ok","timestamp":"...","environment":"production"}
```

## 📊 Мониторинг

```bash
# Логи
docker compose logs -f web

# Статус
docker compose ps

# Переменные окружения
docker compose exec web env | grep -E '(AUTH|PLATFORM|NODE_ENV)'
```

## Деплой изменений

1. `git push origin main`
2. GitHub Actions запускает CI → CD
3. Сервер: pull → build → restart
4. Готово (~5 минут)
