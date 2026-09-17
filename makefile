.PHONY: check-docker up build down logs clean db-shell api-shell dev test typecheck

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

logs:
	sudo docker compose logs -f

clean: check-docker
	@echo "Destroying containers and wiping database volume..."
	sudo docker compose down -v

# ==========================================
# CONTAINER ACCESS (DEBUGGING)
# ==========================================

# Jump into the PostgreSQL terminal inside Docker
db-shell: check-docker
	@echo "Entering PostgreSQL terminal..."
	sudo docker compose exec db psql -U docker_user -d movie_goer

# Open a shell inside the running Node.js API container
api-shell: check-docker
	@echo "Entering API container..."
	sudo docker compose exec api sh

# ==========================================
# LOCAL DEVELOPMENT (NODE.JS)
# ==========================================

dev:
	@echo "Starting local dev server..."
	npm run dev

test:
	@echo "Running tests..."
	npm run test

typecheck:
	@echo "Running TypeScript compiler check..."
	npm run typecheck