# === MIGRATIONS ====
# Create a new migration
migrate-create:
	@read -p "Enter migration name: " name; \
	name=$$name pnpm run migration:create 

# Run migrations
migrate-run:
	@echo "Running migrations..."
	docker-compose exec server pnpm run migration:run

# Revert the last migration
migrate-revert:
	docker-compose exec server pnpm run migration:revert

# === TESTING ====
# Run tests
test:
	@echo "Running tests..."
	docker-compose exec server pnpm run test

# === REDIS ====
# Connect to the redis cli
redis-cli:
	@echo "Connecting to redis cli..."
	docker-compose exec redis redis-cli


# === DOCKER ===

# --- DEVELOPMENT
# Docker compose up for development
dev:
	@echo "Setting containers to development..."
	@export NODE_ENV=development
	docker-compose --env-file ./.dev.env up -d

clean-d:
	@echo "Stopping development containers..."
	docker-compose --env-file .dev.env -f docker-compose.yml down 
# --- PRODUCTION
# Docker compose up for production
prod:
	@echo "Setting containers to production..."
	@export NODE_ENV=production
	docker-compose --env-file ./.prod.env -f docker-compose.prod.yml up -d

# Docker compose down for production
clean-p:
	@echo "Stopping production containers..."
	docker-compose --env-file .prod.env -f docker-compose.prod.yml down 

.PHONY: migrate-create migrate-run migrat je-revert test redis-cli dev clean-d prod clean-p
