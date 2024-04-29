# Define the base image and tag to be used across all build stages.
ARG IMAGE=node:18.19.0-alpine

# == COMMON STAGE ==
FROM $IMAGE as builder
WORKDIR /app
COPY . .
# Install pnpm globally and then use it to install project dependencies.
RUN npm install -g pnpm && \
    pnpm install

# This stage is used to build the application and prune development dependencies.
FROM builder as prod-build
RUN pnpm run build
RUN ls -la /app/dist && \
    pnpm prune --production

# == PRODUCTION STAGE ==
# This stage sets up the production environment.
FROM $IMAGE as prod

WORKDIR /app
# Copy built files and node_modules from prod-build stage
COPY --chown=node:node --from=prod-build /app/dist ./dist
COPY --chown=node:node --from=prod-build /app/node_modules ./node_modules

EXPOSE 3000

USER node
# Specify the entry point
ENTRYPOINT ["node", "./dist/main.js"]
CMD ["pnpm", "run", "start:prod"]
# Set the user to the node user.
