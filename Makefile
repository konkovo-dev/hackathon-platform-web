.PHONY: help dev build start test lint typecheck clean docker-build docker-up docker-down docker-logs deploy

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev:
	pnpm dev

build:
	pnpm build

start:
	pnpm start

test:
	pnpm typecheck && pnpm lint && pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck

clean:
	rm -rf .next out node_modules/.cache

docker-build:
	docker build -t hackathon-platform-web .

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f web

docker-restart: docker-down docker-build docker-up

deploy-check:
	@echo "Running pre-deploy checks..."
	pnpm typecheck
	pnpm lint
	pnpm test:coverage
	@echo "✅ All checks passed!"

ci-local:
	@echo "Running CI checks locally..."
	pnpm install --frozen-lockfile
	pnpm typecheck
	pnpm lint
	pnpm strings:check
	pnpm i18n:check
	pnpm test:coverage
	docker build -t hackathon-platform-web .
	@echo "✅ CI passed!"
