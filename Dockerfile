# Define the base image and tag to be used across all build stages.
ARG IMAGE=node:18.19.0-alpine

# == COMMON STAGE ==
FROM $IMAGE as builder
WORKDIR /app
COPY . .
# Install pnpm globally and then use it to install project dependencies.
RUN npm install -g pnpm && \
    pnpm install

# == DEVELOPMENT STAGE ==
FROM builder as dev
EXPOSE 3000
CMD [""]


# == PRE-PRODUCTION STAGE ==
# This stage is used to build the application and prune development dependencies.
FROM builder as prod-build
RUN pnpm run build
RUN ls -la /app/dist && \
    pnpm prune --production

# == PRODUCTION STAGE ==
# This stage sets up the production environment.
FROM $IMAGE as prod

# Copy built files and node_modules from builder stage
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
# Copy the .env file into the container.
COPY --chown=node:node --from=builder /app/.prod.env /app/.env

EXPOSE 3000
# Specify the entry point
ENTRYPOINT ["node", "./dist/main.js"]
CMD [""]
# Set the user to the node user.
USER node
