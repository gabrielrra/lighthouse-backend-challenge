# Lighthouse Backend Challenge

A Node.js REST API for a simple checkout system that calculates the total price of a cart based on the products and discounts applied.

The database chosen for this project is SQLite, which is a lightweight, serverless, and self-contained database engine. SQLite is ideal for small to medium-sized applications and is a good choice for this project.

> In production, a more robust database like PostgreSQL or MySQL would be recommended.

To interact with the database the project uses Drizzle, a lightweight ORM that provides a simple and intuitive API.

## Project Structure

To provide extensibility and maintainability, the project is structured into separate folders for controllers, services, routes, and validators. This separation of concerns makes it easier to manage and scale the project.

Separating the routes by version allows for better API versioning and maintenance. This structure makes it easier to add new versions or deprecate old ones without affecting the entire codebase.

```
|-- src: The source code of the project.
  |-- controllers: The route controllers.
  |-- db: The database configuration, migrations and drizzle schema.
  |-- middlewares: Custom middleware functions.
  |-- routes: The route definitions separated by version.
    |-- v1: API version 1 routes.
  |-- services: The business logic.
  |-- tests: Test files and fixtures.
  |-- utils: Utility functions.
  |-- validators: Request validation schemas (zod).
```

## Setup

Before running the project, set the env vars, install the libraries and initialize the database:

```bash
# copy the .env.example file to .env
cp .env.example .env
npm install
npm run db:migrate && npm run db:seed
```

## Running the Project

You can run the project using **Docker Compose** (recommended) or directly using **Node.js**.

### Using Docker Compose (Recommended)

```bash
docker-compose up
```

### Running Directly with Node.js

```bash
npm install
npm run dev  # Development mode

# For production
npm run build && npm start
```

## API Endpoints

You can explore the API using Swagger UI by visiting `http://localhost:3000/`.

You can also use any http client like `curl` or `Postman` to interact with the following endpoints:

### Products

#### List All Products

- **GET** `/product` - Retrieves a paginated list of products.
- **Query Parameters:**
  - `page` (optional) - Page number
  - `limit` (optional) - Items per page

**Example:**

```bash
# List all products
curl http://localhost:3000/api/v1/product

# With pagination
curl http://localhost:3000/api/v1/product?page=1&limit=10
```

#### Get Product by SKU

- **GET** `/product/:sku` - Retrieves a product by its SKU.
- **URL Parameters:**
  - `sku` - The product SKU.

**Example:**

```bash
curl http://localhost:3000/api/v1/product/GR1
```

### Cart

#### Checkout

- **POST** `/cart/checkout` - Processes a cart checkout.
- **Request Body:** Array of products with SKU and quantity.
- **Constraints:**
  - The cart must contain at least **1** and at most **1000** products.
  - `sku` cannot be empty.
  - `quantity` must be a positive number.

**Example:**

```json
{
  "body": [{ "sku": "product-sku", "quantity": 1 }]
}
```

**cURL Request:**

```bash
curl -X POST http://localhost:3000/api/v1/cart/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "body": [
      { "sku": "GR1", "quantity": 2 },
      { "sku": "SR1", "quantity": 3 }
    ]
  }'
```

## Testing

Vitest is used for integration testing. The tests create a temporary SQLite database file, which is removed after execution.

### Running Tests

```bash
npm install
npm test
```

## Notes

- A product can be associated with multiple discounts but only the highest discount will be applied at checkout.
- There are only 3 types of discounts available: `BUY_X_PAY_Y`, `BUNDLE`, and `BULK_DISCOUNT`.
  - BUY_X_PAY_Y: Buy X units of a product and pay for Y units.
  - BUNDLE: Buy X units of a product and get Y units of another product for free.
  - BULK_DISCOUNT: Buy at least X units of a product and get a percent discount on each unit.
- There are no routes for creating, updating, or deleting products or discounts. These operations can only be done directly on the database.
- If you need to quickly explore the database you can run the command `npx drizzle-kit studio` to open an UI in your browser.

## Improvements

- **Testing Enhancements:**

  - Replace the SQLite test database with a Dockerized database using `docker-compose` for better isolation.
  - Implement test coverage reporting.

- **Security Enhancements:**

  - Remove Swagger Explorer in production.
  - Implement authentication.

- **Cart saving:**

  - It would be a good idea to save cart on db for later use.

- **Performance Optimizations:**
  - Introduce caching mechanisms for frequently accessed product data.
  - Use nginx as a reverse proxy to handle incoming requests and distribute them to different instances of the application (Load balancing).
    - OR use NodeJs cluster module to take advantage of multi-core systems.
