<p align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">NEST-JO</h1>
</p>
<p align="center">
    <em>Streamlining Development and Orchestration!</em>
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

Nest-JO is a comprehensive open-source project built with NestJS that offers a robust and efficient solution for orchestrating Docker deployments within a NestJS project structure. The projects core functionalities revolve around optimizing the TypeScript build, defining Docker services for NestJS, PostgreSQL, and Redis in both development and production environments, and streamlining the deployment workflow. With detailed configuration files such as tsconfig.build.json, docker-compose.yml, docker-compose.override.yml, Dockerfile, nest-cli.json, and docker-compose.prod.yml, Nest-JO ensures seamless network connections, data storage management, and orchestrated deployment processes. By utilizing these components, Nest-JO provides developers with a valuable toolset to enhance project maintenance, configuration setup, and overall development efficiency.

---

##  Features

|    |   Feature         | Description |
|----|-------------------|---------------------------------------------------------------|
| ⚙️  | **Architecture**  | Nest-JO project follows a modular and scalable architecture using NestJS framework. It utilizes Docker for containerization and services are defined in docker-compose files for easy deployment. |
| 🔩 | **Code Quality**  | The codebase maintains good quality with TypeScript, linting rules, and formatting with Prettier. Consistent coding style is ensured using ESLint.|
| 📄 | **Documentation** | Extensive documentation with project setup instructions, API endpoints, and architecture overview. API endpoints are documented using Swagger. |
| 🔌 | **Integrations**  | Integrates various dependencies like TypeORM for database operations, Passport for authentication, and Redis for cache management. External libraries enhance functionality such as Qrcode generation. |
| 🧩 | **Modularity**    | Highly modular codebase with components, services, and controllers organized logically for easy maintenance and reusability. Dependency Injection pattern is followed for loose coupling. |
| 🧪 | **Testing**       | Testing frameworks like Jest and Supertest are used for unit and integration testing. Tests are written for ensuring code reliability and functionality. |
| ⚡️  | **Performance**   | Efficient resource usage with optimized TypeScript build configuration. NestJS architecture ensures high performance and speed in handling requests. |
| 🛡️ | **Security**      | Security measures include the use of Passport for JWT authentication, Argon2 for password hashing, and Helmet middleware for setting security-related HTTP headers. |
| 📦 | **Dependencies**  | Key dependencies include TypeORM for ORM, NestJS packages for building APIs, Passport for authentication strategies, and Redis for caching. |
| 🚀 | **Scalability**   | Scalable design with NestJS architecture supporting horizontal scaling. Services in docker-compose can be easily scaled up with additional instances. Database and cache are managed for scalability. |

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

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                  |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                      |
| [tsconfig.build.json](https://github.com/Binary-Blade/nest-jo/blob/master/tsconfig.build.json)                 | Optimize TypeScript build by excluding unnecessary files for compilation in the repositorys architecture.                                                                                                                                                                                                |
| [docker-compose.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.yml)                   | Defines services for NestJS server, PostgreSQL database, and Redis cache in the Docker Compose file. Establishes network connections and persistent volumes for data storage. Facilitates orchestrated deployment within the NestJS project structure.                                                   |
| [docker-compose.override.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.override.yml) | Defines development Docker services for NEST-JO project. It configures server, PostgreSQL, and Redis containers with environment variables for local development. Ports, images, and commands are specified for seamless deployment and testing.                                                         |
| [Dockerfile](https://github.com/Binary-Blade/nest-jo/blob/master/Dockerfile)                                   | Orchestrates multiple build stages to create a production-ready image for the NestJS application. Utilizes pnpm for dependency management and separates build and production environments. Sets up the node user and defines the entry point for the container.                                          |
| [nest-cli.json](https://github.com/Binary-Blade/nest-jo/blob/master/nest-cli.json)                             | Defines source root and compiler options for the NestJS schematics collection. Enables deleting the output directory to streamline project maintenance and configuration setup. Essential for organizing and optimizing the development workflow in the repository architecture.                         |
| [docker-compose.prod.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.prod.yml)         | Defines Docker services for a production setup of the NestJS app, Postgres, and Redis. Configures environment variables, container settings, volumes, and network for each service. Promotes scalability and reliability of the application through containerization.                                    |
| [tsconfig.json](https://github.com/Binary-Blade/nest-jo/blob/master/tsconfig.json)                             | Enables TypeScript path mapping for the repositorys modular structure, facilitating cleaner imports and project organization by defining aliases to key directories like common, modules, security, database, libs, and utils.                                                                           |
| [package.json](https://github.com/Binary-Blade/nest-jo/blob/master/package.json)                               | Orchestrates project build, linting, testing, and migrations. Implements runtime and development server control with various modes. Manages the applications code and structure based on defined scripts and dependencies listed in the package.json file.                                               |
| [Makefile](https://github.com/Binary-Blade/nest-jo/blob/master/Makefile)                                       | Facilitates creating, running, and reverting database migrations. Executes unit and end-to-end tests. Connects to Redis CLI. Manages Docker containers for development and production environments. Key commands include `migrate-create`, `migrate-run`, `test`, `e2e`, `redis-cli`, `dev`, and `prod`. |

</details>

<details closed><summary>src</summary>

| File                                                                                   | Summary                                                                                                                                                                                                                                                                                                       |
| ---                                                                                    | ---                                                                                                                                                                                                                                                                                                           |
| [main.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/main.ts)             | Initializes the NestJS application with custom logging and CORS settings from the configuration service. Runs database migrations, applies global pipes, filters, and interceptors, and listens on a specified port. Logs the environment mode based on settings.                                             |
| [type.d.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/type.d.ts)         | Extends Express Request interface to hold User data, enabling recognition of attached user objects in TypeScript.                                                                                                                                                                                             |
| [app.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/app.module.ts) | Defines the applications core module structure by importing various modules for essential functionalities like configuration, databases, authentication, user management, event handling, and more. Orchestrates the integration of these modules to build a robust and comprehensive application foundation. |

</details>

<details closed><summary>src.libs.payment</summary>

| File                                                                                                                    | Summary                                                                                                                                                                                                                                                               |
| ---                                                                                                                     | ---                                                                                                                                                                                                                                                                   |
| [payment.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.module.ts)             | Defines payment functionality for the application by orchestrating data imports, and communication between user, reservations, transactions, and ticket modules. Integrates ORM for user entity and exports payment service for module interaction within the system. |
| [payment.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.service.spec.ts) | Tests the `processPayment` method in `PaymentService` to ensure correct handling of payment scenarios based on cart total. Validates approval, rejection, and failure outcomes using predefined success and pending rates.                                            |
| [payment.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.service.ts)           | Handles payment processing with a configurable success rate. Proactively determines payment approval based on cart total. Ensures secure and efficient payment interactions within the repositorys architecture.                                                      |

</details>

<details closed><summary>src.common.enums</summary>

| File                                                                                                                          | Summary                                                                                                                                                                                               |
| ---                                                                                                                           | ---                                                                                                                                                                                                   |
| [sort-order.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/sort-order.enum.ts)                 | ASC and DESC. Crucial for consistent sorting in the repositorys architecture.                                                                                                                         |
| [user-role.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/user-role.enum.ts)                   | Defines user roles as an enum with USER and ADMIN roles. This file's critical feature is providing a structured way to manage different user roles within the Nest-jo repository's architecture.      |
| [status-reservation.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/status-reservation.enum.ts) | APPROVED and REJECTED. Enhances clarity and consistency across modules in the repository's architecture.                                                                                              |
| [category-type.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/category-type.enum.ts)           | Defines event categories for the Olympics using an enum. Categorizes sports like Archery, Athletics, and more. Enhances code readability and maintainability in the Nest-jo repositorys architecture. |
| [price-formula.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/price-formula.enum.ts)           | Defines pricing formula enums for solo, duo, and family scenarios within the repositorys common structure. Allows consistent usage and reference of pricing formulas throughout the project.          |

</details>

<details closed><summary>src.common.decorators</summary>

| File                                                                                                                   | Summary                                                                                                                                                                 |
| ---                                                                                                                    | ---                                                                                                                                                                     |
| [user-id.decorator.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/decorators/user-id.decorator.ts) | Extracts user ID from request object via custom decorator for easy usage in route handlers within the NestJS open-source projects common module.                        |
| [role.decorator.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/decorators/role.decorator.ts)       | Defines route handler role access based on specified user roles for authorization within the NestJS architecture. Integrates with `RoleGuard` to manage access control. |

</details>

<details closed><summary>src.common.exceptions</summary>

| File                                                                                                                                           | Summary                                                                                                                                                                                                                                          |
| ---                                                                                                                                            | ---                                                                                                                                                                                                                                              |
| [invalid-credentials.exception.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/exceptions/invalid-credentials.exception.ts) | Defines custom exception `InvalidCredentialsException` for unauthorized login attempts in a NestJS project. Maintains clear separation of concerns within the repositorys architecture by encapsulating and signaling invalid credential errors. |

</details>

<details closed><summary>src.common.globals-filter</summary>

| File                                                                                                                                           | Summary                                                                                                                                                                                                                                                                                    |
| ---                                                                                                                                            | ---                                                                                                                                                                                                                                                                                        |
| [http-exceptions-filter.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/globals-filter/http-exceptions-filter.spec.ts) | Implements error handling and logging based on environment for HTTP exceptions. Parses and formats error responses dynamically. Enriches logs with detailed exception data. Enhances user experience by providing tailored error messages in both development and production environments. |
| [http-exceptions-filter.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/globals-filter/http-exceptions-filter.ts)           | Handles and customizes HTTP exceptions by providing detailed error messages and additional debugging information, as per the applications environment.                                                                                                                                     |

</details>

<details closed><summary>src.common.dto</summary>

| File                                                                                                      | Summary                                                                                                                                                                                                                                                                             |
| ---                                                                                                       | ---                                                                                                                                                                                                                                                                                 |
| [pagination.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/dto/pagination.dto.ts) | Defines pagination and filtering options for data retrieval, ensuring robust input validation. Supports setting limits, offsets, sorting, filtering by field and value. Enhances maintainability and readability of data manipulation processes within the repository architecture. |
| [id.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/dto/id.dto.ts)                 | Validates and sanitizes ID inputs for the repositorys API endpoints by ensuring they are positive integers. Located in the src/common/dto' directory, this IdDto class utilizes class-validator for data integrity.                                                                 |

</details>

<details closed><summary>src.common.interfaces</summary>

| File                                                                                                                                   | Summary                                                                                                                                                                                                                              |
| ---                                                                                                                                    | ---                                                                                                                                                                                                                                  |
| [token.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/token.interface.ts)                     | Defines token configuration structure for access and refresh tokens, including secret keys and expiration times. Enforces consistent token handling and settings across the Nest.js repositorys authentication and security modules. |
| [payment.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/payment.interface.ts)                 | Defines payment result and process structures for reservation system, enhancing payment handling. It integrates with reservation entities, ensuring smooth payment processing and status updates.                                    |
| [key-value-redis.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/key-value-redis.interface.ts) | Defines a structure for key-value pairs with flexibility in data types. Essential for handling various types of data in the Redis interface within the repositorys architecture.                                                     |
| [payload.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/payload.interface.ts)                 | Defines JWT payload interface with user ID, role, and token version in the common module to enforce consistent token structure across the application.                                                                               |
| [jwt.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/jwt.interface.ts)                         | Defines interfaces for JWT payload and tokens with sub, role, version, accessToken, refreshToken, and optional expiresIn fields. Crucial for managing authentication and authorization within the NestJS projects security layer.    |

</details>

<details closed><summary>src.common.logger</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                                                                                        |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                                                            |
| [winston.config.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/logger/winston.config.ts)   | Defines logging levels and formats, configures Winston logger with file transports, and adds console transport for non-production environments. Achieves centralized logging configuration for the parent repositorys services to maintain consistency and facilitate debugging across different environments. |
| [winston.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/logger/winston.service.ts) | Enables logging with Winston in the NestJS app. Implements various log levels like info, error, warn, debug, and verbose. The service interacts with the winston.config for logging setup.                                                                                                                     |

</details>

<details closed><summary>src.modules</summary>

| File                                                                                                 | Summary                                                                                                                                                                                                                               |
| ---                                                                                                  | ---                                                                                                                                                                                                                                   |
| [commom.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/commom.module.ts) | Defines a global module with common services. Imports and exports essential services like user management, encryption, payment processing, and Redis operations. Facilitates sharing critical functionalities across the application. |

</details>

<details closed><summary>src.modules.reservation-details</summary>

| File                                                                                                                                                           | Summary                                                                                                                                                                                                                                                      |
| ---                                                                                                                                                            | ---                                                                                                                                                                                                                                                          |
| [reservation-details.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.module.ts)             | Defines ReservationDetailsModule with TypeORM entities Event and ReservationDetails. Imports CartItemsModule and EventsModule. Registers ReservationDetailsService as a provider. Manages reservation details in the NestJS projects layered architecture.   |
| [reservation-details.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.service.ts)           | Manages reservation details by creating details from a reservation and cart item, ensuring event existence. It provides functionality to find a reservation detail by ID, handling exceptions if not found.                                                  |
| [reservation-details.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.service.spec.ts) | Implements service to create and retrieve reservation details, verifying event existence and handling exceptions. Interacts with repositories for ReservationDetails and Event entities, ensuring seamless data manipulation within the NestJS architecture. |

</details>

<details closed><summary>src.modules.reservation-details.entities</summary>

| File                                                                                                                                                        | Summary                                                                                                                                                                                                               |
| ---                                                                                                                                                         | ---                                                                                                                                                                                                                   |
| [reservation-details.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/entities/reservation-details.entity.ts) | Defines ReservationDetails entity with associations to Reservation and Event, storing pricing, title, and timestamps. Maintains relations between different modules, enhancing the parent repositorys data structure. |

</details>

<details closed><summary>src.modules.reservation-details.dto</summary>

| File                                                                                                                                                           | Summary                                                                                                                                                                                                                                       |
| ---                                                                                                                                                            | ---                                                                                                                                                                                                                                           |
| [create-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/dto/create-reservation-details.dto.ts) | Defines DTO for reservation details with validation rules, ensuring accurate creation. Matches parent repositorys architecture by organizing under modules. Facilitates error-free reservation data input, adhering to specified constraints. |
| [update-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/dto/update-reservation-details.dto.ts) | Enhances UpdateReservationDetailsDto by extending CreateReservationDetailsDto with optional properties, supporting dynamic reservation details updates.                                                                                       |

</details>

<details closed><summary>src.modules.users</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                         |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                             |
| [users.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.controller.spec.ts) | Find all users with pagination, return all user values, get a single user by ID, update user details, and deactivate a user. Verifies service interactions and error handling for various scenarios in the context of user management.                          |
| [users.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.module.ts)                   | Defines a module to manage users and their transactions, importing necessary components such as TypeORM entities and user-related services. Registrations include UsersController, UsersService, QueryHelperService, and AccessTokenStrategy.                   |
| [users.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.service.ts)                 | Manages user data in the NestJS application. Retrieves, updates, and deactivates users with error handling. Utilizes repositories and query services for efficient user operations.                                                                             |
| [users.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.service.spec.ts)       | Implements user-related services for user management, including finding, updating, and removing users. Validates user details and handles errors like user not found.                                                                                           |
| [users.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.controller.ts)           | Manages user data access and modification, enforcing role-based and creator-specific permissions. Implements CRUD functionality for admin and individual users. Key features include pagination, user retrieval by ID, updating user details, and deactivation. |

</details>

<details closed><summary>src.modules.users.entities</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                                                                      |
| ---                                                                                                             | ---                                                                                                                                                                                                                                                                                          |
| [user.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/entities/user.entity.ts) | Defines user entity with properties like email, name, role, and timestamps for a NestJS e-commerce application. Establishes relationships with a shopping cart, reservations, and transactions. Increments transactions count and tracks total spent while maintaining user activity status. |

</details>

<details closed><summary>src.modules.users.dto</summary>

| File                                                                                                               | Summary                                                                                                                                                                                                                             |
| ---                                                                                                                | ---                                                                                                                                                                                                                                 |
| [update-user.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/update-user.dto.ts) | Defines DTO for updating a user by extending the properties of creating a user with optional fields.                                                                                                                                |
| [index.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/index.ts)                     | Exports user data transfer objects for creating and updating users in the NestJS project. It centralizes DTO handling for user-related operations within the repositorys modular architecture.                                      |
| [create-user.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/create-user.dto.ts) | Defines a data structure for creating users with specified fields and validation rules. Maps user details like first name, last name, email, password, and role to ensure data integrity within the users module of the repository. |

</details>

<details closed><summary>src.modules.cart-items</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                            |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                                |
| [cart-items.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.module.ts)                   | Defines a module for managing cart items in the Nest.js repository. Imports entities and services, links with related modules, and exports the CartItemsService for use in other parts of the application.                                                         |
| [cart-items.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.service.ts)                 | Manages cart items in a shopping app by handling addition, retrieval, updating, and removal operations. It ensures item availability, calculates prices, and interacts with related entities like carts and events.                                                |
| [cart-items.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.controller.ts)           | Manages cart items by facilitating item addition, retrieval, update, and removal within specific user carts. Utilizes DTOs for data manipulation and guards access with an AccessTokenGuard for security.                                                          |
| [cart-items.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.service.spec.ts)       | Adding, finding, updating, and removing items from a cart. Ensure cart item existence and availability while managing quantities and prices using cart and event repositories.                                                                                     |
| [cart-items.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.controller.spec.ts) | Implements cart item CRUD operations securely & efficiently using PriceFormulaEnum for pricing. Handles adding, retrieving, updating, and removing items from the cart, throwing specific exceptions for scenarios like non-existing items or unauthorized access. |

</details>

<details closed><summary>src.modules.cart-items.entities</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                         |
| ---                                                                                                                            | ---                                                                                                                                                                                                                             |
| [cartitems.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/entities/cartitems.entity.ts) | Defines a data model for shopping cart items linking to carts, events, and reservations. Tracks pricing, quantity, and timestamps. Supports the parent repositorys e-commerce architecture for managing cart items efficiently. |

</details>

<details closed><summary>src.modules.cart-items.dto</summary>

| File                                                                                                                              | Summary                                                                                                                                                                                                                  |
| ---                                                                                                                               | ---                                                                                                                                                                                                                      |
| [create-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/dto/create-cart-item.dto.ts) | Defines a data transfer object for cart item creation. Validates user ID (optional), event ID, quantity, and price formula using class-validator. Integrates with the parent repositorys cart items module architecture. |
| [update-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/dto/update-cart-item.dto.ts) | Enriches cart item data transfer object with optional properties, ensuring flexibility for updating cart items seamlessly within the repositorys modular architecture.                                                   |

</details>

<details closed><summary>src.modules.reservations</summary>

| File                                                                                                                                                          | Summary                                                                                                                                                                                                                                                                                       |
| ---                                                                                                                                                           | ---                                                                                                                                                                                                                                                                                           |
| [reservations-processor.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations-processor.service.spec.ts) | Verifies users, processes payments, creates reservations, and finalizes bookings. Manages cart items, transactions, users, and reservations within the NestJS architecture.                                                                                                                   |
| [reservations.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.controller.spec.ts)               | Implements tests for Reservation Controller with actions like create, find all, and find one, ensuring proper reservation handling with different user roles.                                                                                                                                 |
| [reservations.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.service.spec.ts)                     | Tests `ReservationsService` interactions in `src/modules/reservations`. Ensures accurate reservation generation, retrieval, saving. Facilitates admin access with filtering capabilities. Invalid cases trigger exceptions for robust error handling in the repository.                       |
| [reservations-processor.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations-processor.service.ts)           | Processes user reservations, handling cart operations, payments, and finalizing bookings. Manages reservation creation for cart items, prevents duplicates, and cleans up post-payment. Integrates with various services for a comprehensive booking system.                                  |
| [reservations.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.service.ts)                               | Manages reservations, including generating, retrieving, finding, saving, and listing with query options. Provides functionalities for users and admin views. Follows a defined structure within the Nest.js repository for efficient reservation handling.                                    |
| [reservations.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.module.ts)                                 | Defines a module managing reservations, handling database entities and inter-module dependencies. Registers controllers, services, and providers while exporting key services for broader application use.                                                                                    |
| [reservations.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.controller.ts)                         | Manages reservations for users by creating, retrieving, and listing them based on user roles. Provides endpoints for user and admin actions with pagination and filtering. Introduces necessary guards and decorators for security and role-based access control in the Nest.js architecture. |

</details>

<details closed><summary>src.modules.reservations.entities</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                        |
| ---                                                                                                                                  | ---                                                                                                                                                                                                            |
| [reservation.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/entities/reservation.entity.ts) | Defines Reservation entity linking User, ReservationDetails, Transaction, CartItem, and Ticket. Manages reservation info with timestamps. Supports relational mapping in the repositorys modular architecture. |

</details>

<details closed><summary>src.modules.reservations.dto</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                 |
| ---                                                                                                                                     | ---                                                                                                                                                                     |
| [create-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/dto/create-reservation.dto.ts) | Defines DTO for reservation creation with validated user, cart item ID, total price, and payment ID. Enhances reliability and data integrity in the reservation module. |
| [update-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/dto/update-reservation.dto.ts) | Defines an update reservation DTO by extending the create reservation DTO with optional properties.                                                                     |

</details>

<details closed><summary>src.modules.events</summary>

| File                                                                                                                                | Summary                                                                                                                                                                                                                                                                                                         |
| ---                                                                                                                                 | ---                                                                                                                                                                                                                                                                                                             |
| [events.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.controller.ts)                 | Manages event creation, retrieval, update, and deletion with access control. Handles price calculations, event filtering, and value retrieval. Key features include admin-exclusive operations, security guards, and data manipulation through service methods.                                                 |
| [event-prices.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-prices.service.ts)           | Creates prices from base price, retrieves prices by formula, updates prices with new base price, and deletes all prices related to an event. Ensures events exist before price operations.                                                                                                                      |
| [events.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.service.spec.ts)             | Implements event creation, retrieval, update, and deletion with necessary validations and operations, such as fetching from cache, error handling, and database interaction. Manages event data using NestJS, TypeORM, Redis, and utilities for efficient event management within the repositorys architecture. |
| [events.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.service.ts)                       | Manages events creation, retrieval, update, and deletion with caching and validation. Filters events with pagination and handles uniqueness constraints, maintaining data integrity and performance in the repositorys event-centric architecture.                                                              |
| [events.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.module.ts)                         | Defines and structures an events module handling event entities, prices, and sales in NestJS using TypeORM. It registers controllers, services, and providers for managing event-related operations within the applications architecture.                                                                       |
| [event-sales.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-sales.service.ts)             | Manages event sales revenue by processing cart items, deducting ticket quantities, and updating event revenue. Facilitates efficient revenue tracking and ticket management within the parent repositorys event module.                                                                                         |
| [events.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.controller.spec.ts)       | Validates, creates, updates, finds, and removes events in the application. Uses services for event operations and DTOs for data transfer. Tests controller functionality in event handling with various scenarios.                                                                                              |
| [event-sales.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-sales.service.spec.ts)   | Tests service methods to manage event ticket sales. Mocks data handling and revenue updates. Validates ticket availability and triggers exceptions as needed. Key for ensuring accurate event ticketing within the repositorys broader architecture.                                                            |
| [event-prices.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-prices.service.spec.ts) | Implements CRUD operations for event prices. Manages creating, updating, retrieving, and deleting prices for events with various price formulas. Ensures valid event checks and handling of not found exceptions for events and prices.                                                                         |

</details>

<details closed><summary>src.modules.events.entities</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                |
| ---                                                                                                                            | ---                                                                                                                                                                                                                    |
| [event-price.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/entities/event-price.entity.ts) | Defines event price entity with relationships and properties for pricing details. Central to managing event pricing within the architecture, connecting events and price formulas.                                     |
| [event.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/entities/event.entity.ts)             | Defines Event entity with title, descriptions, pricing, dates, quantities, revenues, associated entities, and timestamps. Manages event details and relationships within the Nest-jo repositorys modular architecture. |

</details>

<details closed><summary>src.modules.events.dto</summary>

| File                                                                                                                  | Summary                                                                                                                                                                        |
| ---                                                                                                                   | ---                                                                                                                                                                            |
| [update-event.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/dto/update-event.dto.ts) | Defines `UpdateEventDto` class extending `PartialType(CreateEventDto)` for event updates, enhancing readability and maintainability in the repositorys event module structure. |
| [create-event.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/dto/create-event.dto.ts) | Title, descriptions, prices, quantity, dates, and category type. Enforces data integrity and consistency for event inputs.                                                     |

</details>

<details closed><summary>src.modules.tickets</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                                |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                    |
| [tickets.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.service.ts)           | Manages ticket generation for approved reservations by creating new tickets with encrypted details, ensuring user and reservation integrity.                                                                                                                           |
| [tickets.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.module.ts)             | Implements a module for ticket management within the Nest-JO repository. Handles ticket creation, importing related modules, and resolving circular dependencies. Key features include Ticket service providers, TypeORM module integration, and cross-module exports. |
| [tickets.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.service.spec.ts) | Implements ticket generation logic for approved reservations.-Validates reservations and users.-Creates new tickets with secure keys and QR codes.-Ensures data integrity and exception handling.                                                                      |

</details>

<details closed><summary>src.modules.tickets.entities</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                      |
| ---                                                                                                                   | ---                                                                                                                                                                                          |
| [ticket.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/entities/ticket.entity.ts) | Defines Ticket entity relationships with Reservation for a Nest.js application. Handles ticket information like purchaseKey, secureKey, and qrCode. Central to managing ticket reservations. |

</details>

<details closed><summary>src.modules.transactions</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                                                                                                                   |
| [transactions.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.controller.spec.ts) | Tests the `TransactionsController` to ensure it returns user transactions correctly.Mocks service responses and verifies expected outcomes.                                                                                                                                                                                                           |
| [transactions.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.module.ts)                   | Defines a module for managing transactions by importing TypeORM entities Transaction, Event, ReservationDetails, and User. Utilizes forward referencing for ReservationsModule and TicketsModule. Registers TransactionsService, ReservationDetailsService, QueryHelperService, and TransactionsController as providers. Exports TransactionsService. |
| [transactions.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.service.ts)                 | Manages transactions within the repositorys architecture, creating, finding, and retrieving transactions with user-specific filtering. Calculates total cart amounts. Implements structured data selection. Aids in secure and efficient transaction processing.                                                                                      |
| [transactions.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.service.spec.ts)       | Tests `createTransaction`, `findTransactionByReservationId`, `calculateCartTotal`, and `findAll` in TransactionsService ensure successful transaction creation, retrieval, cart total calculation, and error handling, respectively. This service interacts with repositories and helper services for managing user transactions effectively.         |
| [transactions.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.controller.ts)           | Manages user transactions with pagination and filtering capabilities. Utilizes access token security. Supports retrieval of filtered transactions and total count for a specified user ID.                                                                                                                                                            |

</details>

<details closed><summary>src.modules.transactions.entities</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                                   |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                                       |
| [transaction.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/entities/transaction.entity.ts) | Defines transaction entity structure with user association, reservations, payment status, identifier, total amount, creation & update timestamps. Enhances repositorys modular architecture for handling transactional data within a Nest.js application. |

</details>

<details closed><summary>src.modules.transactions.dto</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                |
| ---                                                                                                                                     | ---                                                                                                                                                                    |
| [create-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/dto/create-transaction.dto.ts) | Defines data structure for creating transactions within the transactions module. Key element integrating transaction functionality into the repository's architecture. |
| [update-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/dto/update-transaction.dto.ts) | Extends `CreateTransactionDto` for partial updates-Enhances `@nestjs/swagger` with Swagger API docs                                                                    |

</details>

<details closed><summary>src.modules.carts</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                                                                            |
| ---                                                                                                                  | ---                                                                                                                                                                                                                                                                |
| [carts.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.service.ts)           | Finds, creates, verifies, saves, and deletes carts in a Nest.js project. Handles cart operations efficiently, ensuring data integrity and user satisfaction.                                                                                                       |
| [carts.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.service.spec.ts) | Implements cart-related operations ensuring cart existence, verification, creation, and deletion, maintaining cart data integrity. Uses TypeORM for database interaction. Aligns with the repositorys modular architecture for scalable and maintainable codebase. |
| [carts.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.module.ts)             | Defines a module managing carts in the Nest-JO repository. Imports TypeOrmModule for Cart entity, provides CartsService as a provider, and exports CartsService for use in other modules.                                                                          |

</details>

<details closed><summary>src.modules.carts.entities</summary>

| File                                                                                                            | Summary                                                                                                                                                                                            |
| ---                                                                                                             | ---                                                                                                                                                                                                |
| [cart.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/entities/cart.entity.ts) | Define shopping cart structure with user association and item details for NestJS e-commerce app. Utilizes TypeORM to manage cart entity, user linkage, cart items, and creation/update timestamps. |

</details>

<details closed><summary>src.database</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                                                                              |
| ---                                                                                                             | ---                                                                                                                                                                                                                                                                                                  |
| [typeorm-cli.config.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/typeorm-cli.config.ts) | Defines TypeORM configuration for PostgreSQL data source. Retrieves database connection details from environment variables. Specifies database connection settings like host, port, username, password, and database name. Sets entity and migration file paths for database schema synchronization. |
| [migration-runner.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migration-runner.ts)     | Executes database migrations using TypeORM. Logs actions, initializes datasource, and runs migrations. Handles failures gracefully by exiting with error status. Vital for ensuring database schema consistency in the nest-jo repository architecture.                                              |
| [database.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/database.module.ts)       | Establishes database connectivity with TypeORM using dynamic environment-based configuration for a PostgreSQL database. Enables seamless integration through async setup, ensuring secure and adaptable connections.                                                                                 |

</details>

<details closed><summary>src.database.redis</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                           |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                               |
| [redis.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.service.ts)           | Handles Redis caching in the repository by storing, retrieving, and deleting data using a reliable Redis client. It also includes methods to fetch and cache data from a source while ensuring safe JSON parsing and event-based cache clearance. |
| [redis.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.module.ts)             | Establishes and configures Redis client and service by leveraging environment variables. Allows access to Redis functionalities across the application.                                                                                           |
| [redis.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.service.spec.ts) | Tests Redis interactions ensuring set, get, and delete operations function correctly, handling edge cases and errors. Implements caching with TTL support and safe JSON parsing for efficient data storage and retrieval.                         |

</details>

<details closed><summary>src.database.migrations</summary>

| File                                                                                                                                                                         | Summary                                                                                                                                                                                                                                                                                                       |
| ---                                                                                                                                                                          | ---                                                                                                                                                                                                                                                                                                           |
| [1712751776641-CreateTableReservationDetails.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712751776641-CreateTableReservationDetails.ts) | Defines a database migration to create a reservation_details table, managing detailed reservation info with event references and pricing details. Ensures table and enum type existence before creation or deletion using TypeORM.                                                                            |
| [1712661230450-CreateTableCartItems.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230450-CreateTableCartItems.ts)                   | Creates cart_items table to store cart item details, including pricing data and references. Safely handles table creation and enum type existence checks. Reversible migration for managing cart items in the app's database schema.                                                                          |
| [1712661230451-CreateTableReservations.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230451-CreateTableReservations.ts)             | Defines migration to create reservations table in the database. Adds columns for user, cart item, transaction, details, and ticket references. Executes up method to create table if not existed; down method drops table if present.                                                                         |
| [1712717719010-CreateTableTickets.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712717719010-CreateTableTickets.ts)                       | Creates ticket table with reservation and security details. Manages ticket data storage and relations within the apps database schema. Handles table creation if it doesnt exist and table removal during migration.                                                                                          |
| [1712572717258-CreateTableEvents.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712572717258-CreateTableEvents.ts)                         | Creates events table schema in the database with columns for event details. Ensures category_type_enum exists. Supports managing event information.                                                                                                                                                           |
| [1711085051379-CreateTableUsers.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1711085051379-CreateTableUsers.ts)                           | Implements migration for creating users table in the database within nest-jo repository structure. Adds columns for user details like email, password, role, and more. Handles table creation and deletion based on existing conditions.                                                                      |
| [1712661230452-CreateTableTransactions.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230452-CreateTableTransactions.ts)             | Creates a transactions table in the database for storing transaction details, including user references and payment status, to facilitate transaction management within the application. The migration checks if the table already exists before creating it and includes necessary columns for data storage. |
| [1712661221574-CreateTableCarts.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661221574-CreateTableCarts.ts)                           | Creates a table cart storing shopping cart info, user references, creation/update timestamps. Checks existence before creation. Revert removes the cart table.                                                                                                                                                |
| [1712642603000-CreateTableEventPrices.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712642603000-CreateTableEventPrices.ts)               | Implements migration for event_prices table setup in the schema. Adds columns for event pricing. Checks and creates table if not existing. Reverts changes by dropping the table if necessary.                                                                                                                |
| [1712751780000-AddForeignKey.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712751780000-AddForeignKey.ts)                                 | Implements foreign key constraints in reservations and tickets tables. Adds and drops constraints to ensure data integrity within the NestJS projects database architecture.                                                                                                                                  |

</details>

<details closed><summary>src.database.migrations-test</summary>

| File                                                                                                                                                                                      | Summary                                                                                                                                                                                                                                |
| ---                                                                                                                                                                                       | ---                                                                                                                                                                                                                                    |
| [add-foreign-key-constraints.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/add-foreign-key-constraints.migration.spec.ts)           | Implements migration for adding foreign key constraints between tables reservations, tickets, users, and transactions. The code ensures data integrity by defining relationships in the database schema.                               |
| [create-table-cart-items.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-cart-items.migration.spec.ts)                   | Verifies if cart_items table exists; creates it if not. Drops cart_items table if needed. Uses constants in a test for migration. Migrates database schema with TypeORM.                                                               |
| [create-table-reservation-details.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-reservation-details.migration.spec.ts) | Verifies creation necessity for reservation_details table in DB. Ensures migration logic correctly handles existence check. Resides in src/database/migrations-test within the nest-jo repository.                                     |
| [create-table-reservations.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-reservations.migration.spec.ts)               | Implements migrations for creating and dropping the reservations table using TypeORM and Jest for testing. The code ensures proper setup and teardown of the reservations entity within the database schema in the NestJS application. |
| [create-table-events.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-events.migration.spec.ts)                           | Implements migration logic for creating and dropping the events table based on its existence using TypeORM in the nest-jo repository.                                                                                                  |
| [create-table-event-prices.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-event-prices.migration.spec.ts)               | Verifies and creates event_prices table if absent, avoiding duplicates. Drops event_prices table on reversal. Integrates migration utilities for database schema management in NestJS project structure.                               |
| [create-table-tickets.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-tickets.migration.spec.ts)                         | Verifies and creates a tickets table in the database if necessary. Handles migration tasks, ensuring the table existence before execution. Enhances database structure integrity for the NestJS project.                               |
| [create-table-transactions.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-transactions.migration.spec.ts)               | Validates and executes migrations to create or drop a transactions table in the database. Handles table creation based on existence status. Implements up and down migration methods with corresponding behavior checks.               |
| [create-table-carts.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-carts.migration.spec.ts)                             | Implements migration tests for creating and dropping a cart table based on existing table check. Verifies up method creates or skips table creation, down method drops cart table.                                                     |
| [create-table-users.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-users.migration.spec.ts)                             | Implements migration logic for creating and dropping a database table. Verifies table existence before creating it. Enhances data integrity during database schema changes.                                                            |

</details>

<details closed><summary>src.database.query</summary>

| File                                                                                                                                | Summary                                                                                                                                                                                                                                                                                                              |
| ---                                                                                                                                 | ---                                                                                                                                                                                                                                                                                                                  |
| [query-helper.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/query/query-helper.service.spec.ts) | Implements query building with functional tests for pagination and filtering logic using NestJS. The service constructs query options, where conditions, and nested order clauses based on specified criteria. This enhances database interaction for various data retrieval operations in the project.              |
| [query-helper.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/query/query-helper.service.ts)           | Generates query options for database operations by handling pagination, sorting, and filtering based on provided DTO. Implements functions to build where conditions for filtering and create nested order conditions for sorting, enhancing overall database query flexibility within the repositorys architecture. |

</details>

<details closed><summary>src.utils.constants</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                    |
| ---                                                                                                                          | ---                                                                                                                                                                                        |
| [constants.env.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.env.ts)                 | Defines constants for environment variables in the NestJS application. Specifies values for different environments, aiding code clarity and organization within the projects architecture. |
| [constants.common.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.common.ts)           | Defines price formulas and default page sizes with multipliers for different entities, enhancing readability and maintainability.                                                          |
| [constants.migrationdb.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.migrationdb.ts) | Price formule, user role, reservation status, and sports categories if they dont exist. Supports dynamic creation based on predefined values to ensure database integrity and consistency. |

</details>

<details closed><summary>src.utils.services</summary>

| File                                                                                                                                  | Summary                                                                                                                                                                                                                                                            |
| ---                                                                                                                                   | ---                                                                                                                                                                                                                                                                |
| [convert-utils.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/services/convert-utils.service.spec.ts) | Tests conversion functions for converting days to seconds and date strings to Date objects within the NestJS application. The service ensures accurate conversions and proper handling of invalid inputs, supporting robust functionality within the architecture. |
| [convert-utils.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/services/convert-utils.service.ts)           | Enables utility conversions for durations and dates within the repositorys architecture. Converts duration strings to seconds and date strings to Date objects for seamless data manipulation.                                                                     |

</details>

<details closed><summary>src.security.encryption</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                                          |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                                              |
| [encryption.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/encryption/encryption.service.ts)           | Handles encryption tasks by hashing passwords with Argon2, verifying passwords, generating UUIDs, creating secure keys for users, and generating QR codes from secure keys. Integrated into the architecture for secure user data encryption and key generation. |
| [encryption.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/encryption/encryption.service.spec.ts) | Implements encryption functionality using Argon2 for securely hashing and verifying passwords in the context of the repositorys security module. The code ensures password protection through hash generation and validation.                                    |

</details>

<details closed><summary>src.security.guards</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                                                    |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                                                        |
| [is-creator.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/is-creator.guard.ts)           | Validates user as content creator, enabling safe content updates. Guards route access, prevents unauthorized modifications. Utilizes reflection for dynamic checks within the NestJS architecture.                                                                                         |
| [index.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/index.ts)                                 | Exports various security guards, including RoleGuard, IsCreatorGuard, and AccessTokenGuard, crucial for enforcing access control and authorization rules within the NestJS application. Integrated into the security module to enhance overall API security and maintain system integrity. |
| [role.guard.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/role.guard.spec.ts)             | Implements RoleGuard testing for access control based on user roles. Validates allowing or denying access scenarios, ensuring the correct permissions are enforced within the Nest.js applications security architecture.                                                                  |
| [role.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/role.guard.ts)                       | Implements RoleGuard ensuring route access based on user role metadata. Retrieves required role from Reflectors, compares with user role from the request, allowing access if matched. Vital component for route authorization within the repositorys architecture.                        |
| [is-creator.guard.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/is-creator.guard.spec.ts) | Verifies content creator status with `IsCreatorGuard`. Tests if user is the creator for certain content. Uses execution context to authenticate and respond accordingly.                                                                                                                   |
| [access-token.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/access-token.guard.ts)       | Safeguard routes with JWT access tokens using the AccessTokenGuard to enforce authentication in the nest-jo repositorys security architecture.                                                                                                                                             |

</details>

<details closed><summary>src.security.cookie</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                             |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                                 |
| [cookie.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/cookie/cookie.service.spec.ts) | Tests `CookieService` methods for handling refresh token cookies, ensuring correct extraction, setting based on configurations, and clearing. Dependencies mocked for controlled testing environment.                                               |
| [cookie.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/cookie/cookie.service.ts)           | Manages HTTP cookies by extracting, setting, and clearing refresh tokens securely based on configuration settings. Its functions ensure proper handling of cookies for user authentication within NestJS applications under specified environments. |

</details>

<details closed><summary>src.security.token</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                  |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                      |
| [token-management.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token-management.service.spec.ts)     | Creates access and refresh tokens, and verifies them using JWT and configurations. Key features include token generation based on user roles and token expiration, enhancing security within the NestJS architecture.                                    |
| [token.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token.service.ts)                                     | Manages JWT tokens for user authentication, allowing token generation, refresh, and validation with Redis. Handles token creation, refreshing, and error responses for access control.                                                                   |
| [refreshtoken-store.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/refreshtoken-store.service.spec.ts) | Implements RefreshTokenStoreService to manage refresh tokens in Redis. Tests storing, verifying, and removing tokens. Dependencies on RedisService, ConfigService, and ConvertUtilsService. Part of the security module in the NestJS project structure. |
| [refreshtoken-store.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/refreshtoken-store.service.ts)           | Store, verify, and remove operations. Dependencies include Redis service, conversion utilities, and configuration variables. Key features are storing tokens with TTL and verifying token validity.                                                      |
| [token-management.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token-management.service.ts)               | Manages JWT tokens by creating access and refresh tokens, verifying token authenticity, leveraging JWT service, and configuration settings from the parent repository.                                                                                   |
| [token.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token.service.spec.ts)                           | Tests token generation, refresh, validation, and cookie handling. Manages token services and Redis storage. Validates and extracts JWT tokens. Key for user authentication and authorization flows in the NestJS project structure.                      |

</details>

<details closed><summary>src.security.throttler</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                     |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                         |
| [throttler.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/throttler/throttler.module.ts) | Enables rate limiting using Throttler in NestJS. Implements a module with a 10 requests per minute limit with a 1-minute TTL. Integrated as a crucial component for managing traffic and enhancing security within the NestJS architecture. |

</details>

<details closed><summary>src.security.auth</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                                            |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                                                |
| [auth.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.controller.ts)           | Register, log in, update password, generate access tokens, refresh tokens, log out, and delete user. Implements necessary routes and guards for user-related actions within the projects architecture.                                                             |
| [auth.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.controller.spec.ts) | Create, login, updatePassword, getRefreshToken, refreshToken, logout ensuring correct service method calls & parameter passing. Enhances code quality and robustness in authentication functionalities for the NestJS-based project.                               |
| [auth.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.service.spec.ts)       | Tests authentication and user functions. Handles signup, login, password update, and logout. Mocks repository methods and services for user actions, enhancing security and error handling in the NestJS application.                                              |
| [auth.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.service.ts)                 | Manages user authentication and operations, enabling user registration, logins, password updates, logouts, and deletions. Utilizes encryption, token generation, and user repositories to handle user-related tasks securely and efficiently.                      |
| [auth.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.module.ts)                   | Defines authentication module with services and controllers. Integrates TypeORM for User entity, CartsModule, and CommonModule. Registers AuthService, TokenService, CookieService, JwtService, TokenManagementService, and RefreshTokenStoreService as providers. |

</details>

<details closed><summary>src.security.auth.dto</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                          |
| ---                                                                                                                        | ---                                                                                                                                                                                                                              |
| [signup.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/signup.dto.ts)                   | Defines SignUpDto schema specifying user data fields validation rules like first name, last name, email, password, and role. Ensures data quality and integrity for user sign-up within the Nest-JO repositorys security module. |
| [login.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/login.dto.ts)                     | Defines a strict DTO for user login within the security module, enforcing valid email and non-empty password fields using class-validator.                                                                                       |
| [refresh-token.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/refresh-token.dto.ts)     | Defines RefreshTokenDto class validating a non-empty string refreshToken for token refreshing in the Nest.js projects security module.                                                                                           |
| [update-password.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/update-password.dto.ts) | Defines DTO for updating user passwords with validation rules ensuring strong security. Situated in the security module, aligns with the repositorys modular architecture.                                                       |

</details>

<details closed><summary>src.security.auth.strategies</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                           |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                               |
| [access-token.strategy.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/strategies/access-token.strategy.spec.ts) | Tests access token validation strategy for user authentication using JWT tokens. Validates user, handles user not found, and ensures token version match. Key components include User entity, Repository, and ConfigService for token validation. |
| [access-token.strategy.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/strategies/access-token.strategy.ts)           | Validates JWT access tokens for user authentication using Passport, ensuring tokens are valid and not expired. Retrieves user details from the database based on the JWT payload, throwing an unauthorized exception if the token is invalid.     |

</details>

<details closed><summary>test</summary>

| File                                                                                        | Summary                                                                                                                                                                                                        |
| ---                                                                                         | ---                                                                                                                                                                                                            |
| [app.e2e-spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/test/app.e2e-spec.ts) | Tests the NestJS applications root endpoint using `supertest`, validating it returns Hello World!' with a 200 status code. Integrates with the AppModule for testing setup.                                    |
| [jest-e2e.json](https://github.com/Binary-Blade/nest-jo/blob/master/test/jest-e2e.json)     | Defines end-to-end test configuration for NestJS repository. Sets file extensions, directory, test environment, file matching regex, and transforms TypeScript with ts-jest to ensure seamless test execution. |

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
