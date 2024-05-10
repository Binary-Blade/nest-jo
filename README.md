<p align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">NEST-JO</h1>
</p>
<p align="center">
    <em>Building Seamless Development Environments!</em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/Binary-Blade/nest-jo.git?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/Binary-Blade/nest-jo.git?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Binary-Blade/nest-jo.git?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Binary-Blade/nest-jo.git?style=default&color=0080ff" alt="repo-language-count">
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

Nest-Jo is a sophisticated open-source project that revolves around a NestJS application with a multitude of interconnected services, catering to seamless development and production environments. With a comprehensive set of Docker configurations including docker-compose files for both development and production, a multi-stage Dockerfile, and tailored nest-cli settings, the project ensures a streamlined and efficient build process. By orchestrating services for the NestJS server, PostgreSQL database, and Redis cache within Docker containers, Nest-Jo simplifies the setup of inter-service dependencies, network connections, and environment variables. This projects value proposition lies in its ability to enhance development workflows, improve maintainability through adhering to Nest.js conventions, and provide a robust foundation for building scalable and resilient applications.

---

##  Features

|    |   Feature         | Description |
|----|-------------------|---------------------------------------------------------------|
| ⚙️  | **Architecture**  | Nest-jo project is built on NestJS, a framework for building efficient, scalable, and maintainable server-side applications. It utilizes a microservices architecture to enhance modularity and scalability. The project leverages TypeORM for seamless database interaction.|
| 🔩 | **Code Quality**  | The project adheres to best practices and standards for code quality. It includes linting with ESLint and formatting with Prettier for consistent coding style. The presence of unit tests using Jest ensures code reliability. |
| 📄 | **Documentation** | The project provides extensive documentation through TypeScript interfaces, Swagger integration for API documentation, and explanatory comments within the codebase. README file offers guidance on setup and usage. |
| 🔌 | **Integrations**  | Key integrations include TypeORM for database management, Passport for authentication strategies, Winston for logging, and Redis for caching. CORS and Helmet middleware enhance security and CORS handling. |
| 🧩 | **Modularity**    | Nest-jo exhibits high modularity with the use of modules, services, controllers, and decorators in NestJS. This modular structure allows for easy component isolation, testing, and reusability. |
| 🧪 | **Testing**       | Testing is carried out using Jest testing framework along with @nestjs/testing for unit and integration tests. The use of supertest facilitates API endpoint testing. TypeORM is incorporated for database testing. |
| ⚡️  | **Performance**   | The project focuses on performance optimization with features like express-rate-limit for rate limiting, caching with Redis, and efficient querying with TypeORM. Proper resource utilization helps in achieving faster response times. |
| 🛡️ | **Security**      | Security measures include helmet middleware for setting secure HTTP headers, argon2 for password hashing, JWT tokens for authentication, and CSRF protection using csurf middleware. Configuration is stored securely using dotenv. |
| 📦 | **Dependencies**  | Key dependencies include @nestjs/platform-express, TypeORM, Passport, Redis, Jest, Prettier, and other essential libraries for building robust Node.js applications. The project utilizes Docker for containerization and deployment. |
| 🚀 | **Scalability**   | The project demonstrates scalability through the use of microservices architecture, Docker containerization, and NestJS capabilities for handling increased traffic. Throttling mechanisms and caching further enhance scalability and performance. |

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
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── common
    │   ├── database
    │   ├── libs
    │   ├── main.ts
    │   ├── modules
    │   ├── security
    │   └── type.d.ts
    ├── test
    │   ├── app.e2e-spec.ts
    │   └── jest-e2e.json
    ├── tsconfig.build.json
    └── tsconfig.json
```

---

##  Modules

<details closed><summary>.</summary>

| File                                                                                                               | Summary                                                                                                                                                                                                                                                                                            |
| ---                                                                                                                | ---                                                                                                                                                                                                                                                                                                |
| [tsconfig.build.json](https://github.com/Binary-Blade/nest-jo.git/blob/master/tsconfig.build.json)                 | Extends and excludes files from the TypeScript build configuration. Incorporates settings from the main configuration for seamless development and build processes, omitting unnecessary directories and test files.                                                                               |
| [docker-compose.yml](https://github.com/Binary-Blade/nest-jo.git/blob/master/docker-compose.yml)                   | Defines services for NestJS server, PostgreSQL database, and Redis cache in the Docker Compose file. Sets up inter-service dependencies, environment variables, container configurations, and network connections within the app context.                                                          |
| [docker-compose.override.yml](https://github.com/Binary-Blade/nest-jo.git/blob/master/docker-compose.override.yml) | Coordinates services for development environment in Docker. Launches server with defined image and settings, connects to Postgres and Redis. Allows adjustments for PostgreSQL and Redis configurations.                                                                                           |
| [Dockerfile](https://github.com/Binary-Blade/nest-jo.git/blob/master/Dockerfile)                                   | Defines multi-stage Dockerfile for NestJS app, with common, development, pre-production, and production stages. It uses the base Node image, installs dependencies, builds the app, prunes dev dependencies, and sets up the production environment. Configures entry point and exposes port 3000. |
| [nest-cli.json](https://github.com/Binary-Blade/nest-jo.git/blob/master/nest-cli.json)                             | Customizes Nest.js projects configuration to delete output directory, enhancing build process efficiency. Improves maintainability by structuring source files under src' according to Nest.js conventions.                                                                                        |
| [docker-compose.prod.yml](https://github.com/Binary-Blade/nest-jo.git/blob/master/docker-compose.prod.yml)         | Defines production environment services for a NestJS application, leveraging PostgreSQL and Redis containers managed by Docker Compose. Nginx acts as the API gateway, orchestrating communication between services in the appnet network.                                                         |
| [tsconfig.json](https://github.com/Binary-Blade/nest-jo.git/blob/master/tsconfig.json)                             | Defines path aliases for project directories enhancing module import clarity and simplifying file referencing. Improves code organization and maintainability in the repository by leveraging TypeScript compiler options for better project scalability.                                          |
| [package.json](https://github.com/Binary-Blade/nest-jo.git/blob/master/package.json)                               | Implements scripts for building projects, formatting code, running tests, and managing database migrations. Ensures consistent coding standards and facilitates development and testing workflows within the NestJS application.                                                                   |
| [Makefile](https://github.com/Binary-Blade/nest-jo.git/blob/master/Makefile)                                       | Manages database migrations, running tests, and interacting with Redis & Docker for development and production environments. Coordinates container setups and commands for the NestJS repositorys infrastructure.                                                                                  |

</details>

<details closed><summary>src</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                         |
| ---                                                                                                | ---                                                                                                                                                                                                                                                             |
| [main.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/main.ts)                     | Initiates Nest.js application setup by configuring global interceptors, filters, and pipes.-Enables CORS for the specified frontend URL.-Executes database migrations on boot.-Implements security middleware for cookies and headers.-Logs environment status. |
| [type.d.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/type.d.ts)                 | Defines Express request object structure to include user information for authentication throughout the `nest-jo` repository.                                                                                                                                    |
| [app.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/app.module.ts)         | Orchestrates** main application modules for environment configuration, database, security, user, event, cart, reservation, payment, ticket, and transaction handling with throttling, essential for the repositorys modular architecture.                       |
| [app.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/app.controller.ts) | Exposes a route that returns a simple Hello World! message. Integrates with the Nest.js architecture and follows the repository structure.                                                                                                                      |

</details>

<details closed><summary>src.libs.payment</summary>

| File                                                                                                                        | Summary                                                                                                                                                                                                                                                                                   |
| ---                                                                                                                         | ---                                                                                                                                                                                                                                                                                       |
| [payment.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/libs/payment/payment.module.ts)             | Defines payment module dependencies for the system, linking entities and services related to payment processing. Integrates with reservation, cart, event, ticket, and transaction modules for seamless payment functionality within the applications architecture.                       |
| [payment.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/libs/payment/payment.service.spec.ts) | Tests `processPayment` method in `PaymentService` for varying payment scenarios. Validates approval, rejection, and error messages based on different conditions like cart total and payment success rates. Key for ensuring payment processing accuracy in the repositorys architecture. |
| [payment.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/libs/payment/payment.service.ts)           | Handles payment processing for reservations, determining success with a 60% rate. Returns status and details based on payment outcome. Part of the repositorys architecture for managing payment functionality in a Nest.js application.                                                  |

</details>

<details closed><summary>src.common</summary>

| File                                                                                            | Summary                                                                                                                                                                                                                  |
| ---                                                                                             | ---                                                                                                                                                                                                                      |
| [constants.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/constants.ts) | Defines environment constants and price formula multipliers for the NEST-JO repository. Manages node environments and pricing variations. Integral for configuration and pricing logic within the projects architecture. |

</details>

<details closed><summary>src.common.enums</summary>

| File                                                                                                                              | Summary                                                                                                                                                                                                                                              |
| ---                                                                                                                               | ---                                                                                                                                                                                                                                                  |
| [user-role.enum.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/enums/user-role.enum.ts)                   | Defines user roles as either USER or ADMIN within the repository structure to classify different user types in the application.                                                                                                                      |
| [status-reservation.enum.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/enums/status-reservation.enum.ts) | PENDING, APPROVED, REJECTED, CANCELLED for the repository.                                                                                                                                                                                           |
| [category-type.enum.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/enums/category-type.enum.ts)           | Defines event categories in enum form to categorize different sports types within the NestJS projects common module. This enum enhances code readability and maintains consistency across the application architecture for easy reference and usage. |
| [price-formula.enum.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/enums/price-formula.enum.ts)           | Defines event pricing categories as an enum in price-formula.enum.ts to categorize events for singles, couples, or families in the nest-jo repository's common module.                                                                               |

</details>

<details closed><summary>src.common.decorators</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                  |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                      |
| [user-id.decorator.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/decorators/user-id.decorator.ts) | Extracts user ID from the request object to inject into controller methods for simplified access. Enables easy retrieval of user ID for authorization and user-specific functionalities within the NestJS architecture.                  |
| [role.decorator.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/decorators/role.decorator.ts)       | Enables role-based access control by specifying required user roles for route access. Declares a decorator function Role that sets the required role metadata for route authorization, enhancing the repository's security architecture. |

</details>

<details closed><summary>src.common.exceptions</summary>

| File                                                                                                                                               | Summary                                                                                                                                                                                                                                                      |
| ---                                                                                                                                                | ---                                                                                                                                                                                                                                                          |
| [invalid-credentials.exception.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/exceptions/invalid-credentials.exception.ts) | Defines `InvalidCredentialsException` signaling invalid login data. Extends `HttpException` to return 401 status code for unauthorized login attempts. Crucial within the `common` directory for handling authentication errors in the `nest-jo` repository. |

</details>

<details closed><summary>src.common.globals-filter</summary>

| File                                                                                                                                     | Summary                                                                                                                                                                                                                                                    |
| ---                                                                                                                                      | ---                                                                                                                                                                                                                                                        |
| [http-exceptions-filter.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/globals-filter/http-exceptions-filter.ts) | Implements a global HTTP exception filter enhancing error responses in non-production environments with debugging details. It captures and formats HTTP exceptions to aid in debugging and provides configurable error responses based on the environment. |

</details>

<details closed><summary>src.common.utils</summary>

| File                                                                                                          | Summary                                                                                                                                                                                                                                                       |
| ---                                                                                                           | ---                                                                                                                                                                                                                                                           |
| [utils.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/utils/utils.service.ts) | Enables date and duration conversions in the `src/common` of the repository. Includes functions to convert a duration string into seconds and a date string into a Date object. Essential for handling time-related operations within the applications logic. |

</details>

<details closed><summary>src.common.interfaces</summary>

| File                                                                                                                                       | Summary                                                                                                                                                                                                                                                            |
| ---                                                                                                                                        | ---                                                                                                                                                                                                                                                                |
| [token.interface.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/interfaces/token.interface.ts)                     | Defines token configuration structure for managing access and refresh tokens. Clarifies secrets and expiration times for secure authentication within the Nest.js application. Vital for enforcing token-based security protocols in the repositorys architecture. |
| [payment.interface.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/interfaces/payment.interface.ts)                 | Defines payment interfaces with status and detail fields, and optional payment ID or reservations. Crucial for handling payment responses and communicating with the reservations module.                                                                          |
| [key-value-redis.interface.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/interfaces/key-value-redis.interface.ts) | Defines key-value pairs interface for data management. Crucial for handling various data types efficiently across the application. This interface enhances clarity and consistency in data handling implementations within the repository.                         |
| [payload.interface.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/interfaces/payload.interface.ts)                 | Defines JWT token payload structure for user roles and permissions in the NestJS app, enhancing security and authorization capabilities.                                                                                                                           |
| [jwt.interface.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/interfaces/jwt.interface.ts)                         | Defines JWT payload and token interfaces for user authentication in the NestJS application. Centralizes token structure and expiry info, enriching security feature functionality in the project.                                                                  |

</details>

<details closed><summary>src.common.logger</summary>

| File                                                                                                               | Summary                                                                                                                                                                                                                                 |
| ---                                                                                                                | ---                                                                                                                                                                                                                                     |
| [winston.config.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/logger/winston.config.ts)   | Defines Winston logger configuration based on environment for logging errors and console output. Formats include timestamp, colorize, and JSON. Logs to error.log and combined.log files, and to console in non-production environment. |
| [winston.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/common/logger/winston.service.ts) | Enhances logging functionality by integrating with Winston in the projects common utilities. Provides methods to log messages at various levels using the configured Winston logger instance.                                           |

</details>

<details closed><summary>src.modules</summary>

| File                                                                                                     | Summary                                                                                                                                                                                                                                                                   |
| ---                                                                                                      | ---                                                                                                                                                                                                                                                                       |
| [commom.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/commom.module.ts) | Defines global module exporting common services like user management, utilities, encryption, payment, and Redis interaction. Utilizes TypeORM for user entities and includes RedisModule for Redis integration. Facilitates shared service access across the application. |

</details>

<details closed><summary>src.modules.reservation-details</summary>

| File                                                                                                                                                               | Summary                                                                                                                                                                                                                                                         |
| ---                                                                                                                                                                | ---                                                                                                                                                                                                                                                             |
| [reservation-details.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/reservation-details.module.ts)             | Enables reservation details management by injecting services and controllers for CRUD operations on events, prices, carts, and payments using TypeORM. Orchestrates interactions within the reservation details module in the Nest.js application architecture. |
| [reservation-details.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/reservation-details.service.ts)           | Enables creation of reservation details from a reservation and cart item, ensuring event existence, then stores details. Additionally, finds a reservation detail by ID with associated event and reservation.                                                  |
| [reservation-details.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/reservation-details.service.spec.ts) | Implements reservation details creation from reservations and finding by ID. Mocks repository functions for testing. Enhances functionality for reservation processing.                                                                                         |
| [reservation-details.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/reservation-details.controller.ts)     | Defines a controller handling reservation details, relying on ReservationDetailsService. This supports structured handling and segregation of reservation-related functionalities within the Nest.js architecture.                                              |

</details>

<details closed><summary>src.modules.reservation-details.entities</summary>

| File                                                                                                                                                            | Summary                                                                                                                                                                                                                                                                    |
| ---                                                                                                                                                             | ---                                                                                                                                                                                                                                                                        |
| [reservation-details.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/entities/reservation-details.entity.ts) | Defines ReservationDetails entity linking Reservation and Event with key properties for managing reservation details. Central to the Nest-jo architecture, it enforces data integrity and relationships crucial for handling reservation specifics within the application. |

</details>

<details closed><summary>src.modules.reservation-details.dto</summary>

| File                                                                                                                                                               | Summary                                                                                                                                                                                                                                                  |
| ---                                                                                                                                                                | ---                                                                                                                                                                                                                                                      |
| [create-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/dto/create-reservation-details.dto.ts) | Defines data structure for creating reservation details with validation rules ensuring integrity and accuracy of input data. Located within the reservation details module, enhancing robustness and reliability of the parent repositorys architecture. |
| [update-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservation-details/dto/update-reservation-details.dto.ts) | Defines an update DTO extending partial reservation details for the NestJS project.                                                                                                                                                                      |

</details>

<details closed><summary>src.modules.users</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                                    |
| ---                                                                                                                            | ---                                                                                                                                                                                                                                        |
| [users.controller.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/users.controller.spec.ts) | Tests user-related CRUD operations in NestJS app using mocked service. Validates finding all users, finding one user, updating a user, and removing a user. Utilizes guards for security.                                                  |
| [users.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/users.module.ts)                   | Defines user-related operations, registers User entity for TypeORM, includes UsersController for user endpoints, and implements JWT validation with AccessTokenStrategy, leveraging Redis for data storage within the NestJS architecture. |
| [users.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/users.service.ts)                 | Manages user data in the repository structure. Implements finding, updating, and removing users. Verifies user existence and relationships. Key for user management functionalities within the NestJS application architecture.            |
| [users.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/users.service.spec.ts)       | Implements user CRUD operations with error handling. Uses mock repository for testing. Ensures finding, updating, and removing users functionalities. Supports testing for user existence and updating user details.                       |
| [users.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/users.controller.ts)           | Manages user operations securely in the repository. Handles user data retrieval, updates, and deletions with role-based access control. Allows fetching all users for admins and individual user data for users or admins.                 |

</details>

<details closed><summary>src.modules.users.entities</summary>

| File                                                                                                                | Summary                                                                                                                                                                                                                           |
| ---                                                                                                                 | ---                                                                                                                                                                                                                               |
| [user.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/entities/user.entity.ts) | Defines user entity with associations and attributes for user management in the repositorys modular architecture. Organizes user data and relationships with carts, reservations, and transactions with role-based authorization. |

</details>

<details closed><summary>src.modules.users.dto</summary>

| File                                                                                                                   | Summary                                                                                                                                                                  |
| ---                                                                                                                    | ---                                                                                                                                                                      |
| [update-user.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/dto/update-user.dto.ts) | Defines a DTO class extending properties from another, following principles of code reusability in the NestJS project structure.                                         |
| [index.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/dto/index.ts)                     | Exports CreateUserDto and UpdateUserDto for user-related operations within the NestJS repositorys modular architecture.                                                  |
| [create-user.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/users/dto/create-user.dto.ts) | Defines user data structure for creating users with validation rules. Enhances user management in the architecture by ensuring valid input for user creation operations. |

</details>

<details closed><summary>src.modules.cart-items</summary>

| File                                                                                                                                          | Summary                                                                                                                                                                                                                                                                    |
| ---                                                                                                                                           | ---                                                                                                                                                                                                                                                                        |
| [cart-items.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/cart-items.module.ts)                   | Orchestrates services for managing cart items within a larger e-commerce ecosystem.-Integrates with various modules to handle cart operations, reservations, transactions, and ticket services.-Essential for the smooth functioning of the cart system in the repository. |
| [cart-items.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/cart-items.service.ts)                 | Manages cart items by adding, updating, and removing them. Ensures cart consistency and availability. Handles CRUD operations efficiently within the architecture of the parent repository.                                                                                |
| [cart-items.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/cart-items.controller.ts)           | Implements controllers for managing cart items in the /carts route. Functionalities include adding, fetching, updating, and removing items in the cart. Utilizes access token guards for user authorization.                                                               |
| [cart-items.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/cart-items.service.spec.ts)       | Adding, updating, and removing items. Ensures cart integrity and availability checks. Collaborates with related services in the NestJS project structure.                                                                                                                  |
| [cart-items.controller.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/cart-items.controller.spec.ts) | Implements CRUD operations for cart items in the project structure. Handles adding, fetching, updating, and removing cart items with user authorization checks, using predefined service functions.                                                                        |

</details>

<details closed><summary>src.modules.cart-items.entities</summary>

| File                                                                                                                               | Summary                                                                                                                                                                  |
| ---                                                                                                                                | ---                                                                                                                                                                      |
| [cartitems.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/entities/cartitems.entity.ts) | Connects to carts, events, and reservations. Manages price, quantity, and timestamps. Essential for handling cart functionality in the repositorys modular architecture. |

</details>

<details closed><summary>src.modules.cart-items.dto</summary>

| File                                                                                                                                  | Summary                                                                                                                                                                                |
| ---                                                                                                                                   | ---                                                                                                                                                                                    |
| [create-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/dto/create-cart-item.dto.ts) | Defines cart item creation data structure with event ID, quantity, and price formula validation rules for seamless integration into the repositorys modular architecture.              |
| [update-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/cart-items/dto/update-cart-item.dto.ts) | Defines DTO for updating cart items within NestJS repository structure under src/modules/cart-items with minimal payload, leveraging inheritance from the creation DTO for cart items. |

</details>

<details closed><summary>src.modules.reservations</summary>

| File                                                                                                                                                              | Summary                                                                                                                                                                                                                                                                             |
| ---                                                                                                                                                               | ---                                                                                                                                                                                                                                                                                 |
| [reservations-processor.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations-processor.service.spec.ts) | Analyzes and processes reservations, handling user transactions and cart items. Ensures proper reservation creation, finalizes booking, prevents duplicates, and manages post-payment cleanup. Integrates with multiple services for seamless reservation flows.                    |
| [reservations.controller.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations.controller.spec.ts)               | Defines tests for CRUD operations in the ReservationsController, ensuring successful creation, retrieval, and appropriate error handling for reservations. Integrates with the ReservationsService using mocked values for seamless interaction within the NestJS module structure. |
| [reservations.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations.service.spec.ts)                     | Implements reservation-related services for Nest.js app. Validates and processes user reservations, finding, saving, and handling exceptions efficiently. Integrates with TypeORM for database operations. Vital for managing reservations in the apps ecosystem.                   |
| [reservations-processor.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations-processor.service.ts)           | Handles reservation processing and management, including user verification, payment, transaction creation, and reservation finalization. Ensures no duplicate reservations, generates tickets for approved bookings, and performs post-payment cleanup operations.                  |
| [reservations.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations.service.ts)                               | Manages reservation operations for users and admins, facilitating creation, retrieval, and storage of reservations. Ensures only authorized users access specific reservations. Centralizes handling of reservation processing and storage in the system.                           |
| [reservations.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations.module.ts)                                 | Orchestrates reservation-related functionality.-Integrates with various modules for ticketing, event management.-Exports reservation services for broader module usage.                                                                                                             |
| [reservations.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/reservations.controller.ts)                         | Create, find for user/admin, and single retrieval. Ensures user authorization and role-based access control via guards and decorators within the repositorys NestJS architecture.                                                                                                   |

</details>

<details closed><summary>src.modules.reservations.entities</summary>

| File                                                                                                                                     | Summary                                                                                                                                                                                                   |
| ---                                                                                                                                      | ---                                                                                                                                                                                                       |
| [reservation.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/entities/reservation.entity.ts) | Defines reservation entity relationships in the repositorys modular architecture by connecting users, transactions, items, details, and tickets. Manages reservation creation and timestamps effectively. |

</details>

<details closed><summary>src.modules.reservations.dto</summary>

| File                                                                                                                                        | Summary                                                                                                                                                                                                                          |
| ---                                                                                                                                         | ---                                                                                                                                                                                                                              |
| [create-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/dto/create-reservation.dto.ts) | Defines reservation data structure for user, cart item, total price, and payment ID validations to enforce data integrity and consistency within the NestJS repositorys modular architecture.                                    |
| [update-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/reservations/dto/update-reservation.dto.ts) | Defines reservation update data structure derived from the creation schema, leveraging @nestjs/swagger. Aids in maintaining a consistent and structured approach for managing reservation data within the src modules directory. |

</details>

<details closed><summary>src.modules.events</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                                                     | ---                                                                                                                                                                                                                                                                                                                                                                               |
| [events.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/events.controller.ts)                 | Manages event creation, retrieval, updates, and deletions via /events route. Admin privileges required for modifications. Handles ticket price calculation based on event ID and formulae. Interacts with EventsService and EventPricesService for data operations.                                                                                                               |
| [event-prices.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/event-prices.service.ts)           | Manages event prices by creating, updating, and deleting prices based on specified formulas. Ensures event existence before operations. Provides functions to create prices, retrieve prices by formula, update prices, and delete all prices for an event.                                                                                                                       |
| [events.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/events.service.spec.ts)             | Ensures** event creation with unique titles, dates, and pricing, handling conflicts gracefully.-**Retrieves** all events securely and efficiently, with error handling for data fetching failures.-**Updates** event details with title uniqueness checks, pricing updates, and cache clearing.-**Removes** events safely, ensuring existent event deletion and cache management. |
| [events.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/events.service.ts)                       | Creates new events, fetches all events with caching, updates event details, removes events, checks title uniqueness, and retrieves events by ID.                                                                                                                                                                                                                                  |
| [events.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/events.module.ts)                         | Defines an event-handling module in the repositorys architecture. Imports event entities and Redis, declares an events controller, and provides services for events, event prices, and event sales. Necessary for managing events within the applications ecosystem.                                                                                                              |
| [event-sales.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/event-sales.service.ts)             | Handles processing event sales by deducting ticket quantities, updating revenue, and managing ticket prices based on specific formulas. Works in conjunction with the EventsService to ensure accurate sales tracking within the repositorys modular architecture.                                                                                                                |
| [events.controller.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/events.controller.spec.ts)       | Tests event creation, retrieval, update, removal, and ticket pricing, verifying expected outcomes and error handling. Implements controllers linked to services and guards to manage events using mock data and ensure proper functionality.                                                                                                                                      |
| [event-sales.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/event-sales.service.spec.ts)   | Ensures accurate revenue and ticket handling for events. Manages event sales, updates revenue, and deducts ticket quantities. Validates ticket availability and processes revenue generation. Facilitates seamless event management operations within the NestJS architecture.                                                                                                    |
| [event-prices.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/event-prices.service.spec.ts) | Create, get, update, delete. Ensures successful price handling and error mitigation. Integrates with event and price entities for effective event pricing management.                                                                                                                                                                                                             |

</details>

<details closed><summary>src.modules.events.entities</summary>

| File                                                                                                                               | Summary                                                                                                                                                                                                                                                               |
| ---                                                                                                                                | ---                                                                                                                                                                                                                                                                   |
| [event-price.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/entities/event-price.entity.ts) | Defines Event Price entity relations and properties for the Nest-jo repository. Manages pricing formulas and values tied to specific events, enhancing the repositorys event management module.                                                                       |
| [event.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/entities/event.entity.ts)             | Defines Event entity with properties like title, description, dates, and prices. Establishes relationships with CartItem and ReservationDetails entities for event tracking and booking. Enforces data integrity with unique title constraint and timestamp tracking. |

</details>

<details closed><summary>src.modules.events.dto</summary>

| File                                                                                                                                  | Summary                                                                                                                                                                                                                             |
| ---                                                                                                                                   | ---                                                                                                                                                                                                                                 |
| [create-event-price.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/dto/create-event-price.dto.ts) | Defines a data transfer object class for creating event prices in the events module, facilitating clear data exchange and enhancing the codebases organization and scalability within the repositorys architecture.                 |
| [update-event.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/dto/update-event.dto.ts)             | Defines simplified event update data based on event creation, promoting code reusability in the parent repositorys modular architecture.                                                                                            |
| [create-event.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/events/dto/create-event.dto.ts)             | Defines data transfer object for event creation with validation rules in the events module. Ensures required fields and data types for creating an event, promoting data integrity and consistency in the repositorys architecture. |

</details>

<details closed><summary>src.modules.tickets</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                                                |
| ---                                                                                                                            | ---                                                                                                                                                                                                                                                    |
| [tickets.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/tickets/tickets.controller.ts)     | Manages ticket-related operations by connecting to ticketservice.                                                                                                                                                                                      |
| [tickets.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/tickets/tickets.service.ts)           | Generates tickets for approved reservations, securely creating and associating tickets with reservations. Handles ticket creation and encryption, ensuring tickets are linked to the correct reservations.                                             |
| [tickets.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/tickets/tickets.module.ts)             | Defines a module managing ticket creation for reservations. Imports modules resolving circular dependencies. Configures controllers, services, and entity types needed for ticket functionality. Promotes reusability by exporting the ticket service. |
| [tickets.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/tickets/tickets.service.spec.ts) | Implements ticket generation for approved reservations, handles creating new tickets, and ensures data integrity. Integrates encryption, user verification, and transaction management services from the parent repositorys architecture.              |

</details>

<details closed><summary>src.modules.tickets.entities</summary>

| File                                                                                                                      | Summary                                                                                                                                                                                                          |
| ---                                                                                                                       | ---                                                                                                                                                                                                              |
| [ticket.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/tickets/entities/ticket.entity.ts) | Defines a Ticket entity with reservation details for a ticketing module. Establishes database relationships for reservations and includes unique purchase and secure keys, along with a QR code for each ticket. |

</details>

<details closed><summary>src.modules.transactions</summary>

| File                                                                                                                                          | Summary                                                                                                                                                                                                                                        |
| ---                                                                                                                                           | ---                                                                                                                                                                                                                                            |
| [transactions.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/transactions.module.ts)             | Orchestrates transactions within the system by managing services and controllers for handling various entities like tickets, events, carts, and reservations. Integrates with TypeORM and other modules for seamless functionality.            |
| [transactions.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/transactions.service.ts)           | Implements transaction creation, retrieval, and cart total calculation. Enhances user experience and system functionality within the transactions module. Supports seamless handling of user transactions and cart total calculations.         |
| [transactions.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/transactions.service.spec.ts) | Implements TransactionsService tests for creating transactions, finding by ID, and calculating cart total. Uses mocked repository functions and entities for a seamless testing experience within the NestJS repositorys modular architecture. |
| [transactions.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/transactions.controller.ts)     | Implements CRUD operations for transactions, linking HTTP requests to service methods, enhancing the applications scalability and maintainability.                                                                                             |

</details>

<details closed><summary>src.modules.transactions.entities</summary>

| File                                                                                                                                     | Summary                                                                                                                                                                                                                                                        |
| ---                                                                                                                                      | ---                                                                                                                                                                                                                                                            |
| [transaction.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/entities/transaction.entity.ts) | Defines transaction entity storing users payment info, linked to user and reservations. Incorporates status, payment ID, amount, creation & update timestamps. Key element of the repositorys database structure for handling transactions in the application. |

</details>

<details closed><summary>src.modules.transactions.dto</summary>

| File                                                                                                                                        | Summary                                                                                                                                                                                                                                   |
| ---                                                                                                                                         | ---                                                                                                                                                                                                                                       |
| [create-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/dto/create-transaction.dto.ts) | Defines DTO class for creating transactions, a critical feature in the NestJS architecture of the `nest-jo` repository. Ensures clear data transfer structures for handling transaction creation within the projects transaction modules. |
| [update-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/transactions/dto/update-transaction.dto.ts) | Defines a DTO class that extends existing functionality, promoting code reusability and maintaining a structured approach within the transactions module.                                                                                 |

</details>

<details closed><summary>src.modules.carts</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                     |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                         |
| [carts.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/carts/carts.service.ts)           | Manages cart operations by finding, creating, verifying, saving, and deleting carts. Interacts with the database through TypeORM. Provides essential cart functionalities for user interactions within the NestJS application architecture. |
| [carts.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/carts/carts.service.spec.ts) | Validates, retrieves, creates, saves, and deletes shopping carts. Ensures cart existence, performs operations, and handles exceptions. Employs TypeORM and NestJS for data manipulation and structure.                                      |
| [carts.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/carts/carts.module.ts)             | Defines NestJS module for managing user carts with TypeORM entities. Integrates Redis caching, event handling, and various services. Maintains clean architecture and encapsulation by utilizing separate modules.                          |

</details>

<details closed><summary>src.modules.carts.entities</summary>

| File                                                                                                                | Summary                                                                                                                                                                |
| ---                                                                                                                 | ---                                                                                                                                                                    |
| [cart.entity.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/modules/carts/entities/cart.entity.ts) | Defines Cart entity with relationships to User and CartItem. Tracks cartId, user, cart items, and timestamps. Key part of the system for managing user shopping carts. |

</details>

<details closed><summary>src.database</summary>

| File                                                                                                                | Summary                                                                                                                                                                                                        |
| ---                                                                                                                 | ---                                                                                                                                                                                                            |
| [typeorm-cli.config.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/typeorm-cli.config.ts) | Defines TypeORM DataSource for database connectivity, leveraging environment variables via ConfigService. Establishes database connection settings, entity and migration paths for automatic loading.          |
| [migration-runner.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migration-runner.ts)     | Executes database schema migrations, crucial for app integrity and updates. Utilizes a logger and TypeORM config to initiate and run migrations. Handles migration failures gracefully to prevent app startup. |
| [database.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/database.module.ts)       | Configures TypeORM for the NestJS app using a Database Module. Imports TypeORM and sets up a PostgreSQL connection based on environment variables. Synchronizes database entities dynamically.                 |

</details>

<details closed><summary>src.database.redis</summary>

| File                                                                                                                      | Summary                                                                                                                                                                                                                                              |
| ---                                                                                                                       | ---                                                                                                                                                                                                                                                  |
| [redis.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/redis/redis.service.ts)           | Implements a Redis service for cache operations in the Nest.js architecture. Offers functions to set, get, delete data, fetch cached data, parse JSON safely, and clear cache based on specific or all events.                                       |
| [redis.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/redis/redis.module.ts)             | Establishes a Redis module in the NestJS architecture. Integrates Redis with configuration settings using IoRedis. Provides REDIS_CLIENT service and RedisService layer, facilitating modular, efficient Redis functionality throughout the project. |
| [redis.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/redis/redis.service.spec.ts) | Implements Redis caching service for data storage and retrieval. Features set values with or without TTL, get values, delete keys, fetch cached data, and safely parse JSON. Enhances application performance by efficiently managing cached data.   |

</details>

<details closed><summary>src.database.migrations</summary>

| File                                                                                                                                                                             | Summary                                                                                                                                                                                                                                                                      |
| ---                                                                                                                                                                              | ---                                                                                                                                                                                                                                                                          |
| [1714872603715-CreateTableEventPrices.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1714872603715-CreateTableEventPrices.ts)               | Creates event prices table if not existing; implements up() to handle table creation and down() for table deletion. Executes SQL queries utilizing TypeORM and constants from the database folder.                                                                           |
| [1712661230450-CreateTableCartItems.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1712661230450-CreateTableCartItems.ts)                   | Creates and modifies the cart_items table in the database. Checks for table existence before defining columns. Includes fields like cartId, eventId, priceFormula, price, quantity, and timestamps. Supports migration reversal to drop the table.                           |
| [constants-db.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/constants-db.ts)                                                               | Price formule, user role, status reservation, and category type. Controls the existence and creation of these enums for tables and columns in the database, maintaining data integrity.                                                                                      |
| [1714995568218-CreateTableTransactions.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1714995568218-CreateTableTransactions.ts)             | Creates transactions table if not exists, with specific columns. Checks and creates status_reservation_enum if needed. down method drops transactions table to revert the migration. Manages database schema changes efficiently within the NestJS application architecture. |
| [1713117719010-CreateTableTickets.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1713117719010-CreateTableTickets.ts)                       | Creates the tickets table in the database if it doesn't exist. Includes fields like ticketId, reservationId, purchaseKey, secureKey, and qrCode. The migration also handles dropping the tickets table to rollback changes.                                                  |
| [1714895249686-CreateTableReservationDetails.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1714895249686-CreateTableReservationDetails.ts) | Implements a migration creating a reservation_details table if it doesn't exist and defining its schema. Also handles the rollback by dropping the reservation_details table.                                                                                                |
| [1712572717258-CreateTableEvents.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1712572717258-CreateTableEvents.ts)                         | Creates events table with specified columns if it doesn't exist, ensuring data integrity. Can also reverse this action by dropping the table.                                                                                                                                |
| [1711085051379-InitialMigration.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1711085051379-InitialMigration.ts)                           | Creates users table in the database with user information columns, ensuring role enum type existence. Downscales by dropping users table, maintaining database integrity for user management.                                                                                |
| [1712751776642-CreateTableReservations.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1712751776642-CreateTableReservations.ts)             | Creates reservations table if not exists, with specific columns. Down method drops the table, reverting the migration. Manages database schema changes efficiently.                                                                                                          |
| [1712661221574-CreateTableCarts.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/database/migrations/1712661221574-CreateTableCarts.ts)                           | Implements database migration for the carts table creation and rollback. Checks table existence before creation, ensuring efficient and reversible changes in the parent architecture's database structure.                                                                  |

</details>

<details closed><summary>src.security.encryption</summary>

| File                                                                                                                                     | Summary                                                                                                                                                                                                                                     |
| ---                                                                                                                                      | ---                                                                                                                                                                                                                                         |
| [encryption.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/encryption/encryption.service.ts)           | Enhances security by hashing & verifying passwords with Argon2.-Generates UUID v4 keys and secure keys for users.-Creates QR codes for secure keys.                                                                                         |
| [encryption.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/encryption/encryption.service.spec.ts) | Verifies password hashes securely and efficiently through the EncryptionService within the parent repositorys security module. The service uses argon2 for hashing and verifying passwords, ensuring robust security measures are in place. |

</details>

<details closed><summary>src.security.guards</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                     |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                         |
| [is-creator.guard.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/guards/is-creator.guard.ts)     | Verifies users ownership of content during requests; enhances authorization in accessing or modifying content.                                                                                                                                              |
| [index.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/guards/index.ts)                           | Exports RoleGuard, IsCreatorGuard, and AccessTokenGuard from the security/guards directory. Enhances API security by implementing role-based access control, creator validation, and access token verification within the Nest.js application architecture. |
| [role.guard.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/guards/role.guard.ts)                 | Implements RoleGuard to enforce role-based access control. Determines if the user has the necessary role to access a route by comparing it with the required role retrieved from route metadata.                                                            |
| [access-token.guard.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/guards/access-token.guard.ts) | Ensures valid access tokens for protected routes using Passports JWT strategy. Safeguards routes in need of authentication within the repositorys security module structure.                                                                                |

</details>

<details closed><summary>src.security.cookie</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                           |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                               |
| [cookie.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/cookie/cookie.service.spec.ts) | Tests cookie service methods for extracting, setting, and clearing refresh tokens within the Nest-JO repositorys security module. Utilizes ConfigService for settings and UtilsService for utility conversions while ensuring cookie security and error handling. |
| [cookie.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/cookie/cookie.service.ts)           | Handles cookie management in NestJS app. Extracts refresh tokens, sets them with expiration and security flags, and clears them as needed. Supports secure cookie handling based on the environment.                                                              |

</details>

<details closed><summary>src.security.token</summary>

| File                                                                                                                                                | Summary                                                                                                                                                                                                                                            |
| ---                                                                                                                                                 | ---                                                                                                                                                                                                                                                |
| [token-management.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/token/token-management.service.spec.ts)     | Implements token management services for creating and verifying access/refresh tokens using JWT and config settings. Enhances user authentication and authorization within the Nest.js application structure.                                      |
| [token.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/token/token.service.ts)                                     | Manages JWT tokens, creating and validating access and refresh tokens for users. Handles token storage in Redis, authentication, and token refreshing to maintain user sessions securely within the NestJS architecture.                           |
| [refreshtoken-store.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/token/refreshtoken-store.service.spec.ts) | Implements Redis operations for refresh tokens-Stores, verifies, and removes tokens-Utilizes Redis, Config, and Utils services-Ensures token management in NestJS app                                                                              |
| [refreshtoken-store.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/token/refreshtoken-store.service.ts)           | Manages storing, verifying, and removing refresh tokens in Redis for users. Provides methods to store tokens, validate them, and delete them upon user actions.                                                                                    |
| [token-management.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/token/token-management.service.ts)               | Manages JWT token creation and validation. Creates access and refresh tokens with configurable expiration. Verifies and decodes tokens using corresponding secrets. Vital for secure token handling within the NestJS projects security component. |
| [token.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/token/token.service.spec.ts)                           | Validates, refreshes, and generates access tokens for users, handling token creation, verification, and storage in Redis. Ensures secure token management within the NestJS architecture by leveraging various services and entities.              |

</details>

<details closed><summary>src.security.throttler</summary>

| File                                                                                                                      | Summary                                                                                                                                                                  |
| ---                                                                                                                       | ---                                                                                                                                                                      |
| [throttler.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/throttler/throttler.module.ts) | Enables rate limiting using throttling in the Nest.js architecture. Implements a module that restricts API requests to 10 per minute using a time-to-live of 60 seconds. |

</details>

<details closed><summary>src.security.auth</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                                                       |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                                                           |
| [auth.controller.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/auth.controller.ts)           | User signup, login, password update, token generation, refresh, and logout. Utilizes services for business logic and token operations, with access control through guards.                                                                                                    |
| [auth.controller.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/auth.controller.spec.ts) | Tests methods for user authentication and authorization, ensuring correct service calls and parameter handling. Facilitates seamless user authentication flow within the NestJS framework.                                                                                    |
| [auth.service.spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/auth.service.spec.ts)       | Implements user authentication and session management. Features signup, login, password update, and logout functionalities. Ensures secure user interactions and cookie handling within the NestJS projects security module.                                                  |
| [auth.service.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/auth.service.ts)                 | Signup, login, password updates, and logout operations. Handles hashing passwords, JWT token generation, cookie management, and token invalidation. Collaborates with user, cart, encryption, token, and cookie services to support secure user interactions.                 |
| [auth.module.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/auth.module.ts)                   | Defines an AuthModule for managing authentication processes. Imports services for user validation, token management, encryption, and Redis interaction. Registers controllers for authentication operations and relevant service providers for user and cart functionalities. |

</details>

<details closed><summary>src.security.auth.dto</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                  |
| ---                                                                                                                            | ---                                                                                                                                                                                                      |
| [signup.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/dto/signup.dto.ts)                   | Defines a DTO class for user sign-up, enforcing data validation rules like email format, strong passwords, and optional user roles. Integrates with the common directory for user roles.                 |
| [login.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/dto/login.dto.ts)                     | Defines login DTO with email and password validation for secure authentication handling in NestJS application.                                                                                           |
| [refresh-token.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/dto/refresh-token.dto.ts)     | Defines `RefreshTokenDto` class with a mandatory `refreshToken` field, validated via class-validator in the `src/security/auth/dto` directory.                                                           |
| [update-password.dto.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/dto/update-password.dto.ts) | Defines strict password update requirements for user authentication, enforcing strong password validation. Stored in the security module, this DTO ensures secure password management in the NestJS app. |

</details>

<details closed><summary>src.security.auth.strategies</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                      |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                          |
| [access-token.strategy.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/src/security/auth/strategies/access-token.strategy.ts) | Validates JWT tokens for user authentication. Extracts token from the Auth Header, verifies integrity, and expiry. Finds the associated User object and rejects invalid tokens. Maintains user authentication flow securely. |

</details>

<details closed><summary>test</summary>

| File                                                                                            | Summary                                                                                                                                                                                                          |
| ---                                                                                             | ---                                                                                                                                                                                                              |
| [app.e2e-spec.ts](https://github.com/Binary-Blade/nest-jo.git/blob/master/test/app.e2e-spec.ts) | Verifies the API endpoints functionality by creating a NestJS testing module and conducting end-to-end testing using Supertest to ensure the GET / route returns a Hello World! message with a 200 status code.  |
| [jest-e2e.json](https://github.com/Binary-Blade/nest-jo.git/blob/master/test/jest-e2e.json)     | Configures Jest for end-to-end testing in the parent repository. Manages file extensions, test environment, and transformation rules for TypeScript files. Facilitates seamless testing of Nest.js applications. |

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
> $ git clone https://github.com/Binary-Blade/nest-jo.git
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

- **[Report Issues](https://github.com/Binary-Blade/nest-jo.git/issues)**: Submit bugs found or log feature requests for the `nest-jo` project.
- **[Submit Pull Requests](https://github.com/Binary-Blade/nest-jo.git/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github.com/Binary-Blade/nest-jo.git/discussions)**: Share your insights, provide feedback, or ask questions.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Binary-Blade/nest-jo.git
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
   <a href="https://github.com{/Binary-Blade/nest-jo.git/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Binary-Blade/nest-jo.git">
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
