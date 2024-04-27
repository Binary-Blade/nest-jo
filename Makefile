# === MIGRATIONS ====
# Create a new migration
migrate-create:
	@read -p "Enter migration name: " name; \
	name=$$name pnpm run migration:create 

# Run migrations
migrate-run:
	docker-compose exec server pnpm run migration:run

# Revert the last migration
migrate-revert:
	docker-compose exec server pnpm run migration:revert

# === TESTING ====
# Run tests
test:
	docker-compose exec server pnpm run test

# === REDIS ====
# Connect to the redis cli
redis-cli:
	docker-compose exec redis redis-cli


# === DOCKER ===

# --- DEVELOPMENT
# Docker compose up for development
up-dev:
	docker-compose --env-file .dev.env -f docker-compose.dev.yml up -d

down-dev:
	docker-compose --env-file .dev.env -f docker-compose.dev.yml down 
# --- PRODUCTION
# Build the production image
img-prod:
	docker-compose --env-file .prod.env -f docker-compose.prod.yml up --build -d

# Docker compose up for production
up-prod:
	docker-compose --env-file .prod.env -f docker-compose.prod.yml up -d

# Docker compose down for production
down-prod:
	docker-compose --env-file .prod.env -f docker-compose.prod.yml down 

.PHONY: migrate-create migrate-run migrat je-revert test redis-cli up-dev down-dev img-prod up-prod down-prod
