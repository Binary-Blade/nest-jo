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
