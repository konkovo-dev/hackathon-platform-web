# Deployment Guide

## Подготовка к деплою

### 1. Переменные окружения

`.env` на сервере со следующими переменными:

```bash
PLATFORM_API_BASE_URL=https://api.your-domain.com
AUTH_GATEWAY_BASE_URL=https://auth.your-domain.com
NODE_ENV=production
```

### 2. Секреты GitHub Actions

Settings -> Secrets and variables -> Actions:

- `DEPLOY_HOST` — хост сервера для деплоя (опционально)
- `DEPLOY_USER` — пользователь SSH (опционально)
- `DEPLOY_KEY` — приватный SSH ключ (опционально)

## Локальная сборка и тестирование

### Сборка Docker образа

```bash
docker build -t hackathon-platform-web .
```

### Запуск с Docker Compose

```bash
cp .env.example .env
nano .env
docker-compose up -d
```

### Проверка

```bash
# Health check
curl http://localhost:3000/api/health

docker-compose logs -f web
```

## CI/CD Pipeline

### CI (на каждый PR и push)

Проверки качества:
- ✅ Type check (`pnpm typecheck`)
- ✅ Lint (`pnpm lint`)
- ✅ Strings check (`pnpm strings:check`)
- ✅ i18n check (`pnpm i18n:check`)
- ✅ Unit tests (`pnpm test`)
- ✅ E2E tests (`pnpm test:e2e`)
- ✅ Docker build

### CD (только на main branch)

1. Сборка Docker образа
2. Пуш в GitHub Container Registry (`ghcr.io`)
3. Деплой на сервер (настрой в `.github/workflows/cd.yml`)

## Варианты деплоя

```bash
git clone <repo>
cd hackathon-platform-web
cp .env.example .env
nano .env

docker-compose up -d

# nginx reverse proxy
# /etc/nginx/sites-available/hackathon
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Мониторинг

### Health check

```bash
curl https://your-domain.com/api/health
```
