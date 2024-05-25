<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a8/NestJS.svg" width="100" alt="project-logo">
</p>
<p align="center">
    <h1 align="center">NEST-JO</h1>
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

Nest-Jo is a robust open-source project aimed at simplifying and optimizing the development and deployment processes for NestJS applications within a containerized environment. The project leverages Docker for seamless orchestration of services like NestJS, PostgreSQL, and Redis, enhancing communication and data persistence. With optimized TypeScript build configurations and tailored Docker setups for both development and production environments, Nest-Jo streamlines the build efficiency, maintains code scalability, and ensures secure deployment of NestJS applications. By providing clear structures, compiler options, and efficient Docker containers, Nest-Jo proves to be a valuable tool for developers seeking a hassle-free and organized approach to NestJS application development and deployment.

---

##  Features

|    |   Feature         | Description |
|----|-------------------|---------------------------------------------------------------|
| ⚙️  | **Architecture**  | Nest-jo follows a modular architecture based on NestJS framework, enhancing maintainability and scalability. Utilizes Docker for containerization, optimizing development and deployment workflows. |
| 🔩 | **Code Quality**  | The codebase maintains high quality with TypeScript for type safety, eslint for linting, and Prettier for code formatting. Follows consistent style guidelines and leverages decorators for cleaner code. |
| 📄 | **Documentation** | Documentation is extensive, covering setup instructions, API endpoints, and codebase structure. Utilizes Compodoc for generating API documentation, ensuring clear understanding for developers. |
| 🔌 | **Integrations**  | Key integrations include @nestjs/typeorm for database interactions, passport-local and passport-jwt for authentication, and Swagger for API documentation. Integrates Redis for caching data efficiently. |
| 🧩 | **Modularity**    | The codebase exhibits high modularity with reusable modules and services. Utilizes decorators for dependency injection, promoting code reusability and separation of concerns. Enhances maintainability and flexibility. |
| 🧪 | **Testing**       | Testing is comprehensive with Jest and Supertest for API testing. Employs ts-jest for TypeScript support in Jest. Includes unit tests for functions and integration tests for endpoints. |
| ⚡️  | **Performance**   | Performance is optimized through efficient database queries with TypeORM, caching with Redis, and rate limiting with express-rate-limit. Utilizes argon2 for secure password hashing, enhancing security without compromising speed. |
| 🛡️ | **Security**      | Implements security measures such as CSRF protection, CORS policies, and helmet for HTTP header protection. Utilizes JWT for secure authentication and authorization, guarding against unauthorized access. |
| 📦 | **Dependencies**  | Key dependencies include TypeORM for database management, NestJS for application framework, and winston for logging. Utilizes Docker and docker-compose to streamline development environments. |

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

| File                                                                                                           | Summary                                                                                                                                                                                                                                                             |
| ---                                                                                                            | ---                                                                                                                                                                                                                                                                 |
| [tsconfig.build.json](https://github.com/Binary-Blade/nest-jo/blob/master/tsconfig.build.json)                 | Optimize TypeScript build configuration to exclude unnecessary files for compilation, enhancing build efficiency and focusing on relevant source code.                                                                                                              |
| [docker-compose.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.yml)                   | Orchestrates services for NestJS, PostgreSQL, and Redis in a Docker environment. Defines networks, volumes, and dependencies to ensure seamless communication and data persistence. Supports efficient development by mapping local directories to container paths. |
| [docker-compose.override.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.override.yml) | Server with a custom image on port 3000, Postgres with defined environment variables, and Redis with a specific command and password. Settings help orchestrate development services.                                                                               |
| [Dockerfile](https://github.com/Binary-Blade/nest-jo/blob/master/Dockerfile)                                   | Sets base image to Alpine, installs dependencies with pnpm, builds app, prunes dev dependencies, and prepares production environment with built files. Configures entry point and user settings.                                                                    |
| [nest-cli.json](https://github.com/Binary-Blade/nest-jo/blob/master/nest-cli.json)                             | Defines project structure and compiler options for NestJS. Specifies source root and deletes the output directory. Enhances project organization and compilation efficiency.                                                                                        |
| [docker-compose.prod.yml](https://github.com/Binary-Blade/nest-jo/blob/master/docker-compose.prod.yml)         | Orchestrates production environment for NestJS server, PostgreSQL, and Redis cache.-Configures Docker containers, network, environment variables, and persistent volumes.-Facilitates secure communication and data storage between services.                       |
| [tsconfig.json](https://github.com/Binary-Blade/nest-jo/blob/master/tsconfig.json)                             | Defines paths for module resolution and configuration settings to build a Nest.js application with proper module organization and TypeScript compilation.                                                                                                           |
| [package.json](https://github.com/Binary-Blade/nest-jo/blob/master/package.json)                               | Orchestrates project scripts for building, testing, and running the NestJS application. Manages linting, formatting, and database migrations using TypeORM. Dependencies ensure robustness, security, and expressiveness of the project.                            |
| [Makefile](https://github.com/Binary-Blade/nest-jo/blob/master/Makefile)                                       | Manages database migrations, testing, and Docker operations for development and production environments. Enables creating, running, and reverting migrations, running tests, interacting with Redis, and managing Docker containers.                                |

</details>

<details closed><summary>src</summary>

| File                                                                                   | Summary                                                                                                                                                                                                                                                                              |
| ---                                                                                    | ---                                                                                                                                                                                                                                                                                  |
| [main.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/main.ts)             | Initiates** NestJS application with custom logger, CORS config, database migrations, cookies parsing, security headers, and environment logging. Applies global pipes, filters, and interceptors. Listens on defined port.                                                           |
| [type.d.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/type.d.ts)         | Enhances Express Request interface to include a user property linked to the User entity, facilitating TypeScript recognition.                                                                                                                                                        |
| [app.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/app.module.ts) | Defines root module with components for configuration, database, Redis, authentication, user, events, cart, payment, ticket, reservation, and transaction management, along with request throttling. Orchestrates modules for key application functionalities within NestJS project. |

</details>

<details closed><summary>src.libs.payment</summary>

| File                                                                                                                    | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                                     | ---                                                                                                                                                                                                                                                                         |
| [payment.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.module.ts)             | Orchestrates payment operations by connecting user data. Imports modules for booking, transactions, and tickets, vital for payment services, ensuring smooth processing within the NestJS application architecture.                                                         |
| [payment.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.service.spec.ts) | Tests PaymentServices processPayment method based on cart total, generating payment results for different scenarios defined by status and detail messages. Enhances validation and accuracy of payment processing functionality within the repositorys NestJS architecture. |
| [payment.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/libs/payment/payment.service.ts)           | Handles payment processing based on a carts total amount, determining approval or rejection using a defined success rate.                                                                                                                                                   |

</details>

<details closed><summary>src.common.enums</summary>

| File                                                                                                                          | Summary                                                                                                                                                                           |
| ---                                                                                                                           | ---                                                                                                                                                                               |
| [sort-order.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/sort-order.enum.ts)                 | Defines sort order options with ASC and DESC values for modular, readable code in the repository architecture, enhancing the data sorting functionality.                          |
| [user-role.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/user-role.enum.ts)                   | Enum with standard and admin roles for user authorization. Located in the enums directory within the source code.                                                                 |
| [status-reservation.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/status-reservation.enum.ts) | Defines reservation status options, such as APPROVED and REJECTED, using an enum in the src/common directory.                                                                     |
| [category-type.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/category-type.enum.ts)           | Defines event category types. Categorizes sports events such as Archery, Athletics, and more. Crucial for structuring and categorizing data in the Nest.js projects architecture. |
| [price-formula.enum.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/enums/price-formula.enum.ts)           | Defines price formulas enum for different user groups to streamline pricing logic in the repositorys architecture.                                                                |

</details>

<details closed><summary>src.common.decorators</summary>

| File                                                                                                                   | Summary                                                                                                                                                                                                                                                                                |
| ---                                                                                                                    | ---                                                                                                                                                                                                                                                                                    |
| [user-id.decorator.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/decorators/user-id.decorator.ts) | Extracts user ID from the request in a Nest.js apps route handler. It helps access user data securely without direct request object manipulation, enhancing application security.                                                                                                      |
| [role.decorator.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/decorators/role.decorator.ts)       | Enables defining user roles for route handlers in the Nest.js architecture. Uses `ROLE_KEY` constant to store role metadata. `Role` decorator assigns specified user roles. Supports maintaining clean and secure role-based access control within the applications common decorators. |

</details>

<details closed><summary>src.common.exceptions</summary>

| File                                                                                                                                           | Summary                                                                                                                                                                                                                                                                              |
| ---                                                                                                                                            | ---                                                                                                                                                                                                                                                                                  |
| [invalid-credentials.exception.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/exceptions/invalid-credentials.exception.ts) | Defines a custom exception class for invalid login credentials, inheriting from NestJSs HttpException. Handles unauthorized access with a clear error message. Crucial for maintaining codebase integrity and enhancing user experience within the Nest-JO repositorys architecture. |

</details>

<details closed><summary>src.common.globals-filter</summary>

| File                                                                                                                                           | Summary                                                                                                                                                                                                                                                               |
| ---                                                                                                                                            | ---                                                                                                                                                                                                                                                                   |
| [http-exceptions-filter.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/globals-filter/http-exceptions-filter.spec.ts) | Implements HTTP exception handling for logging and formatting error responses in different environments. Logs error details and returns specific messages based on environment settings.                                                                              |
| [http-exceptions-filter.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/globals-filter/http-exceptions-filter.ts)           | Handles HTTP exceptions by providing custom error response messages. Determines if the exception is a BadRequestException to extract detailed errors. Constructs error response with timestamp, message, and optional debugging info for non-production environments. |

</details>

<details closed><summary>src.common.dto</summary>

| File                                                                                                      | Summary                                                                                                                                                                                                   |
| ---                                                                                                       | ---                                                                                                                                                                                                       |
| [pagination.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/dto/pagination.dto.ts) | Limit, offset, sortBy, sortOrder, filterBy, and filterValue. Utilizes class-validator for input validation. Integral to handling data retrieval and query customization within the projects architecture. |
| [id.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/dto/id.dto.ts)                 | Validates and ensures positive integer IDs using class-validator in DTO. Essential for robust data validation in the Nest-jo repository architecture.                                                     |

</details>

<details closed><summary>src.common.interfaces</summary>

| File                                                                                                                                   | Summary                                                                                                                                                                                                                                                                                  |
| ---                                                                                                                                    | ---                                                                                                                                                                                                                                                                                      |
| [token.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/token.interface.ts)                     | Defines token configuration interface with secret keys and expiration times for access and refresh tokens, crucial for managing authentication within the NestJS applications security module. Influences token handling and enhances security by encapsulating essential token details. |
| [payment.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/payment.interface.ts)                 | Defines payment result and process response interfaces for reservation status handling in the booking system. It specifies payment status, details, and optional payment identifiers and reservations associated with the payment process.                                               |
| [key-value-redis.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/key-value-redis.interface.ts) | Defines KeyValuePairs interface for a collection of key-value pairs in the parent repositorys architecture. It allows the use of any type as values, aiding in data management within the system.                                                                                        |
| [payload.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/payload.interface.ts)                 | Defines JWT payload structure with user ID, role, and token version for authentication in the repository.                                                                                                                                                                                |
| [jwt.interface.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/interfaces/jwt.interface.ts)                         | Defines interfaces for JWT payload and tokens in the Nest-JO repository, facilitating secure authentication and authorization mechanisms.                                                                                                                                                |

</details>

<details closed><summary>src.common.logger</summary>

| File                                                                                                           | Summary                                                                                                                                                                                                                                          |
| ---                                                                                                            | ---                                                                                                                                                                                                                                              |
| [winston.config.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/logger/winston.config.ts)   | Configures Winston logger for different environments and output formats, adjusting logging level dynamically. Integrates file and console transports, with JSON and colorized formats, enhancing logging capabilities in the Nest JS repository. |
| [winston.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/common/logger/winston.service.ts) | Implements** logging with Winston for the repository. **Logs** info, error, warn, debug, and verbose messages. **Enhances** centralized logging and debugging capabilities for the project architecture.                                         |

</details>

<details closed><summary>src.modules</summary>

| File                                                                                                 | Summary                                                                                                                                                                                               |
| ---                                                                                                  | ---                                                                                                                                                                                                   |
| [commom.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/commom.module.ts) | Defines a global module aggregating essential services, including user management, data encryption, payments, and Redis operations. Enables seamless access to these services across the application. |

</details>

<details closed><summary>src.modules.reservation-details</summary>

| File                                                                                                                                                           | Summary                                                                                                                                                                                                                                                                      |
| ---                                                                                                                                                            | ---                                                                                                                                                                                                                                                                          |
| [reservation-details.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.module.ts)             | Implements a module for managing reservation details in Nest.js by importing relevant modules and entities, solely focusing on providing the ReservationDetailsService as a provider within the applications architecture.                                                   |
| [reservation-details.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.service.ts)           | Manages reservation details creation and retrieval within the repository structure. Creates reservation details from reservation and cart items, ensuring event and reservation existence. Allows finding reservation details by ID with related event and reservation data. |
| [reservation-details.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/reservation-details.service.spec.ts) | Implements reservation details creation, retrieval, handles missing events, and throws NotFoundException if needed. Uses repositories for data access. Maintains atomic operations while ensuring accurate reservations from cart items.                                     |

</details>

<details closed><summary>src.modules.reservation-details.entities</summary>

| File                                                                                                                                                        | Summary                                                                                                                                                                                                                                                                          |
| ---                                                                                                                                                         | ---                                                                                                                                                                                                                                                                              |
| [reservation-details.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/entities/reservation-details.entity.ts) | Defines reservation details entity with associations to reservation and event, including price formula, title, price, description, creation and update timestamps. Centralizes reservation data structure within the NestJS architecture for efficient management and retrieval. |

</details>

<details closed><summary>src.modules.reservation-details.dto</summary>

| File                                                                                                                                                           | Summary                                                                                                                                                                                                          |
| ---                                                                                                                                                            | ---                                                                                                                                                                                                              |
| [create-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/dto/create-reservation-details.dto.ts) | Defines a DTO for creating reservation details, ensuring data integrity and validation. Implements class-validator for robust input validation.                                                                  |
| [update-reservation-details.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservation-details/dto/update-reservation-details.dto.ts) | Defines UpdateReservationDetailsDto for reservation details updating, extending CreateReservationDetailsDto with optional properties. Part of the reservation-details module in nest-jo repository architecture. |

</details>

<details closed><summary>src.modules.users</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                                  |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                      |
| [users.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.controller.spec.ts) | Tests user-related operations with pagination, filtering, updates, and deactivation. Validates user retrieval, updating, deactivation, and error handling. Essential for ensuring correct user management functionality within the NestJS application.                   |
| [users.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.module.ts)                   | Defines a module for user management within the NestJS application. Imports necessary entities and services, registers related controllers, providers, and authentication strategy. Facilitates user-related functionality within the applications modular architecture. |
| [users.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.service.ts)                 | Manages user data retrieval, updates, and deactivation with error handling. Utilizes query options for pagination and filtering within the NestJS architecture, facilitating smooth user management operations.                                                          |
| [users.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.service.spec.ts)       | Validates, retrieves, updates, and deactivates users via the `UsersService`.-Employs pagination, filtering, and error handling for user data operations.-Utilizes `User` entity repository and `QueryHelperService`.                                                     |
| [users.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/users.controller.ts)           | Retrieves all users with filtering, finds a single user, updates user information, and deactivates users. Implements role-based access control using guards for varying user permissions within the NestJS applications architecture.                                    |

</details>

<details closed><summary>src.modules.users.entities</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                   |
| ---                                                                                                             | ---                                                                                                                                                                                                                                       |
| [user.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/entities/user.entity.ts) | Email, names, role, activity status, and transaction details. Represents relationships with Cart, Reservations, and Transactions. Tracks creation and login timestamps. Enforces data privacy by excluding sensitive fields in responses. |

</details>

<details closed><summary>src.modules.users.dto</summary>

| File                                                                                                               | Summary                                                                                                                                                                                                     |
| ---                                                                                                                | ---                                                                                                                                                                                                         |
| [update-user.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/update-user.dto.ts) | Defines an UpdateUserDto class extending CreateUserDto for user updating. Marks all properties as optional. Fulfills the DTO pattern in the users module of the Nest.js framework.                          |
| [index.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/index.ts)                     | Exports user data transfer objects for creating and updating users within the users module.                                                                                                                 |
| [create-user.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/users/dto/create-user.dto.ts) | Defines a DTO for creating users, enforcing validation rules on user data and role assignment. This module enhances the codebase by ensuring data integrity and consistency during user creation processes. |

</details>

<details closed><summary>src.modules.cart-items</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                  |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                      |
| [cart-items.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.module.ts)                   | Defines a cart items module handling entities like CartItem, Event, and ReservationDetails. Integrates Controllers and Services, imports related modules, and provides essential functionalities for managing cart items within the NestJS architecture. |
| [cart-items.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.service.ts)                 | Manages cart items by adding, updating, and removing them from carts. Ensures quantity availability and handles price calculations. Integrates with cart, event, and pricing services for a seamless shopping experience.                                |
| [cart-items.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.controller.ts)           | Manages cart items with endpoints for adding, retrieving, updating, and removing items in a users cart. Implements authorization checks using guards. Works seamlessly with the parent repositorys modular structure for efficient cart management.      |
| [cart-items.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.service.spec.ts)       | Adds, updates, removes, finds cart items. Handles exceptions elegantly for missing items or unavailable quantities. Collaborates with carts and events services to ensure smooth cart operations.                                                        |
| [cart-items.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/cart-items.controller.spec.ts) | Create, fetch, update, remove. Handles user authorization and returns detailed exceptions when needed. Interacts with CartItemsService for seamless cart item operations within the repositorys Nest.js architecture.                                    |

</details>

<details closed><summary>src.modules.cart-items.entities</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                                                                |
| ---                                                                                                                            | ---                                                                                                                                                                                                                                                                    |
| [cartitems.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/entities/cartitems.entity.ts) | Defines shopping cart item entity with relationships to cart, event, reservations. It includes fields for price, quantity, timestamps, and a pricing formula enum. This entity encapsulates crucial data for managing cart items within the wider application context. |

</details>

<details closed><summary>src.modules.cart-items.dto</summary>

| File                                                                                                                              | Summary                                                                                                                                                                                                                                |
| ---                                                                                                                               | ---                                                                                                                                                                                                                                    |
| [create-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/dto/create-cart-item.dto.ts) | Defines DTO for creating a cart item with user and event IDs, quantity, and price formula validation using class-validator. It enforces data integrity for adding items to the shopping cart within the NestJS e-commerce application. |
| [update-cart-item.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/cart-items/dto/update-cart-item.dto.ts) | Defines DTO for cart item updates, extending CreateCartItemDto with optional properties. Key to managing cart items in the nest-jo repositorys modular architecture.                                                                   |

</details>

<details closed><summary>src.modules.reservations</summary>

| File                                                                                                                                                          | Summary                                                                                                                                                                                                                                                                                   |
| ---                                                                                                                                                           | ---                                                                                                                                                                                                                                                                                       |
| [reservations-processor.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations-processor.service.spec.ts) | Processes user reservations including payment, ticket generation, and cleanup. Utilizes various services to manage cart items, transactions, and reservations. Implements steps such as creating, finalizing bookings, and preventing duplicates to ensure smooth reservation handling.   |
| [reservations.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.controller.spec.ts)               | Create, find all,find all admin, and find one. Mocks service responses for successful, unauthorized, and non-existent scenarios. Ensures correct service method calls with user and reservation IDs, pagination.                                                                          |
| [reservations.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.service.spec.ts)                     | Defines a service handling reservation operations in the Nest.js project. Implements functionality to generate, find, save reservations and provides admin-specific functions. Critical features include user-specific operations and error handling for seamless reservation management. |
| [reservations-processor.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations-processor.service.ts)           | Processes user reservations, creates bookings, prevents duplicates, and cleans up post-payment in the repositorys architecture. Manages transactions, payments, events, and users seamlessly.                                                                                             |
| [reservations.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.service.ts)                               | Processes user reservations, retrieves, saves, and finds reservations by user ID or admin. Handles pagination and filtering. Ensures accurate reservation data retrieval with user-specific and admin-specific fields.                                                                    |
| [reservations.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.module.ts)                                 | Defines a module managing reservations, including controllers, services, and entities like Reservation and Event. Imports related modules, registers controllers and services, and exports Reservation-related services for the parent repositorys architecture.                          |
| [reservations.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/reservations.controller.ts)                         | Manages reservations, handles creation, retrieval, and filtering for users and admins. Utilizes guards for authorization. Key features include create, find-all, find-all-admin, find-all-data, and findOne reservation functions.                                                        |

</details>

<details closed><summary>src.modules.reservations.entities</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                   |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                       |
| [reservation.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/entities/reservation.entity.ts) | Defines entities for reservations, linking to user, details, transaction, cart item, and ticket. Tracks creation and update timestamps. Key part of the repositorys module structure for managing reservation-related data in the system. |

</details>

<details closed><summary>src.modules.reservations.dto</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                                          |
| ---                                                                                                                                     | ---                                                                                                                                                                                              |
| [create-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/dto/create-reservation.dto.ts) | Defines a DTO for reservation creation, validating user, cart item, total price, and payment ID. Essential for ensuring data integrity and user input correctness within the reservation module. |
| [update-reservation.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/reservations/dto/update-reservation.dto.ts) | Defines an update reservation DTO with optional properties, extending the create reservation DTO for the Nest-JO repositorys reservations module.                                                |

</details>

<details closed><summary>src.modules.events</summary>

| File                                                                                                                                | Summary                                                                                                                                                                                                                                                     |
| ---                                                                                                                                 | ---                                                                                                                                                                                                                                                         |
| [events.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.controller.ts)                 | Manages event creation, retrieval, update, and deletion with access control. Handles event pricing calculation based on specified formulas. Facilitates filtering and pagination of events.                                                                 |
| [event-prices.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-prices.service.ts)           | Creates, updates, retrieves, deletes prices based on formulas. Computes prices from base price and multipliers. Offers error handling for events and prices not found.                                                                                      |
| [events.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.service.spec.ts)             | Creates, finds, updates, and removes events, ensuring data integrity. Handles conflicts and errors gracefully. Improves search efficiency by filtering events. Caches event data for quick access.                                                          |
| [events.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.service.ts)                       | Creates, retrieves, updates, and deletes events. Includes methods to ensure title uniqueness, handle pagination and filtering, and interact with Redis cache for efficient data retrieval.                                                                  |
| [events.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.module.ts)                         | Defines an event management module within the repository. Manages events data using TypeORM. Provides services for handling events, event prices, and sales. Exports services for broader application usage.                                                |
| [event-sales.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-sales.service.ts)             | Manages event sales and revenue by processing ticket purchases, updating revenue, and deducting ticket quantities. Offers methods to update revenue for specific events, deduct ticket quantities, and determine deduction factors based on price formulas. |
| [events.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/events.controller.spec.ts)       | Implements tests for event CRUD operations, verifying correct service interactions in the NestJS app.                                                                                                                                                       |
| [event-sales.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-sales.service.spec.ts)   | Implements event ticket processing, revenue calculation, and quantity deduction. Utilizes mocked data for testing. Ensures accurate handling of ticket sales and revenue updates in the NestJS repositorys event-sales service.                             |
| [event-prices.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/event-prices.service.spec.ts) | Tests EventPricesService functionality in the NestJS app. Creates, retrieves, updates, and deletes event prices with validations. Handles events and prices using repositories and enforces necessary business logic.                                       |

</details>

<details closed><summary>src.modules.events.entities</summary>

| File                                                                                                                           | Summary                                                                                                                                                                                                                                          |
| ---                                                                                                                            | ---                                                                                                                                                                                                                                              |
| [event-price.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/entities/event-price.entity.ts) | Defines event pricing entity with relationships and attributes for the NestJS project. Handles event price details with associations to the event entity, including price formula selection and actual event pricing.                            |
| [event.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/entities/event.entity.ts)             | Defines Event entity with attributes like title, descriptions, pricing, dates, quantities, revenue, and relationships to prices, reservations, and cart items for efficient event management within the NestJS repositorys modular architecture. |

</details>

<details closed><summary>src.modules.events.dto</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                                       |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                                           |
| [update-event.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/dto/update-event.dto.ts) | Defines UpdateEventDto extending PartialType from create-event.dto for updating event data in the nest-jo repositorys events module.                                                                                                                          |
| [create-event.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/events/dto/create-event.dto.ts) | Validates and structures event creation data as a DTO. Enforces specific field requirements like title length, pricing, dates, and category type enum using class-validator. Essential for maintaining data integrity in the events module of the repository. |

</details>

<details closed><summary>src.modules.tickets</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                                          |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                                              |
| [tickets.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.service.ts)           | Manages ticket generation for approved reservations. Utilizes encryption, user, and reservation services. Generates tickets based on reservation status. Crucial for handling ticket creation in the overall application architecture.                                           |
| [tickets.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.module.ts)             | Defines a module handling tickets, creating reservations. Imports modules to manage transactions, users, and reservation details. Resolves circular dependencies using forwardRef. Exports TicketsService for use within the repository architecture.                            |
| [tickets.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/tickets.service.spec.ts) | Implements ticket generation for approved reservations and handles non-approved cases with appropriate exceptions.-Generates tickets for reservations with necessary user and reservation validations.-Creates new tickets with specific keys and QR codes for secure ticketing. |

</details>

<details closed><summary>src.modules.tickets.entities</summary>

| File                                                                                                                  | Summary                                                                                                                                     |
| ---                                                                                                                   | ---                                                                                                                                         |
| [ticket.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/tickets/entities/ticket.entity.ts) | Defines a Ticket entity linking to a Reservation. Enables unique identifiers and keys for ticket management within the reservations system. |

</details>

<details closed><summary>src.modules.transactions</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                                          |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                                              |
| [transactions.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.controller.spec.ts) | Tests TransactionsControllers findAll method, ensuring correct user transactions retrieval with specific filters and sorting. Mocks TransactionsServices findAll method to return expected results and checks the method calls.                                                  |
| [transactions.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.module.ts)                   | Defines a module managing transactions, with services for transactions, reservation details, and query handling. Imports entities from TypeORM and modules for reservations and tickets. Provides necessary controllers and services for transaction management.                 |
| [transactions.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.service.ts)                 | Manages transactions, creating and finding by reservation ID, and retrieving with pagination. Calculate cart total and select specific fields. Enhances the user experience through efficient handling of payment-related operations within the parent repositorys architecture. |
| [transactions.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.service.spec.ts)       | Create, find by ID, calculate total, and fetch all with pagination. Enhances user and cart interactions. Integrates with repository and query services for seamless data management within the repositorys NestJS architecture.                                                  |
| [transactions.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/transactions.controller.ts)           | Manages user transactions by retrieving filtered results with pagination. Uses `AccessTokenGuard` for security. Collaborates with `TransactionsService` to fetch and provide transaction data based on specified user ID and filtering criteria.                                 |

</details>

<details closed><summary>src.modules.transactions.entities</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                                                          |
| ---                                                                                                                                  | ---                                                                                                                                                                                                                                              |
| [transaction.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/entities/transaction.entity.ts) | Defines Transaction entity linking Users and Reservations, tracking payment status and amount. Facilitates creating and updating transactions with timestamps. Central to managing transaction-related data within the repositorys architecture. |

</details>

<details closed><summary>src.modules.transactions.dto</summary>

| File                                                                                                                                    | Summary                                                                                                                                                                                                                                                                     |
| ---                                                                                                                                     | ---                                                                                                                                                                                                                                                                         |
| [create-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/dto/create-transaction.dto.ts) | Defines CreateTransactionDto capturing transaction data for the Nest-jo repository. Orchestrates data transfer functionality within the transactions module architecture, facilitating seamless communication between various components.                                   |
| [update-transaction.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/transactions/dto/update-transaction.dto.ts) | Defines `UpdateTransactionDto` extending `PartialType` from `@nestjs/swagger`, inheriting properties from `CreateTransactionDto`. Located in `src/modules/transactions/dto`, it shapes data for updating transaction details in the NestJS architecture of the parent repo. |

</details>

<details closed><summary>src.modules.carts</summary>

| File                                                                                                                 | Summary                                                                                                                                                                                                    |
| ---                                                                                                                  | ---                                                                                                                                                                                                        |
| [carts.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.service.ts)           | Manages and interacts with users shopping carts in the Nest.js repository. Features include cart retrieval, creation, verification, saving, and deletion. Handles exceptions for cart not found scenarios. |
| [carts.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.service.spec.ts) | Finding, creating, verifying, saving, and deleting in the NestJS apps cart service with robust error handling for missing cart instances.                                                                  |
| [carts.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/carts.module.ts)             | Defines a module managing carts. Imports TypeOrmModule for Cart entity, registers CartsService as a provider, and exports CartsService for use across the application.                                     |

</details>

<details closed><summary>src.modules.carts.entities</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                  |
| ---                                                                                                             | ---                                                                                                                                                                                                      |
| [cart.entity.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/modules/carts/entities/cart.entity.ts) | Defines a shopping cart entity with user association and cart items. Records creation and last update timestamps. Central to managing user shopping activities in the applications modular architecture. |

</details>

<details closed><summary>src.database</summary>

| File                                                                                                            | Summary                                                                                                                                                                                                                                                                                        |
| ---                                                                                                             | ---                                                                                                                                                                                                                                                                                            |
| [typeorm-cli.config.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/typeorm-cli.config.ts) | Defines a TypeORM DataSource configuration for PostgreSQL in the NestJS project. Retrieves database connection details from environment variables using ConfigService. Specifies database connection settings like host, port, username, password, database name, entity, and migration paths. |
| [migration-runner.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migration-runner.ts)     | Executes database migrations for the Nest.js app using TypeORM. Logs initialization, migration execution, and handles failures gracefully. Integrated as a critical step in managing database schema changes within the repositorys architecture.                                              |
| [database.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/database.module.ts)       | Establishes database connection via TypeORM using PostgreSQL for the NestJS app. Dynamically loads config from env vars using ConfigService. Enables async configuration and defines entity paths for seamless integration.                                                                    |

</details>

<details closed><summary>src.database.redis</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                                                         |
| ---                                                                                                                   | ---                                                                                                                                                                                                                                             |
| [redis.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.service.ts)           | Handles Redis caching with set, get, delete operations, and fetching cached data. Implements safe JSON parsing and event-based cache clearing. Interacts seamlessly with the NestJS architecture for efficient data caching and retrieval.      |
| [redis.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.module.ts)             | Sets up Redis client and service using environment variables. Configures Redis client with host, port, and password. Encapsulates client creation logic with ConfigService access. Exportable for use across modules in the NestJS application. |
| [redis.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/redis/redis.service.spec.ts) | Storing, retrieving, and deleting data. Manages caching with TTL and handles cache misses elegantly. Ensures safe JSON parsing and error handling.                                                                                              |

</details>

<details closed><summary>src.database.migrations</summary>

| File                                                                                                                                                                         | Summary                                                                                                                                                                                                                                                                                            |
| ---                                                                                                                                                                          | ---                                                                                                                                                                                                                                                                                                |
| [1712751776641-CreateTableReservationDetails.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712751776641-CreateTableReservationDetails.ts) | Implements a migration that creates a reservation_details table for storing detailed reservation information, including event and pricing data. It ensures table creation only if not already existing and includes relationships with the events and reservations tables for database management. |
| [1712661230450-CreateTableCartItems.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230450-CreateTableCartItems.ts)                   | Manages database migration to create a table for storing cart items, cart references, event data, and pricing details. Ensures table creation and handles rollback.                                                                                                                                |
| [1712661230451-CreateTableReservations.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230451-CreateTableReservations.ts)             | Creates reservations table schema to store reservation details like user, cart item, transaction, reservation details, and ticket. Implements migration methods to set up and remove the table in a database using TypeORM.                                                                        |
| [1712717719010-CreateTableTickets.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712717719010-CreateTableTickets.ts)                       | Creates tickets table for storing ticket details with reservation and security references. Manages creation and removal of the table via up and down migrations. Incorporated in the application's database schema for ticket management.                                                          |
| [1712572717258-CreateTableEvents.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712572717258-CreateTableEvents.ts)                         | Creates events table schema for managing event details. Ensures a unique events table with columns for eventId, title, descriptions, pricing, dates. Utilizes Enum and QueryRunner for CRUD operations.                                                                                            |
| [1711085051379-CreateTableUsers.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1711085051379-CreateTableUsers.ts)                           | Implements user table creation with user details columns. Tables are created only if not existing, with role enum type check. The migration can create or drop the users table, facilitating user data management in the app.                                                                      |
| [1712661230452-CreateTableTransactions.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661230452-CreateTableTransactions.ts)             | Creates transactions table with user, payment info. Safeguards existing table, enum type. Drops table if needed. Enables managing transaction data.                                                                                                                                                |
| [1712661221574-CreateTableCarts.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712661221574-CreateTableCarts.ts)                           | Creates a cart table in the database to manage shopping cart information, user references, and timestamps for creation and updates. Includes methods to apply and revert the table creation.                                                                                                       |
| [1712642603000-CreateTableEventPrices.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712642603000-CreateTableEventPrices.ts)               | Defines a migration scheme to create an event_prices table, facilitating event pricing management. Ensures table existence, includes event ID, price formula, and price columns. Enables migration rollback by dropping the table.                                                                 |
| [1712751780000-AddForeignKey.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations/1712751780000-AddForeignKey.ts)                                 | Implements foreign key constraints for reservations and tickets tables, ensuring data integrity. Enables linking reservations to users, transactions, and tickets. Supports reverting changes if needed.                                                                                           |

</details>

<details closed><summary>src.database.migrations-test</summary>

| File                                                                                                                                                                                      | Summary                                                                                                                                                                                                                                                    |
| ---                                                                                                                                                                                       | ---                                                                                                                                                                                                                                                        |
| [add-foreign-key-constraints.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/add-foreign-key-constraints.migration.spec.ts)           | Implements foreign key constraints migration for reservations and tickets tables in the database. Ensures data integrity and consistency during database operations by adding or removing foreign key constraints based on the migration direction.        |
| [create-table-cart-items.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-cart-items.migration.spec.ts)                   | Implements migration tests for creating/dropping cart_items table. Verifies creation only if table doesn't exist, avoids duplicate creation. Validates proper table drop operation. Facilitates database schema evolution within the repository structure. |
| [create-table-reservation-details.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-reservation-details.migration.spec.ts) | Ensures creation of reservation_details table if absent, avoiding duplication checks. It relies on TypeORM and constants for migrations, enhancing database schema management in the NestJS architecture.                                                  |
| [create-table-reservations.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-reservations.migration.spec.ts)               | Implements migration to handle reservations table creation and deletion based on table existence status. Verifies table status before executing create or drop statements. Ensures database schema consistency during application lifecycle.               |
| [create-table-events.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-events.migration.spec.ts)                           | Implements migration tests for creating and dropping events table in the database. Verifies table creation based on existence, ensuring proper database schema management in the nest-jo repository.                                                       |
| [create-table-event-prices.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-event-prices.migration.spec.ts)               | Implements migrations to create/drop event_prices table based on existence. Verifies table creation and query execution. Maintains data integrity within the Nest.js backend architecture.                                                                 |
| [create-table-tickets.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-tickets.migration.spec.ts)                         | Implements migrations for creating and dropping a tickets table in the database. Verifies existence before creating. Part of the database module structure within the parent repository.                                                                   |
| [create-table-transactions.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-transactions.migration.spec.ts)               | Implements migration tests ensuring creation/dropping of transactions table based on existing state. Impacts database schema evolution, validating migration correctness and data integrity within repositorys architecture.                               |
| [create-table-carts.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-carts.migration.spec.ts)                             | Validates and performs database migrations for the cart table. Verifies table existence before creating, and drops the table on rollback. Enhances data integrity for the NestJS application.                                                              |
| [create-table-users.migration.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/migrations-test/create-table-users.migration.spec.ts)                             | Tests creation of users table existence and creation in the database using TypeORM migrations. Verifies up and down methods handle table creation and deletion correctly based on existing table state.                                                    |

</details>

<details closed><summary>src.database.query</summary>

| File                                                                                                                                | Summary                                                                                                                                                                                                                                                                                         |
| ---                                                                                                                                 | ---                                                                                                                                                                                                                                                                                             |
| [query-helper.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/query/query-helper.service.spec.ts) | Tests for QueryHelperService in nest-jo repository validate building query options, where conditions, and nested orders. They ensure accurate generation of queries based on provided criteria, contributing to the robustness and reliability of database interactions within the application. |
| [query-helper.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/database/query/query-helper.service.ts)           | Optimizes filtering and sorting operations for database queries in Nest.js by generating dynamic query options based on pagination data. This service helps streamline querying processes by constructing conditions for filtering, sorting, and pagination.                                    |

</details>

<details closed><summary>src.utils.constants</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                                                  |
| ---                                                                                                                          | ---                                                                                                                                                                                                                                      |
| [constants.env.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.env.ts)                 | Defines constants for node environment variables, aiding environment-specific logic in the parent repositorys architecture. Includes NODE_ENV, DEV_ENV, and PROD_ENV for distinguishing between development and production environments. |
| [constants.common.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.common.ts)           | Defines price formulas and default page sizes for entities in a Nest.js application. Implements formulas and multipliers for pricing, along with fixed page sizes for users, reservations, and events.                                   |
| [constants.migrationdb.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/constants/constants.migrationdb.ts) | Defines migration database enum types with values. Generates SQL commands to create enum types if they dont exist, ensuring data consistency. Key for managing database schema integrity in the NestJS projects architecture.            |

</details>

<details closed><summary>src.utils.services</summary>

| File                                                                                                                                  | Summary                                                                                                                                                                                                                                                                   |
| ---                                                                                                                                   | ---                                                                                                                                                                                                                                                                       |
| [convert-utils.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/services/convert-utils.service.spec.ts) | Tests ConvertUtilsService for accurate conversion of days to seconds and date strings to Date objects. Validates correct conversion and error handling, ensuring reliable utility functions align with the parent repositorys architecture.                               |
| [convert-utils.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/utils/services/convert-utils.service.ts)           | Convert Utils Service in src/utils handles conversions like days to seconds and date strings to Date objects. This service enriches the utility layer by providing essential functions for converting data formats seamlessly within the Nest-jo repository architecture. |

</details>

<details closed><summary>src.security.encryption</summary>

| File                                                                                                                                 | Summary                                                                                                                                                                                                           |
| ---                                                                                                                                  | ---                                                                                                                                                                                                               |
| [encryption.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/encryption/encryption.service.ts)           | Hashing passwords with Argon2, verifying hashed passwords, generating UUIDs, creating secure keys for users, and generating QR codes from secure keys. Complements user security within the Nest-jo architecture. |
| [encryption.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/encryption/encryption.service.spec.ts) | Tests encryption functions using argon2 for secure password hashing and verification. Part of the security module to ensure data security. Designed to hash and verify passwords to enhance user authentication.  |

</details>

<details closed><summary>src.security.guards</summary>

| File                                                                                                                         | Summary                                                                                                                                                                                                        |
| ---                                                                                                                          | ---                                                                                                                                                                                                            |
| [is-creator.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/is-creator.guard.ts)           | Enforces content creator ownership by verifying user identity against content ownership before allowing access to specified routes in the Nest.js application.                                                 |
| [index.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/index.ts)                                 | Provides role-based, creator, and access token guards for secure API access control in the security module. Supports granular permission handling to enforce security policies across the Nest.js application. |
| [role.guard.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/role.guard.spec.ts)             | Tests `RoleGuard` behavior based on user roles. Verifies access allowance or denial. Uses Nest.js testing utilities and reflector to validate role-based access control logic.                                 |
| [role.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/role.guard.ts)                       | Enables role-based access control in the Nest.js app. Determines if users can access routes based on their roles defined with decorators. Utilizes metadata and user roles to restrict or allow access.        |
| [is-creator.guard.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/is-creator.guard.spec.ts) | Confirms true if user ID matches content creator, throws NotFoundException otherwise, or when user is missing. Enhances app security by restricting access based on creator status.                            |
| [access-token.guard.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/guards/access-token.guard.ts)       | Secures routes with JWT access tokens. Inherits AuthGuard to protect routes in the NestJS architecture.                                                                                                        |

</details>

<details closed><summary>src.security.cookie</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                                                                     |
| [cookie.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/cookie/cookie.service.spec.ts) | Implements cookie management functions for extracting, setting, and clearing refresh tokens within the NestJS security module. Functions leverage ConfigService for settings and ConvertUtilsService for conversions, ensuring secure and efficient cookie handling in the application. |
| [cookie.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/cookie/cookie.service.ts)           | Manages HTTP cookies for handling user authentication. Extracts and sets refresh token cookies securely with configurable expiration. Ability to clear refresh token cookies for enhanced security.                                                                                     |

</details>

<details closed><summary>src.security.token</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                                                 |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                                                     |
| [token-management.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token-management.service.spec.ts)     | Implements TokenManagementService to handle token creation and verification with JwtService and ConfigService. It ensures secure generation of access and refresh tokens based on specified secrets and token expiration times.                                                         |
| [token.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token.service.ts)                                     | Manages JWT tokens and their operations. Generates tokens for users, refreshes tokens, and validates refresh tokens. Implements secure token handling and error responses within the repositorys security architecture.                                                                 |
| [refreshtoken-store.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/refreshtoken-store.service.spec.ts) | Tests storing, verifying, and removing refresh tokens in Redis for the NestJS applications security module. Mocks services and config for unit testing. Maintains secure token management within the broader application structure.                                                     |
| [refreshtoken-store.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/refreshtoken-store.service.ts)           | Stores tokens with TTL, verifies their validity, and removes expired tokens. Dependencies: RedisService for Redis interactions, ConvertUtilsService for value conversions, and ConfigService for configuration access.                                                                  |
| [token-management.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token-management.service.ts)               | Manages JWT tokens for creating, refreshing, and verifying tokens. Utilizes ConfigService for secrets and expiration times. Enhances security and authentication within the repositorys architecture.                                                                                   |
| [token.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/token/token.service.spec.ts)                           | Implements token handling logic for authentication and refresh token management. Validates, generates, and refreshes tokens, ensuring user access and security. Supports seamless token creation and storage in Redis for efficient authentication handling in the NestJS architecture. |

</details>

<details closed><summary>src.security.throttler</summary>

| File                                                                                                                  | Summary                                                                                                                                                                                                    |
| ---                                                                                                                   | ---                                                                                                                                                                                                        |
| [throttler.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/throttler/throttler.module.ts) | Enables rate limiting with a 10-requests-per-minute configuration, enhancing API security and performance. Integrated within the Nest-JO repositorys architecture to control incoming traffic effectively. |

</details>

<details closed><summary>src.security.auth</summary>

| File                                                                                                                     | Summary                                                                                                                                                                                                                                                                                |
| ---                                                                                                                      | ---                                                                                                                                                                                                                                                                                    |
| [auth.controller.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.controller.ts)           | Manages user authentication, including signup, login, password updates, access token generation, token refresh, logout, and user deletion. Interfaces with the AuthService and TokenService to provide these essential user-related operations securely.                               |
| [auth.controller.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.controller.spec.ts) | Creating user, logging in, updating password, getting refresh token, refreshing token, and logging out with appropriate service interactions for the nest-jo repositorys auth functionality.                                                                                           |
| [auth.service.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.service.spec.ts)       | Implements authentication logic for signing up, logging in, updating passwords, and logging out users. Interacts with user, encryption, token, cookie, cart, and refresh token services. Handles various exceptions like unauthorized access and invalid credentials.                  |
| [auth.service.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.service.ts)                 | Manages user authentication, registration, login, password updates, logout, and deletion. Utilizes user repositories, encryption, tokens, cookies, and refresh tokens for various operations in the Nest.js repositorys security and authentication context.                           |
| [auth.module.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/auth.module.ts)                   | Defines authentication module managing services and controllers for user authentication, utilizing TypeORM for user entity, alongside other services like JwtService and CookieService. Imports CartsModule and CommonModule for extended functionality within the NestJS application. |

</details>

<details closed><summary>src.security.auth.dto</summary>

| File                                                                                                                       | Summary                                                                                                                                                                                                                                                 |
| ---                                                                                                                        | ---                                                                                                                                                                                                                                                     |
| [signup.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/signup.dto.ts)                   | Defines SignUpDto for user registration with validation rules supporting first name, last name, email, password, and optional role using class-validator.                                                                                               |
| [login.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/login.dto.ts)                     | Defines a LoginDTO class with email and password fields for user login validation.                                                                                                                                                                      |
| [refresh-token.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/refresh-token.dto.ts)     | Defines DTO class for refreshing tokens with validation. Part of the security module in the Nest.js architecture.                                                                                                                                       |
| [update-password.dto.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/dto/update-password.dto.ts) | Defines UpdatePasswordDTO with old and new password fields, using class-validator to ensure they are non-empty strings and meet strong password criteria. This DTO facilitates secure user password updates within the NestJS projects security module. |

</details>

<details closed><summary>src.security.auth.strategies</summary>

| File                                                                                                                                            | Summary                                                                                                                                                                                                                                                                            |
| ---                                                                                                                                             | ---                                                                                                                                                                                                                                                                                |
| [access-token.strategy.spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/strategies/access-token.strategy.spec.ts) | Implements access token validation strategy using JWT for user authentication. Validates user existence and token version, throwing exceptions when needed.Integration with TypeORM and NestJS configuration services.                                                             |
| [access-token.strategy.ts](https://github.com/Binary-Blade/nest-jo/blob/master/src/security/auth/strategies/access-token.strategy.ts)           | Validates and authorizes access tokens using JWT for user authentication. Implements a Passport strategy to verify token validity, ensuring users exist and tokens match. Mapped to User repository and app configuration for seamless integration within the NestJS architecture. |

</details>

<details closed><summary>test</summary>

| File                                                                                        | Summary                                                                                                                                                                                                                    |
| ---                                                                                         | ---                                                                                                                                                                                                                        |
| [app.e2e-spec.ts](https://github.com/Binary-Blade/nest-jo/blob/master/test/app.e2e-spec.ts) | Verifies API endpoints by simulating HTTP requests using the NestJS testing framework. Initiates a testing module with the AppModule to validate the GET / route, ensuring a successful response and the expected message. |
| [jest-e2e.json](https://github.com/Binary-Blade/nest-jo/blob/master/test/jest-e2e.json)     | Configures Jest for end-to-end testing in the NestJS project. Specifies file extensions, test environment, test file matching regex, and transformation settings for TypeScript files.                                     |

</details>

---

##  Getting Started

**System Requirements:**

* **TypeScript**: `version x.y.z`
* **Docker & Docker Compose**
* **Nodejs**
* **Nestjs CLI**

## Installation
### 1. Clone the Git repository:
   ```sh
   git clone https://github.com/Binary-Blade/nest-jo
   cd nest-jo
   ```
### 2. Install backend dependencies:
   ```sh
   pnpm install
   ```
### 3. Configure environment variables:
Rename the **.development.env.example** and **.production.env.example** files to **.development.env** and **.production.env**, then update these files with your connection information.
#### Example configuration:
   ```env
    # POSTGRES Docker 
    PGHOST=dev-postgres-host
    PGPORT=5432
    PGDATABASE=dev_database
    PGUSER=dev_user
    PGPASSWORD=dev_password

    # Redis configuration
    REDIS_HOST=dev-redis-host
    REDIS_PORT=6379
    REDIS_PASSWORD=dev_redis_password

    # JWT Configuration
    JWT_ACCESS_TOKEN_SECRET=dev_access_token_secret
    JWT_ACCESS_TOKEN_EXPIRATION=20m
    JWT_REFRESH_TOKEN_SECRET=dev_refresh_token_secret
    JWT_REFRESH_TOKEN_EXPIRATION=30d

    # Server Configuration
    PORT=3000
    NODE_ENV=development

    # Frontend connection
    FRONTEND_URL=http://localhost:5173
   ```
### 4. Use Docker containers for development or production:
Using commands via Makefile
#### Development
   To start the containers in development mode:
   ```sh
   make dev
   ```
   To stop the development containers:
   ```sh
   make clean-d
   ```
#### Production
   To start the containers in production mode:
   ```sh
   make prod
   ```
   To stop the production containers:
   ```sh
   make clean-p
   ```
### 5. Run database migrations:
   - Create a new migration:
     ```sh
     make migrate-create
     ```
   - Run the migrations:
     ```sh
     make migrate-run
     ```
   - Revert the last migration:
     ```sh
     make migrate-revert
     ```
### 6. Run tests:

   - Unit tests:
     ```sh
     make test
     ```
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
