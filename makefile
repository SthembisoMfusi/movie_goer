.PHONY: check-docker up build down logs clean db-shell api-shell dev test typecheck \
        frontend-dev frontend-build frontend-test frontend-install \
        install seed-docker db-reset lint restart status ps test-all

# ==========================================
# DOCKER CONTROLS
# ==========================================

check-docker:
	@echo "Checking Docker service..."
	@sudo service docker status > /dev/null || (echo "Starting Docker..." && sudo service docker start)

up: check-docker
	@echo "Starting the Fastify API..."
	sudo docker compose up -d

build: check-docker
	@echo "Building and starting the Fastify API..."
	sudo docker compose up --build -d

down: check-docker
	@echo "Stopping the Fastify API..."
	sudo docker compose down

restart: down up
	@echo "Restarted containers."

status: check-docker
	@sudo docker compose ps

logs:
	sudo docker compose logs -f

clean: check-docker
	@echo "Destroying containers and wiping database volume..."
	sudo docker compose down -v

# ==========================================
# CONTAINER ACCESS (DEBUGGING)
# ==========================================

db-shell: check-docker
	@echo "Entering PostgreSQL terminal..."
	sudo docker compose exec db psql -U docker_user -d movie_goer

api-shell: check-docker
	@echo "Entering API container..."
	sudo docker compose exec api sh

# ==========================================
# SEEDING
# ==========================================

# Usage: make seed-docker DUMP=~/movie_goer_seed.dump
seed-docker: check-docker
	@if [ -z "$(DUMP)" ]; then \
		echo "Usage: make seed-docker DUMP=/path/to/dump/file"; \
		exit 1; \
	fi
	@echo "Copying $(DUMP) into db container..."
	sudo docker cp $(DUMP) $$(sudo docker compose ps -q db):/tmp/seed.dump
	@echo "Restoring into movie_goer database..."
	sudo docker compose exec db pg_restore -U docker_user -d movie_goer --no-owner --no-privileges -j 4 /tmp/seed.dump
	@echo "Seed complete. Run 'make db-shell' and '\\dt' to verify."

db-reset: clean up
	@echo "Database volume wiped and containers restarted fresh. Run 'make seed-docker DUMP=...' to reload data."

# ==========================================
# LOCAL DEVELOPMENT (NODE.JS - BACKEND)
# ==========================================

install:
	npm install

dev:
	@echo "Starting local dev server..."
	npm run dev

test:
	@echo "Running backend tests..."
	npm run test

typecheck:
	@echo "Running TypeScript compiler check..."
	npm run typecheck

lint:
	npm run lint

# ==========================================
# FRONTEND
# ==========================================

frontend-install:
	cd frontend && npm install

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

frontend-test:
	cd frontend && npm run test:e2e

# ==========================================
# COMBINED TEST TARGETS
# ==========================================

test-all: check-docker
	@echo "Running backend tests..."
	npm run test
	@echo "Starting frontend dev server for e2e tests..."
	@cd frontend && npm run dev > /tmp/frontend-dev.log 2>&1 & echo $$! > /tmp/frontend-dev.pid
	@sleep 3
	@echo "Running frontend e2e tests..."
	@cd frontend && npm run test:e2e; \
		EXIT_CODE=$$?; \
		kill $$(cat /tmp/frontend-dev.pid) 2>/dev/null || true; \
		rm -f /tmp/frontend-dev.pid; \
		exit $$EXIT_CODE