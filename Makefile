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
dcu-dev:
	docker-compose --env-file .dev.env up --build -d

# --- PRODUCTION
# Build the production image
dbi-prod:
	docker build --target prod -t server-jo-prod:latest .

# Docker compose up for production
dcu-prod:
	docker-compose --env-file .prod.env -f docker-compose.prod.yml up --build -d

# Docker compose down for production
dcd-prod:
	docker-compose -f docker-compose.prod.yml down 

.PHONY: migrate-create migrate-run migrat je-revert test redis-cli dbi-prod dcu-prod dcd-prod
