# Lighthouse Backend Challenge

## Overview

- A product can be associated with multiple sales.
- If a product has multiple sales, only the highest discount will be applied.
- A sale applies to a single product and can either discount the same product or another product.

## Setup

Before running the project, set the env vars, install the libraries and initialize the database:

```bash
# copy the .env.example file to .env
cp .env.example .env
npm install
npm run db:migrate && npm run db:seed
```

## Discount Types

### BUY_X_PAY_Y

Buy **X** units of `source_product_sku` and pay for **Y** units of `target_product_sku`.

- `source_product_sku` and `target_product_sku` must be the same.
- **X** = `source_product_units`
- **Y** = `source_product_units - discount_unit`

### BUNDLE

Buy **source_product_units** units of `source_product_sku` and receive **discount_unit** units of `target_product_sku` for free.

### BULK_DISCOUNT

Buy **at least** `source_product_units` units of `source_product_sku` and receive a `discount_percentage` discount on each unit of `source_product_sku`.

## API Documentation (Swagger)

In a production environment, exposing a Swagger Explorer route without proper security (e.g., VPN) is not recommended. However, for this assessment, it has been included for easier API usage.

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

## Testing

Vitest is used for integration testing. The tests create a temporary SQLite database file, which is removed after execution.

### Running Tests

```bash
npm install
npm test
```

## API Endpoints

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

## Improvements

- **Testing Enhancements:**

  - Replace the SQLite test database with a Dockerized database using `docker-compose` for better isolation.
  - Implement test coverage reporting.

- **Security Enhancements:**

  - Protect the Swagger API Explorer with authentication or VPN.
  - Implement role-based access control (RBAC) for endpoints.

- **Performance Optimizations:**
  - Introduce caching mechanisms for frequently accessed product data.
  - Optimize database queries to improve response times.

This improved documentation provides clearer structure, improved readability, and separates future improvements into a dedicated section.
