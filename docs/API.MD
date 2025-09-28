# API Reference — Ecommerce Webapp

This document provides a comprehensive overview of the REST API for the Ecommerce Webapp backend. It includes details about endpoints, request/response formats, authentication, error handling, and conventions. The API is organized by functional areas such as Authentication, Shop, and Admin.

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: The deployed backend URL or the value of the `FRONTEND_URL` environment variable.

---

## General Conventions

### Authentication
- The API uses cookies for session management and authentication. Ensure `cookie-parser` is configured, and CORS settings include `credentials: true`.
- **Cookie Name**: Refer to `server/controllers/AuthController.js` for the exact name.
- **Flags**: `HttpOnly`, `Secure` (in production), `SameSite`.

### Response Format
- All responses use `application/json` content type.
- **Success Response Structure**:
    ```json
    {
        "success": true,
        "data": { ... }
    }
    ```

### Error Responses
- Common HTTP status codes:
    - `200 OK`: Successful request.
    - `201 Created`: Resource created successfully.
    - `400 Bad Request`: Validation or malformed request.
    - `401 Unauthorized`: Authentication required.
    - `403 Forbidden`: Insufficient privileges.
    - `404 Not Found`: Resource not found.
    - `429 Too Many Requests`: Rate limiting.
    - `500 Internal Server Error`: Unexpected server error.

### Pagination
- Use `page` and `limit` query parameters.
- Response includes metadata:
    ```json
    {
        "page": 1,
        "limit": 20,
        "total": 100,
        "pages": 5
    }
    ```

### Filtering & Sorting
- Query parameters for filtering and sorting, e.g., `?q=shirt&category=men&sort=price_asc`.

### Resource Identifiers
- MongoDB ObjectId strings are used for resource IDs.

---

## Authentication Endpoints

### 1. Register a New User
**POST** `/api/auth/register`

- **Request Body**:
    ```json
    {
        "name": "string",
        "email": "string",
        "password": "string"
    }
    ```
- **Success Response**:
    ```json
    {
        "success": true,
        "data": { "id": "<userId>", "name": "...", "email": "..." }
    }
    ```
- **Errors**: `400`, `409`, `500`

### 2. Login
**POST** `/api/auth/login`

- **Request Body**:
    ```json
    {
        "email": "string",
        "password": "string"
    }
    ```
- **Success Response**:
    ```json
    {
        "success": true,
        "data": { "id": "<userId>", "name": "...", "email": "...", "role": "user" }
    }
    ```
- **Errors**: `400`, `401`

### 3. Get Current User
**GET** `/api/auth/me`

- **Authentication**: Required (cookie/JWT).
- **Success Response**:
    ```json
    {
        "success": true,
        "data": { "id": "<userId>", "name": "...", "email": "...", "role": "user" }
    }
    ```

### 4. Logout
**POST** `/api/auth/logout`

- **Description**: Clears authentication cookie/session.
- **Success Response**:
    ```json
    {
        "success": true
    }
    ```

---

## Shop Endpoints

### Products

#### 1. List Products
**GET** `/api/shop/products`

- **Query Parameters**: `page`, `limit`, `q`, `category`, `minPrice`, `maxPrice`, `sort`.
- **Success Response**:
    ```json
    {
        "success": true,
        "data": [ { product }, ... ],
        "meta": { "page": 1, "limit": 20, "total": 123, "pages": 7 }
    }
    ```

#### 2. Get Product Details
**GET** `/api/shop/products/:id`

- **Success Response**:
    ```json
    {
        "success": true,
        "data": { "id": "...", "title": "...", "price": 9.99, "images": ["..."], ... }
    }
    ```

---

## Admin Endpoints

### Products

#### 1. Create Product
**POST** `/api/admin/products`

- **Request Body**: Fields mirror `server/models/Product.js`. File uploads (e.g., images) use `multipart/form-data`.
- **Success Response**:
    ```json
    {
        "success": true,
        "data": { "id": "<productId>", "title": "...", "price": 9.99, ... }
    }
    ```

#### 2. Update Product
**PUT** `/api/admin/products/:id`

- **Request Body**: Fields to update.
- **Success Response**:
    ```json
    {
        "success": true,
        "data": { "id": "<productId>", "title": "...", "price": 9.99, ... }
    }
    ```

#### 3. Delete Product
**DELETE** `/api/admin/products/:id`

- **Description**: Soft or hard delete based on implementation.
- **Success Response**:
    ```json
    {
        "success": true
    }
    ```

---

## Security Notes
- Always use HTTPS in production.
- Validate and sanitize all inputs.
- Store sensitive data (e.g., API keys, database credentials) in environment variables.

---

## Open Items
- Add detailed request/response examples for all endpoints.
- Generate an OpenAPI (Swagger) specification for easier client integration.

Let me know if you need further refinements or additional sections.
