<p align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">NEST-JO</h1>
</p>
<p align="center">
    <em>Optimized for Performance and Efficiency!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/Binary-Blade/nest-jo?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Binary-Blade/nest-jo?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Binary-Blade/nest-jo?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Binary-Blade/nest-jo?style=default&color=0080ff" alt="repo-language-count">
<p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>

<br><!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary><br>

- [ Overview](#-overview)
- [ Features](#-features)
- [ Repository Structure](#-repository-structure)
- [ Modules](#-modules)
- [ Getting Started](#-getting-started)
  - [ Installation](#-installation)
  - [ Usage](#-usage)
  - [ Tests](#-tests)
- [ Project Roadmap](#-project-roadmap)
- [ Contributing](#-contributing)
- [ License](#-license)
- [ Acknowledgments](#-acknowledgments)
</details>
<hr>

##  Overview

Nest-Jo is a powerful open-source project designed to streamline and optimize the development, testing, and deployment processes for Nest.js applications. Leveraging a comprehensive set of Docker services defined in docker-compose files, including PostgreSQL and Redis containers, Nest-Jo simplifies the setup of a robust environment for efficient development workflows. The project also includes configurations such as tsconfig.build.json for enhancing the TypeScript build process by excluding unnecessary files, enabling faster compilation and improved performance. With structures like nest-cli.json for customizing project layouts and compiler options, Nest-Jo offers modularity and flexibility, ultimately enhancing the development experience for engineers working on Nest.js applications. By bundling essential functionalities like hot-reload servers and production environment setups, Nest-Jo adds value by streamlining the development lifecycle and enhancing the overall productivity of software teams.

---

##  Features

|    |   Feature         | Description |
|----|-------------------|---------------------------------------------------------------|
| ⚙️  | **Architecture**  | Nest.js project with optimized TypeScript build process. Utilizes Docker and services for PostgreSQL and Redis. Facilitates efficient development, testing, and deployment. |
| 🔩 | **Code Quality**  | Follows linting rules with ESLint and Prettier configurations. Maintains consistent code style and readability throughout the codebase. |
| 📄 | **Documentation** | Extensive documentation with tsconfig files and Docker configurations. Enables developers to understand and contribute to the project efficiently. |
| 🔌 | **Integrations**  | Integrates various libraries like Passport JWT, TypeORM, and Winston. Utilizes Swagger for API documentation and NestJS modules for scalability. |
| 🧩 | **Modularity**    | Highly modular codebase with class-transformer and class-validator usage. Promotes code reuse and separation of concerns. |
| 🧪 | **Testing**       | Uses Jest and Supertest for testing, with TypeORM for database integration testing. Ensures robust test coverage for reliable code quality. |
| ⚡️  | **Performance**   | Efficient resource usage with Redis caching, Express Rate Limit, and optimized TypeScript compilation. Ensures fast execution and performance. |
| 🛡️ | **Security**      | Implements security measures like helmet, CORS, and Argon2 for secure data handling. Uses JWT and rate limiting for access control. |
| 📦 | **Dependencies**  | Relies on key libraries like NestJS, TypeORM, and Express. Also uses Redis, PostgreSQL, and various TypeScript typings for functionality. |
| 🚀 | **Scalability**   | Built with scalability in mind using NestJS features for handling increased traffic and load. Docker setup enables easy scaling and deployment. |

---

##  Repository Structure

```sh
└── nest-jo/
    ├── Dockerfile
    ├── Makefile
    ├── README.md
    ├── docker-compose.override.yml
    ├── docker-compose.prod.yml
    ├── docker-compose.yml
    ├── nest-cli.json
    ├── package.json
    ├── src
    │   ├── app.module.ts
    │   ├── common
    │   ├── database
    │   ├── libs
    │   ├── main.ts
    │   ├── modules
    │   ├── security
    │   ├── type.d.ts
    │   └── utils
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                    |
| [tsconfig.build.json](https://github.com/Binary-Blade/nest-jo/blob/master/tsconfig.build.json)                 | Optimize TypeScript build process by excluding unnecessary files from compilation. This setting in tsconfig.build.json improves build performance for the Nest.js project, focusing on essential source files while excluding test and distribution directories.                                       |
| [docker-compose.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.yml)                   | Defines Docker services for NestJS server, PostgreSQL database, and Redis cache. Specifies networking and persistent volumes. Enables efficient development, testing, and deployment of the NestJS application within the repositorys architecture.                                                    |
| [docker-compose.override.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.override.yml) | Server with hot-reload, PostgreSQL, and Redis. Manages container configuration, exposing server on port 3000, linking environment variables. Facilitates seamless development setup within the NestJS projects architecture.                                                                           |
| [Dockerfile](https://github.com/Binary-Blade/nest-jo/blob/master/Dockerfile)                                   | Installs dependencies, builds app, and prunes dev dependencies, 2) Sets up production environment, copies necessary files, exposes port, and specifies entry point for running app.                                                                                                                    |
| [nest-cli.json](https://github.com/Binary-Blade/nest-jo/blob/master/nest-cli.json)                             | Enables customization of Nest.js project structuring via the nest-cli.json file. Specifies schema, collection, source root, and compiler options, enhancing modularity and build configuration within the repository's architecture.                                                                   |
| [docker-compose.prod.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.prod.yml)         | Defines production environment setup for NestJS server, PostgreSQL database, and Redis cache using Docker Compose. Manages service dependencies, environment variables, volume configurations, and network connections for seamless deployment in the repositorys architecture.                        |
| [tsconfig.json](https://github.com/Binary-Blade/nest-jo/blob/master/tsconfig.json)                             | Enables module path aliases for streamlined import statements in the NestJS project. Organizes codebase structure by providing easy access to common, module-specific, security, database, library, and utility files. Support for TypeScript compilation and efficient development workflow.          |
| [package.json](https://github.com/Binary-Blade/nest-jo/blob/master/package.json)                               | Enables building, testing & running a Nest.js API. Key tasks include building, formatting, linting, testing, starting the app in different environments, handling database migrations, and setting up TypeORM. Dependencies cover various Nest.js modules, utilities, security, and database packages. |
| [Makefile](https://github.com/Binary-Blade/nest-jo/blob/master/Makefile)                                       | Manages database migrations, testing, Redis connection, and Docker operations for development and production environments within the repository architecture. Key functions include creating, running, and reverting migrations, running tests, connecting to Redis, and managing Docker containers.   |

</details>

<details closed><summary>src</summary>

| File                                                                                   | Summary                                                                                                                                                                                                                                                                                |
| ---                                                                                    | ---                                                                                                                                                                                                                                                                                    |
| [main.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/main.ts)             | Initiates NestJS application setup with logging, CORS, database migrations, cookie parsing, security headers, and global pipes/interceptors/filters. Listens on configurable port with environment mode logging.                                                                       |
| [type.d.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/type.d.ts)         | Extends Express Request interface to include user property for attaching logged-in user data.                                                                                                                                                                                          |
| [app.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/app.module.ts) | Defines root application module with global configuration, database, Redis connections, authentication, user, event, cart, reservation, payment, ticket, transaction, and request throttling modules. Orchestrates key system components for a robust and scalable NestJS application. |

</details>

<details closed><summary>src.libs.payment</summary>

| File                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                    |
| ---                                                                                                                     | ---                                                                                                                                                                                                                                                                                                        |
| [payment.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.module.ts)             | Facilitates payment processing by integrating user, reservation, transaction, and ticket entities. Exports PaymentService to handle payment-related operations within the NestJS apps modular architecture.                                                                                                |
| [payment.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.service.spec.ts) | Tests payment processing scenarios based on cart total, returning different reservation statuses.                                                                                                                                                                                                          |
| [payment.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.service.ts)           | Handles payment processing for a shopping cart based on a success rate, ensuring payment approval or rejection. Located in the `src/libs/payment/payment.service.ts` file of the `nest-jo` repository, this service plays a crucial role in managing the payment flow within the application architecture. |

</details>

<details closed><summary>src.common.enums</summary>

| File                                                                                                                          | Summary                                                                                                                                                                                                                       |
| ---                                                                                                                           | ---                                                                                                                                                                                                                           |
| [sort-order.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/sort-order.enum.ts)                 | ASC (ascending) and DESC (descending). Crucial for ordering operations throughout the Nest-jo repository, ensuring flexibility and consistency in sorting functionalities.                                                    |
| [user-role.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/user-role.enum.ts)                   | Defines user roles as an enum in the common module to manage authorization levels within the Nest-JO repository structure.                                                                                                    |
| [status-reservation.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/status-reservation.enum.ts) | Defines reservation status options for the common module.                                                                                                                                                                     |
| [category-type.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/category-type.enum.ts)           | Defines event categories with types for sports events in the repositorys Nest.js backend. Categorizes events such as Archery, Athletics, and Basketball into enums for easy reference and consistency across the application. |
| [price-formula.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/price-formula.enum.ts)           | Defines price formulas for various customer groups within the Nest-JO repositorys architecture.                                                                                                                               |

</details>

<details closed><summary>src.common.decorators</summary>

| File                                                                                                                   | Summary                                                                                                                                                                                                                                                                                  |
| ---                                                                                                                    | ---                                                                                                                                                                                                                                                                                      |
| [user-id.decorator.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/decorators/user-id.decorator.ts) | Extracts user ID from request object using a custom NestJS decorator. Enhances route handlers to access user ID effortlessly, reinforcing authorization capabilities within the applications domain.                                                                                     |
| [role.decorator.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/decorators/role.decorator.ts)       | Defines a role decorator to set user roles for route handlers in the NestJS application. It imports UserRole enum and utilizes SetMetadata from @nestjs/common. Key features include ease of role assignment for different routes and increased modularity in handling user permissions. |

</details>

<details closed><summary>src.common.exceptions</summary>

| File                                                                                                                                           | Summary                                                                                                                                                                                                                                |
| ---                                                                                                                                            | ---                                                                                                                                                                                                                                    |
| [invalid-credentials.exception.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/exceptions/invalid-credentials.exception.ts) | Defines `InvalidCredentialsException` for unauthorized login attempts in the backend. Extends `HttpException` with a message and status code. Centralizes handling of invalid login credentials within the `common/exceptions` module. |

</details>

<details closed><summary>src.common.globals-filter</summary>

| File                                                                                                                                           | Summary                                                                                                                                                                                                                      |
| ---                                                                                                                                            | ---                                                                                                                                                                                                                          |
| [http-exceptions-filter.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/globals-filter/http-exceptions-filter.spec.ts) | Implements logging and formats error responses based on environment for HTTP exceptions in the NestJS app. It handles non-production vs. production scenarios, creating detailed response objects and logging appropriately. |
| [http-exceptions-filter.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/globals-filter/http-exceptions-filter.ts)           | Handles and customizes HTTP exceptions by providing detailed error responses in non-production environments using NestJS. The filter class logs errors, constructs responses, and enhances debugging info for API requests.  |

</details>

<details closed><summary>src.common.dto</summary>

| File                                                                                                      | Summary                                                                                                                                                                                                    |
| ---                                                                                                       | ---                                                                                                                                                                                                        |
| [pagination.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/dto/pagination.dto.ts) | Defines a PaginationAndFilter DTO for sorting, filtering, and paginating data in the repository. Enables standardized input handling for querying and presenting data efficiently within the architecture. |
| [id.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/dto/id.dto.ts)                 | Validates and sanitizes ID inputs through a Data Transfer Object (DTO) using class-validator in the parent repositorys architecture.                                                                       |

</details>

<details closed><summary>src.common.interfaces</summary>

| File                                                                                                                                   | Summary                                                                                                                                                                                                                                        |
| ---                                                                                                                                    | ---                                                                                                                                                                                                                                            |
| [token.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/token.interface.ts)                     | TokenConfig` specifying secrets and expiration times for access and refresh tokens within Nest-jos architecture.                                                                                                                               |
| [payment.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/payment.interface.ts)                 | Defines interfaces for payment processing results and responses to ensure consistency and clarity in managing payment status, details, and associated reservations within the repositorys architecture.                                        |
| [key-value-redis.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/key-value-redis.interface.ts) | Defines a structure for storing key-value pairs in the Redis database. Used to represent data within the repositorys architecture.                                                                                                             |
| [payload.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/payload.interface.ts)                 | Defines JWT payload structure with user ID, role, and token version, enhancing authentication in the Nest-JO repository.                                                                                                                       |
| [jwt.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/jwt.interface.ts)                         | Defines interfaces for JWT payload and tokens with sub, role, version, accessToken, refreshToken, and optional expiresIn properties. Crucial for handling JWT authentication and authorization within the NestJS-based projects common module. |

</details>

<details closed><summary>src.common.logger</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                               |
| ---                                                                                                            | ---                                                                                                                                                                                                                   |
| [winston.config.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/logger/winston.config.ts)   | Defines logging levels and formats based on environment for the user-service. Utilizes Winston to log to files and console in development. Maintains consistent log formats across transports.                        |
| [winston.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/logger/winston.service.ts) | Implements a WinstonLoggerService for logging at different levels. It integrates the winston logger setup into the repositorys common functionality, enhancing the architecture with structured logging capabilities. |

</details>

<details closed><summary>src.modules</summary>

| File                                                                                                 | Summary                                                                                                                                                                   |
| ---                                                                                                  | ---                                                                                                                                                                       |
| [commom.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/commom.module.ts) | Defines a module consolidating common services. Imports and exports vital services for the app. Facilitates seamless access to shared functionalities across the project. |

</details>

<details closed><summary>src.modules.reservation-details</summary>

| File                                                                                                                                                           | Summary                                                                                                                                                                                                                                                   |
| ---                                                                                                                                                            | ---                                                                                                                                                                                                                                                       |
| [reservation-details.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.module.ts)             | Orchestrates reservation details management by integrating services and entities.-Registers ReservationDetailsService provider, importing Event and ReservationDetails entities.-Utilizes CartItemsModule and EventsModule from the repository structure. |
| [reservation-details.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.service.ts)           | Manages reservation details, creating new entries from reservations and cart items. Also retrieves reservation details by ID, handling related entities.                                                                                                  |
| [reservation-details.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.service.spec.ts) | Implements ReservationDetailsService tests ensuring event existence, creation, and retrieval. Uses repositories to simulate and verify operations. Enhances reservation details handling within the Nest-JO repository architecture.                      |

</details>

<details closed><summary>src.modules.reservation-details.entities</summary>

| File                                                                                                                                                        | Summary                                                                                                                                                                                                               |
| ---                                                                                                                                                         | ---                                                                                                                                                                                                                   |
| [reservation-details.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/entities/reservation-details.entity.ts) | Defines reservation details, linking reservations and events with pricing data and timestamps. Crucial for handling booking specifics within the Nest.js architecture, facilitating efficient reservation management. |

</details>

<details closed><summary>src.modules.reservation-details.dto</summary>

| File                                                                                                                                                           | Summary                                                                                                                                                                                   |
| ---                                                                                                                                                            | ---                                                                                                                                                                                       |
| [create-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/dto/create-reservation-details.dto.ts) | Defines required data structure for creating reservation details; validations ensure data integrity. Implements PriceFormulaEnum for pricing flexibility within the Nest.js architecture. |
| [update-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/dto/update-reservation-details.dto.ts) | Enables updating reservation details by extending the creation DTO with optional properties. Crucial for managing reservation data within the repositorys architecture.                   |

</details>

<details closed><summary>src.modules.users</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                 |
| ---                                                                                                                        | ---                                                                                                                                                                                                                     |
| [users.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.controller.spec.ts) | Ensures CRUD operations perform as expected with mocked UsersService. Covers find, update, and set inactive user actions, responding appropriately to various scenarios like user not found.                            |
| [users.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.module.ts)                   | Defines a module managing users in the NestJS application, incorporating TypeORM for entities. Registers controllers and providers for user-related operations, authentication strategy, and database query assistance. |
| [users.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.service.ts)                 | Manages user data with CRUD operations, pagination, and filters. Validates user existence and updates user info securely. Key features include finding, updating, deactivating users, and verifying user relations.     |
| [users.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.service.spec.ts)       | Implements user management functions for the repository, including finding, updating, and deactivating users. Handles database interactions and error handling, ensuring data integrity and system reliability.         |
| [users.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.controller.ts)           | Controls user data access, retrieval, updates, and deactivation with role-based guards. Performs operations based on user ID and user role. Only accessible by admins, the user, or the creator.                        |

</details>

<details closed><summary>src.modules.users.entities</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                                                      |
| ---                                                                                                             | ---                                                                                                                                                                                                                                                                          |
| [user.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/entities/user.entity.ts) | Defines User entity with relationships to Cart, Reservations, and Transactions. Captures user details like email, names, role, activity status, and timestamps, excluding sensitive fields. Contributes to user data management within the repositorys modular architecture. |

</details>

<details closed><summary>src.modules.users.dto</summary>

| File                                                                                                               | Summary                                                                                                                                                                                                                                             |
| ---                                                                                                                | ---                                                                                                                                                                                                                                                 |
| [update-user.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/update-user.dto.ts) | Defines an UpdateUserDto class inheriting properties from CreateUserDto with all fields optional. This supports flexible user data updates in the users module.                                                                                     |
| [index.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/index.ts)                     | Exports user-related data transfer objects for creating and updating users within the Nest-JO repositorys modular architecture.                                                                                                                     |
| [create-user.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/create-user.dto.ts) | Defines a DTO for user creation with fields for first name, last name, email, password, and role. Implements validation rules using class-validator for each field. This DTO ensures proper data structure for user creation within the repository. |

</details>

<details closed><summary>src.modules.cart-items</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                             |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                 |
| [cart-items.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.module.ts)                   | Defines a module managing cart items in the NestJS repository. Imports TypeORM for entities, connects to related modules, and registers services. Follows the repositorys architecture by integrating with Events, Carts, and Reservations modules. |
| [cart-items.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.service.ts)                 | Manages cart items, enabling addition, retrieval, update, and removal functionalities. Interfaces with related services to handle user shopping cart operations seamlessly within the NestJS repository structure.                                  |
| [cart-items.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.controller.ts)           | Manages cart items by allowing addition, retrieval, updating, and removal functionalities. Utilizes user authentication and service for cart operations. Supports handling cart items for a specific user and cart.                                 |
| [cart-items.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.service.spec.ts)       | Adding, updating, and removing items from a cart. Utilizes repositories, services, and DTOs to facilitate interaction with the database. Handles exceptions for non-existent events and insufficient ticket quantities.                             |
| [cart-items.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.controller.spec.ts) | Create, FindAll, FindOne, Update, Remove. Handles item addition, retrieval, updating, and deletion in the shopping cart. Validates user permissions and responses based on item existence.                                                          |

</details>

<details closed><summary>src.modules.cart-items.entities</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                   |
| ---                                                                                                                            | ---                                                                                                                                                                                                       |
| [cartitems.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/entities/cartitems.entity.ts) | Defines a CartItem entity with associations to Cart, Event, and Reservations. Manages pricing, quantity, and timestamps for items in a shopping cart within the nest-jo repositorys modular architecture. |

</details>

<details closed><summary>src.modules.cart-items.dto</summary>

| File                                                                                                                              | Summary                                                                                                                                                                                                                                             |
| ---                                                                                                                               | ---                                                                                                                                                                                                                                                 |
| [create-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/dto/create-cart-item.dto.ts) | Defines a DTO for creating a cart item, enforcing data integrity by specifying user, event, quantity, and pricing formula fields. Collaborates with the architecture to ensure accurate cart item creation within the NestJS e-commerce repository. |
| [update-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/dto/update-cart-item.dto.ts) | Enables cart item updates with optional properties. Extends `CreateCartItemDto` to modify cart items flexibly within the `cart-items` module, enhancing the dynamic functionality of the parent repositorys e-commerce platform.                    |

</details>

<details closed><summary>src.modules.reservations</summary>

| File                                                                                                                                                          | Summary                                                                                                                                                                                                                                                                                                     |
| ---                                                                                                                                                           | ---                                                                                                                                                                                                                                                                                                         |
| [reservations-processor.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations-processor.service.spec.ts) | Implements reservation processing logic for user bookings, payments, and cart management. Leveraging service dependencies for user verification, transaction handling, and reservation creation, culminating in successful booking finalization and cleanup operations post-payment.                        |
| [reservations.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.controller.spec.ts)               | Tests reservation-related endpoints, ensuring successful creation, proper error handling, and retrieval of reservations. Validates interactions with the ReservationsService for user and admin roles, conforming to specified behaviors and data fetch criteria.                                           |
| [reservations.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.service.spec.ts)                     | GenerateReservations, findAll, findAllAdmin, findOne, saveReservation. Employs mock functions and entities. Validates processing, retrieval, and saving of reservations, enhancing robustness.                                                                                                              |
| [reservations-processor.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations-processor.service.ts)           | Processes user reservations, creates new reservations for cart items, finalizes bookings by updating event tickets, prevents duplicate reservations, and cleans up post-payment. Interfaces with multiple services to manage transactions, payments, cart items, and users in the repositorys architecture. |
| [reservations.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.service.ts)                               | Manages reservations for users, processing, and retrieving data with pagination and filtering. Handles admin view for reservations, saving, and finding specific reservations. Implements query options to enhance database interactions in the repository architecture.                                    |
| [reservations.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.module.ts)                                 | Enables management of reservations in the application by providing controllers, services, and importing related modules/entities. Facilitates interaction with tickets, events, carts, and transactions while ensuring data integrity with TypeORM.                                                         |
| [reservations.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.controller.ts)                         | Manages user reservations with creation, retrieval, and admin access functions. Implements reservation services for user and admin operations, supporting pagination and filtering. Enables actions like creating, finding, and examining reservations.                                                     |

</details>

<details closed><summary>src.modules.reservations.entities</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                            |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                |
| [reservation.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/entities/reservation.entity.ts) | Defines reservation entity relationships for users, details, transactions, cart items, and tickets. Timestamps track creation and updates. Organized within the reservations module, supporting the systems booking functionality. |

</details>

<details closed><summary>src.modules.reservations.dto</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                                           |
| ---                                                                                                                                     | ---                                                                                                                                                                                               |
| [create-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/dto/create-reservation.dto.ts) | Verifies user, cart item, total price, and payment ID validity. Crucial for ensuring accurate creation of reservations within reservations module of NestJS project.                              |
| [update-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/dto/update-reservation.dto.ts) | Defines an UpdateReservationDto class extending CreateReservationDto, enabling optional property updates. This DTO streamlines reservation data manipulation within the repositorys architecture. |

</details>

<details closed><summary>src.modules.events</summary>

| File                                                                                                                                | Summary                                                                                                                                                                                                                                                                                                                        |
| ---                                                                                                                                 | ---                                                                                                                                                                                                                                                                                                                            |
| [events.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.controller.ts)                 | Manages event creation, retrieval, updates, and deletion, restricting access to admins. Supports fetching event prices and filtered events with pagination. Implements role-based guards for security.                                                                                                                         |
| [event-prices.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-prices.service.ts)           | Creates, retrieves, updates, and deletes prices based on formulas. Ensures events exist before price operations. High modularity and TypeORM integration in the repositorys nested structure.                                                                                                                                  |
| [events.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.service.spec.ts)             | Creates, retrieves, updates, and removes events. Utilizes Redis caching, TypeORM entities, and DTOs for effective event handling. Handles conflicts, not found exceptions, and filters events based on specified criteria.                                                                                                     |
| [events.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.service.ts)                       | Manages events by creating, updating, retrieving, and deleting events with unique titles. Handles pagination, filtering, and caching. Utilizes TypeORM for database operations and Redis for caching.                                                                                                                          |
| [events.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.module.ts)                         | Defines a module managing events with services for event management, pricing, and sales. Registers controllers and providers for event-related entities using TypeORM. Facilitates seamless interaction with event data in the NestJS architecture.                                                                            |
| [event-sales.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-sales.service.ts)             | Manages event ticket sales & revenue by processing cart items, updating revenue for events, and deducting ticket quantities based on price formulas. Critical for tracking event finances in the repositorys modular architecture.                                                                                             |
| [events.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.controller.spec.ts)       | Tests EventsControllers CRUD operations for events, ensuring proper service method calls with valid input data. Supports event creation, retrieval, updates, and deletion functionalities based on specified criteria. Aligns with the repositorys modular architecture for scalable event management in a NestJS application. |
| [event-sales.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-sales.service.spec.ts)   | Implements** ticket sales processing for events.-**Updates** event revenue dynamically.-**Manages** event ticket quantities.-**Validates** ticket availability.-**Ensures** revenue accuracy.                                                                                                                                  |
| [event-prices.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-prices.service.spec.ts) | Implements EventPricesService testing for event price creation, retrieval, updating, and deletion. Spans service interaction with repositories and throws NotFoundExceptions. Ensures event and price data integrity for the nest-jo architecture.                                                                             |

</details>

<details closed><summary>src.modules.events.entities</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                   |
| ---                                                                                                                            | ---                                                                                                                                                                                                                       |
| [event-price.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/entities/event-price.entity.ts) | Defines EventPrice entity with price formula and price attributes linked to the Event entity in the event_prices table to manage different event pricing structures within the Nest-JO repository's modular architecture. |
| [event.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/entities/event.entity.ts)             | Defines Event entity structure with title, descriptions, pricing, dates, quantities, revenue, and relationships for a Nest.js projects event management module.                                                           |

</details>

<details closed><summary>src.modules.events.dto</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                           |
| ---                                                                                                                   | ---                                                                                                                                                                                                                               |
| [update-event.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/dto/update-event.dto.ts) | Defines `UpdateEventDto` by extending `PartialType` from NestJS Swagger. Facilitates updating event data by inheriting from `CreateEventDto`. vital for ensuring accurate event modifications within the events module structure. |
| [create-event.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/dto/create-event.dto.ts) | Title, descriptions, price, dates, and category type. Enforces specific field criteria. Integrates with CategoryEventTypeEnum for event categorization within the repositorys modular architecture.                               |

</details>

<details closed><summary>src.modules.tickets</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                               |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                   |
| [tickets.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.service.ts)           | Manages ticket generation for approved reservations. Links transactions, users, and reservations to generate tickets securely. Handles ticket creation, encryption, and QR code generation.                                                                           |
| [tickets.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.module.ts)             | Defines a module for managing tickets, essential for creating reservations. Imports modules to handle reservations, transactions, and user entities. Resolves circular dependencies with forwardRef. Provides the TicketsService for ticket operations.               |
| [tickets.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.service.spec.ts) | Implements ticket generation for approved reservations, handles non-approved cases, and creates tickets securely. Services include encryption, reservations, users, and transactions to facilitate the ticketing process within the repositorys modular architecture. |

</details>

<details closed><summary>src.modules.tickets.entities</summary>

| File                                                                                                                  | Summary                                                                                                                                                                               |
| ---                                                                                                                   | ---                                                                                                                                                                                   |
| [ticket.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/entities/ticket.entity.ts) | Defines the Ticket entity structure with relationships for the Nest-jo repository.Specifies ticket details such as ID, reservation connection, purchase key, secure key, and QR code. |

</details>

<details closed><summary>src.modules.transactions</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                                                                                                   |
| [transactions.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.controller.spec.ts) | Implements tests for `TransactionsController` to ensure retrieval of user transactions based on specified filters. Handles mocked data responses for transactions, validating the correct functionality of the `findAll` method.                                                                                                      |
| [transactions.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.module.ts)                   | Defines a module managing transactions, integrating TypeORM for entities, TransactionsService, ReservationDetailsService, and providing TransactionsController. Imports ReservationsModule and TicketsModule. Services include TransactionService, ReservationDetailsService, and QueryHelperService. TransactionService is exported. |
| [transactions.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.service.ts)                 | Manages transactions for users, enabling creation, retrieval by reservation ID, and browsing with pagination and filtering. Calculates total cart amount and selects specific fields for queries in the repository architecture.                                                                                                      |
| [transactions.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.service.spec.ts)       | Ensures transactions creation, retrieval, and total calculation capabilities. Implements error handling. Collaborates with typeorm repositories and query services for seamless data management and retrieval.                                                                                                                        |
| [transactions.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.controller.ts)           | Implements a controller for managing user transactions with pagination and filtering. Uses an access token guard for security. Handles requests to retrieve filtered transactions with pagination based on user ID.                                                                                                                   |

</details>

<details closed><summary>src.modules.transactions.entities</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                        |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                            |
| [transaction.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/entities/transaction.entity.ts) | Defines a Transaction entity with fields for user, reservations, payment status, payment ID, total amount, and timestamps. Linked to User and Reservation entities. Crucial for managing transaction data within the repositorys architecture. |

</details>

<details closed><summary>src.modules.transactions.dto</summary>

| File                                                                                                                                    | Summary                                                                                                                     |
| ---                                                                                                                                     | ---                                                                                                                         |
| [create-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/dto/create-transaction.dto.ts) | Defines create-transaction data transfer object to capture transaction details within the Nest-JO repositorys architecture. |
| [update-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/dto/update-transaction.dto.ts) | Defines a DTO class by extending another to represent a partial update to a transaction entity.                             |

</details>

<details closed><summary>src.modules.carts</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                                   |
| ---                                                                                                                  | ---                                                                                                                                                                                                                       |
| [carts.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.service.ts)           | Find, create, verify, save, delete. Utilizes TypeORM for data handling. Key methods ensure cart existence, handle relationships, and provide error handling. Enhances user experience within NestJS ecosystem.            |
| [carts.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.service.spec.ts) | Find, create, verify existence, save, and delete. Ensures successful cart retrievals and throws NotFoundException if needed. Enhances the carts module functionality within the repositorys architectural design.         |
| [carts.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.module.ts)             | Implements a module for managing carts in the Nest.js application by defining the necessary dependencies and registering the CartsService as a provider, facilitating the handling and manipulation of cart-related data. |

</details>

<details closed><summary>src.modules.carts.entities</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                         |
| ---                                                                                                             | ---                                                                                                                                                                                                                                             |
| [cart.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/entities/cart.entity.ts) | Defines a shopping cart entity with a user association, cart items, and creation/update timestamps. Organized within the cart entity, enabling efficient management of user-specific shopping cart details in the Nest.js backend architecture. |

</details>

<details closed><summary>src.database</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                            |
| ---                                                                                                             | ---                                                                                                                                                                                                                                |
| [typeorm-cli.config.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/typeorm-cli.config.ts) | Defines TypeORM DataSource config for PostgreSQL in the NestJS project. Loads env variables and sets up DB connection details dynamically using ConfigService. Specifies paths to entities and migrations for database operations. |
| [migration-runner.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migration-runner.ts)     | Executes database migrations with TypeORM. Logger tracks progress. Handles initialization, migration execution, and error handling. Supports app stability and data schema updates within the repositorys NestJS architecture.     |
| [database.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/database.module.ts)       | Establishes PostgreSQL database connection using TypeORM, dynamically configuring through environment variables. Enables secure database setup via ConfigService injection.                                                        |

</details>

<details closed><summary>src.database.redis</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                            |
| ---                                                                                                                   | ---                                                                                                                                                                                                                |
| [redis.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.service.ts)           | Implements Redis caching functions for efficient data storage and retrieval. Contains methods to set, get, delete data in Redis, fetch data from cache, safely parse JSON, and clear cache by event or all events. |
| [redis.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.module.ts)             | Sets up and configures the Redis client using environment variables. Provides the Redis client instance and Redis service. Centralizes Redis setup and access for use across the application modules.              |
| [redis.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.service.spec.ts) | Implements Redis caching logic with set, get, and del operations. Handles cache retrieval, storage, and error scenarios for efficient data caching in the Nest.js project structure.                               |

</details>

<details closed><summary>src.database.migrations</summary>

| File                                                                                                                                                                         | Summary                                                                                                                                                                                                                                                                                     |
| ---                                                                                                                                                                          | ---                                                                                                                                                                                                                                                                                         |
| [1712751776641-CreateTableReservationDetails.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712751776641-CreateTableReservationDetails.ts) | Defines migration to create reservation_details table for detailed reservation info, covering event references and pricing. Implements up() to create table if not existing, down() to revert changes.                                                                                      |
| [1712661230450-CreateTableCartItems.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230450-CreateTableCartItems.ts)                   | Defines and executes database migration to create cart_items table in the application. Ensures proper storage of cart item details with cart and event references, price formula, quantity, and timestamps. Also manages table existence checks and enum types.                             |
| [1712661230451-CreateTableReservations.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230451-CreateTableReservations.ts)             | Implements migration for reservations table creation in the database, managing reservation info for users, cart items, transactions, details, and tickets within the application schema. It creates or drops the table based on existence to ensure reservation data storage functionality. |
| [1712717719010-CreateTableTickets.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712717719010-CreateTableTickets.ts)                       | Creates migration for tickets table with reservation and security details. Set up schema to manage tickets within the application. Implementation handles table creation and deletion based on existing state.                                                                              |
| [1712572717258-CreateTableEvents.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712572717258-CreateTableEvents.ts)                         | Creates events table schema for managing event details in the application. Adds columns for title, descriptions, pricing, dates, etc. Skips creation if table or category_type_enum type exists. Downs the events table in revert.                                                          |
| [1711085051379-CreateTableUsers.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1711085051379-CreateTableUsers.ts)                           | Creates user table with essential columns and default values. Validates table existence and user role enum type. Enables migration up (create) and down (drop) functionality for user data management within the apps database architecture.                                                |
| [1712661230452-CreateTableTransactions.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230452-CreateTableTransactions.ts)             | Implements migration functionality to create and revert a transactions table in the database. Checks for existing table and enum type before creating. Supports storing transaction details linked to users and payments in the system architecture.                                        |
| [1712661221574-CreateTableCarts.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661221574-CreateTableCarts.ts)                           | Creates a migration for the cart table in the database. Adds columns for cart details, user references, and timestamps for creation and updates. Implements methods to create and revert the table if needed.                                                                               |
| [1712642603000-CreateTableEventPrices.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712642603000-CreateTableEventPrices.ts)               | Defines a migration creating the event_prices table storing event pricing details. Checks table existence and ensures the type_price_formule_enum type exists. Supports creating and dropping the table based on existence status.                                                          |
| [1712751780000-AddForeignKey.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712751780000-AddForeignKey.ts)                                 | Implements foreign key constraints for the reservations and tickets tables, ensuring referential integrity in the database. Facilitates linking reservations to users, transactions, and tickets, enhancing data relationships.                                                             |

</details>

<details closed><summary>src.database.migrations-test</summary>

| File                                                                                                                                                                                      | Summary                                                                                                                                                                                                                                                           |
| ---                                                                                                                                                                                       | ---                                                                                                                                                                                                                                                               |
| [add-foreign-key-constraints.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/add-foreign-key-constraints.migration.spec.ts)           | Implements migrations to add foreign key constraints between tables, ensuring data integrity by linking reservations, tickets, users, and transactions in the database.                                                                                           |
| [create-table-cart-items.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-cart-items.migration.spec.ts)                   | Implements CreateTableCartItems migration testing in the database module. Verifies table creation based on existing table status, ensuring correct table operations in the NestJS project. Enforces data integrity and schema evolution with database migrations. |
| [create-table-reservation-details.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-reservation-details.migration.spec.ts) | Verifies and creates a reservation_details table if not existing. Tests migration logic ensuring table creation based on TypeORM query results. Aligns with the repositorys modular database structure.                                                           |
| [create-table-reservations.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-reservations.migration.spec.ts)               | Implements migration logic to create or drop reservations table based on its existence. Supports database schema evolution in the Nest-JO repository architecture.                                                                                                |
| [create-table-events.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-events.migration.spec.ts)                           | Implements migration logic for creating and dropping the events table in the database. Validates table existence to avoid duplicate creation. Enforces database schema integrity for the NestJS project's database module.                                        |
| [create-table-event-prices.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-event-prices.migration.spec.ts)               | Implements migration logic for creating or dropping the event_prices table using TypeORM and constants. Handles scenarios where the table already exists or needs creation, utilizing QueryRunner methods effectively within the NestJS database architecture.    |
| [create-table-tickets.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-tickets.migration.spec.ts)                         | Implements migration tests ensuring tickets table creation and deletion. Verifies existent table before acting. Maintains database schema integrity in the Nest.js project.                                                                                       |
| [create-table-transactions.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-transactions.migration.spec.ts)               | Implements migration for transactions table creation and deletion based on table existence in the database. Ensures proper table management without duplicate creation.                                                                                           |
| [create-table-carts.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-carts.migration.spec.ts)                             | Verifies and applies database schema changes for the cart table based on table existence checks, ensuring seamless migration operations within the nest-jo project's database architecture.                                                                       |
| [create-table-users.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-users.migration.spec.ts)                             | Implements migration tests for creating/dropping users table. Verifies table creation and dropping logic based on existing table status, ensuring database integrity in the Nest.js project's database architecture.                                              |

</details>

<details closed><summary>src.database.query</summary>

| File                                                                                                                                | Summary                                                                                                                                                                                                                                                            |
| ---                                                                                                                                 | ---                                                                                                                                                                                                                                                                |
| [query-helper.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/query/query-helper.service.spec.ts) | Implements query building functions for sorting, filtering, and ordering database queries based on provided criteria. Enhances data retrieval capabilities within the repository architecture.                                                                     |
| [query-helper.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/query/query-helper.service.ts)           | Builds query options for database operations, incorporating pagination, sorting, and filtering. Constructs where conditions for filtering and nested order conditions for sorting, enhancing data retrieval efficiency within the parent repositorys architecture. |

</details>

<details closed><summary>src.utils.constants</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                    |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                        |
| [constants.env.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.env.ts)                 | Define key environment constants for node environment, development, and production, enabling specific logic based on the environment setting. Centralizes environment-related configurations for better code clarity and maintainability.                  |
| [constants.common.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.common.ts)           | Defines price formulas and default page sizes for entities in the repository. PRICES_FORMULA maps price types to multipliers. DEFAULT_PAGE_SIZE sets entity-specific default page sizes. Crucial for consistent pricing and pagination across the project. |
| [constants.migrationdb.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.migrationdb.ts) | Type_price_formule, user_role, status_reservation, category_type. Utilizes constants for easy maintenance and generates SQL dynamically based on predefined enum values.                                                                                   |

</details>

<details closed><summary>src.utils.services</summary>

| File                                                                                                                                  | Summary                                                                                                                                                                                                                                             |
| ---                                                                                                                                   | ---                                                                                                                                                                                                                                                 |
| [convert-utils.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/services/convert-utils.service.spec.ts) | Tests conversion functions in ConvertUtilsService to ensure accurate conversion of days to seconds and date strings to Date objects. Validates handling of invalid inputs, contributing to robust utility services in the repositorys architecture. |
| [convert-utils.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/services/convert-utils.service.ts)           | Convert days to seconds and date string to Date object. Enhances repository architecture by providing essential util functions for various modules.                                                                                                 |

</details>

<details closed><summary>src.security.encryption</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                                 |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                                     |
| [encryption.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/encryption/encryption.service.ts)           | Hashing passwords with Argon2, verifying passwords, generating UUIDs and secure keys for users, and creating QR codes from secure keys. Crucial for security and user authentication within the Nest-JO repositorys architecture.                       |
| [encryption.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/encryption/encryption.service.spec.ts) | Tests encryption service for hashing and verifying passwords using Argon2. Ensures password hashing and verification functionality is correctly implemented. Key element in ensuring secure password management within NestJS authentication framework. |

</details>

<details closed><summary>src.security.guards</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                           |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                               |
| [is-creator.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/is-creator.guard.ts)           | Validates user identity as content creator in routes, throwing exception if unauthorized. Enhances request object with creator flag for usage. Complements NestJS architecture in enforcing authorization policies.                                               |
| [index.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/index.ts)                                 | Exports RoleGuard, IsCreatorGuard, and AccessTokenGuard for role-based, creator authentication, and access token validation within the NestJS applications security layer in the `src/security/guards` directory.                                                 |
| [role.guard.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/role.guard.spec.ts)             | Tests `RoleGuard` role access control based on user role permissions. Utilizes `Reflector` to override roles. Validates allowing/denying access for different user roles. Contributes to ensuring secure role-based authorization within the apps security layer. |
| [role.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/role.guard.ts)                       | Enables role-based route access in the NestJS architecture by checking users role against required role. Retrieves metadata using a reflector for role validation.                                                                                                |
| [is-creator.guard.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/is-creator.guard.spec.ts) | Verifies user as content creator. Tests guard behavior in NestJS app. Guards access to content based on user ID. Handles scenarios where user is or isnt creator. Crucial for enforcing content access control.                                                   |
| [access-token.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/access-token.guard.ts)       | Enforces JWT access token validation for safeguarding routes in the repositorys architecture.Extends AuthGuard(jwt') for securing protected routes.                                                                                                               |

</details>

<details closed><summary>src.security.cookie</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                   |
| ---                                                                                                                      | ---                                                                                                                                                                                       |
| [cookie.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/cookie/cookie.service.spec.ts) | Extracts refresh token, sets cookie securely with expiration, and throws error if misconfigured. Essential for testing and ensuring secure cookie handling within the NestJS application. |
| [cookie.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/cookie/cookie.service.ts)           | Manages refresh token cookies for secure authentication flows in NestJS, handling extraction, setting, and clearing actions based on configuration settings and HTTP requests.            |

</details>

<details closed><summary>src.security.token</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                                  |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                                      |
| [token-management.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token-management.service.spec.ts)     | Implements token creation and verification using JWT in the security module. Manages access and refresh tokens with customized expiration periods. Validates payloads based on user roles and secret keys stored in configuration.                                       |
| [token.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token.service.ts)                                     | Manages JWT tokens, creates, refreshes, and validates tokens for user authentication. Implements refresh token storage in Redis and error handling. Services include user management, token generation, and token verification.                                          |
| [refreshtoken-store.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/refreshtoken-store.service.spec.ts) | Implements tests for storing, verifying, and removing refresh tokens in Redis. Validates functionality with jest mocks for services. Enhances reliability and security of refresh token management in the project architecture.                                          |
| [refreshtoken-store.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/refreshtoken-store.service.ts)           | Manages refresh tokens in Redis, storing them with a TTL, verifying their validity, and removing them. Implements essential services to interact with Redis, convert values, and access configuration variables within the NestJS architecture.                          |
| [token-management.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token-management.service.ts)               | Manages JWT tokens creation and verification for authentication purposes in the repositorys security module. Implements functions to generate access and refresh tokens, plus validate token authenticity using secret keys and expiration settings from configurations. |
| [token.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token.service.spec.ts)                           | Tests service methods for token creation, refresh, and validation. Verifies token generation, user authentication, token storage, and error handling. Crucial for security and user session management within the repositorys architecture.                              |

</details>

<details closed><summary>src.security.throttler</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                   |
| ---                                                                                                                   | ---                                                                                                                                                                                                                       |
| [throttler.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/throttler/throttler.module.ts) | Enables request rate limiting using ThrottlerModule in NestJS, ensuring API stability by restricting requests to 10 per minute. Integrated within the security module for effective rate limiting across the application. |

</details>

<details closed><summary>src.security.auth</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                                                         |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                                                             |
| [auth.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.controller.ts)           | Manages user authentication operations like registration, login, password updates, token generation, and user deletion. Utilizes various DTOs, guards, services, and decorators to secure and control user access in the application.                                           |
| [auth.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.controller.spec.ts) | Tests AuthController methods for user authentication and authorization.Mocks AuthService and TokenService dependencies to ensure correct parameter handling and method calls.Validates controller functions for user signup, login, update password, refresh token, and logout. |
| [auth.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.service.spec.ts)       | Implements authentication services for user sign-up, login, password update, and logout. Tests user actions like signing up, logging in, changing passwords, and logging out with error handling. Uses repositories, encryption, tokens, cookies, and a shopping cart service.  |
| [auth.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.service.ts)                 | Manages user authentication, registrations, logins, password updates, logouts, and deletions within the Nest-jo repository, facilitating secure user interactions with encrypted passwords, tokens, cookies, and role-based access control.                                     |
| [auth.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.module.ts)                   | Manages authentication by providing services for user authorization and token handling. Integrates with User entity from TypeORM, CartsModule, and CommonModule to secure user access within the NestJS application architecture.                                               |

</details>

<details closed><summary>src.security.auth.dto</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                   |
| ---                                                                                                                        | ---                                                                                                                                                                                                                       |
| [signup.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/signup.dto.ts)                   | FirstName, lastName (optional strings), email (required valid email), password (required strong, min 6 chars), role (optional enum UserRole). Supports maintaining data integrity and security in the nest-jo repository. |
| [login.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/login.dto.ts)                     | Defines a DTO for user login, ensuring email is valid and not empty, and password is not empty. This DTO enhances user authentication security within the NestJS project structure.                                       |
| [refresh-token.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/refresh-token.dto.ts)     | Defines a RefreshTokenDto class ensuring the required nature of the refreshToken field using class-validator. This DTO aids in securely refreshing tokens within the nest-jo repositorys security architecture.           |
| [update-password.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/update-password.dto.ts) | Defines DTO for updating users password with validation rules. Promotes secure password management in the apps security module.                                                                                           |

</details>

<details closed><summary>src.security.auth.strategies</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                           |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                               |
| [access-token.strategy.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/strategies/access-token.strategy.spec.ts) | Tests `AccessTokenStrategy` behavior for validating JWT payload against user entity in `User` repository. Uses Jest mocks for successful user retrieval and unauthorized exceptions. Key dependency injection with `ConfigService` and `TypeORM`.                 |
| [access-token.strategy.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/strategies/access-token.strategy.ts)           | Validates access tokens securely by verifying user identity from JWT payload. Enhances application security with JWT authorization and user verification against stored data. Key features include JWT extraction, secret key configuration, and user validation. |

</details>

<details closed><summary>test</summary>

| File                                                                                        | Summary                                                                                                                                                                                             |
| ---                                                                                         | ---                                                                                                                                                                                                 |
| [app.e2e-spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/test/app.e2e-spec.ts) | Tests NestJS apps HTTP GET request response of / route with'Hello World! text. Integrates AppModule to test INestApplication using @nestjs/testing and supertest.                                   |
| [jest-e2e.json](https://github.com/Binary-Blade/nest-jo/blob/master/test/jest-e2e.json)     | Defines Jest configuration for end-to-end tests in the NestJS project. Sets module file extensions, test environment, regex for test file selection, and transforms TypeScript files using ts-jest. |

</details>

---

##  Getting Started

**System Requirements:**

* **TypeScript**: `version x.y.z`

###  Installation

<h4>From <code>source</code></h4>

> 1. Clone the nest-jo repository:
>
> ```console
> $ git clone https://github.com/Binary-Blade/nest-jo
> ```
>
> 2. Change to the project directory:
> ```console
> $ cd nest-jo
> ```
>
> 3. Install the dependencies:
> ```console
> $ npm install
> ```

###  Usage

<h4>From <code>source</code></h4>

> Run nest-jo using the command below:
> ```console
> $ npm run build && node dist/main.js
> ```

###  Tests

> Run the test suite using the command below:
> ```console
> $ npm test
> ```

---

##  Project Roadmap

- [X] `► INSERT-TASK-1`
- [ ] `► INSERT-TASK-2`
- [ ] `► ...`

---

##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Report Issues](https://github.com/Binary-Blade/nest-jo/issues)**: Submit bugs found or log feature requests for the `nest-jo` project.
- **[Submit Pull Requests](https://github.com/Binary-Blade/nest-jo/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Binary-Blade/nest-jo/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Binary-Blade/nest-jo
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="center">
   <a href="https://github.com{/Binary-Blade/nest-jo/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Binary-Blade/nest-jo">
   </a>
</p>
</details>

---

##  License

This project is protected under the [SELECT-A-LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---

##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

[**Return**](#-overview)

---
