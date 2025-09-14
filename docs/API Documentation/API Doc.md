**Base URL:** `https://pikashop.onrender.com`

---

## 1. Authentication Module (`/auth`)

| Endpoint      | Method | Description           | Request Body                                                        | Success Response                                                                  | Error Response                                                                                                   |
| ------------- | ------ | --------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/register`   | POST   | Register new user     | `{ "userName": "string", "email": "string", "password": "string" }` | `{ "success": true, "message": "User registered successfully", "user": { ... } }` | `{ "success": false, "message": "Internal server error" }`                                                       |
| `/login`      | POST   | Login user            | `{ "email": "string", "password": "string" }`                       | `{ "success": true, "message": "Logged in successfully!", "user": { ... } }`      | `{ "success": false, "message": "User doesn't exist!" }, { "success": false, "message": "Incorrect password!" }` |
| `/logout`     | POST   | Logout user           | None                                                                | `{ "success": true, "message": "Logged out successfully!" }`                      | `{ "success": false, "message": "Internal server error" }`                                                       |
| `/check-auth` | GET    | Verify authentication | JWT token in cookies                                                | `{ "success": true, "message": "User is authenticated", "user": { ... } }`        | `{ "success": false, "message": "Unauthorized! Please login first" }`                                            |

---

## 2. Shop Module (`/shop`)

### 2.1 Products

| Endpoint            | Method | Description             | Query / Params            | Success Response                               |
| ------------------- | ------ | ----------------------- | ------------------------- | ---------------------------------------------- |
| `/products/get`     | GET    | Fetch filtered products | `category, brand, sortBy` | `{ "success": true, "data": [ ...products ] }` |
| `/products/get/:id` | GET    | Fetch product details   | `id`                      | `{ "success": true, "data": { ...product } }`  |

### 2.2 Cart

| Endpoint                   | Method | Description           | Body / Params                                            | Success Response                                        |
| -------------------------- | ------ | --------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `/cart/add`                | POST   | Add item to cart      | `{ "userId": "...", "productId": "...", "quantity": 1 }` | `{ "success": true, "data": { ...cart } }`              |
| `/cart/:userId`            | GET    | Fetch cart items      | `userId`                                                 | `{ "success": true, "data": { ...cartWithItems } }`     |
| `/cart/update-cart`        | PUT    | Update quantity       | `{ "userId": "...", "productId": "...", "quantity": 2 }` | `{ "success": true, "data": { ...updatedCart } }`       |
| `/cart/:userId/:productId` | DELETE | Delete item from cart | `userId, productId`                                      | `{ "success": true, "data": { ...cartAfterDeletion } }` |

### 2.3 Address

| Endpoint                             | Method | Description         | Body / Params                                                                                            | Success Response                                                                           |
| ------------------------------------ | ------ | ------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `/address/add`                       | POST   | Add new address     | `{ "userId": "...", "address": "...", "city": "...", "pincode": "...", "phone": "...", "notes": "..." }` | `{ "success": true, "data": { ...address }, "message": "Address added successfully" }`     |
| `/address/get/:userId`               | GET    | Fetch all addresses | `userId`                                                                                                 | `{ "success": true, "data": [ ...addresses ], "message": "Address fetched successfully" }` |
| `/address/update/:userId/:addressId` | PUT    | Edit address        | Partial body fields                                                                                      | `{ "success": true, "data": { ...updatedAddress } }`                                       |
| `/address/delete/:userId/:addressId` | DELETE | Delete address      | `userId, addressId`                                                                                      | `{ "success": true, "message": "Address deleted successfully!" }`                          |

### 2.4 Product Reviews

| Endpoint              | Method | Description                    | Body / Params                                                                                            | Success Response                                                                      |
| --------------------- | ------ | ------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `/reviews/add`        | POST   | Add review (purchase required) | `{ "productId": "...", "userId": "...", "userName": "...", "reviewMessage": "...", "reviewValue": 1-5 }` | `{ "success": true, "data": { ...review }, "message": "Review added successfully!" }` |
| `/reviews/:productId` | GET    | Get all reviews for product    | `productId`                                                                                              | `{ "success": true, "data": [ ...reviews ] }`                                         |

### 2.5 Search

| Endpoint           | Method | Description                                            | Params    | Success Response                                    |
| ------------------ | ------ | ------------------------------------------------------ | --------- | --------------------------------------------------- |
| `/search/:keyword` | GET    | Search products by title, category, brand, description | `keyword` | `{ "success": true, "data": [ ...searchResults ] }` |

---

## 3. Admin Module (`/admin`)

### 3.1 Products

| Endpoint        | Method | Description          | Body / Params                                                                                                                              | Success Response                                                                          |
| --------------- | ------ | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `/upload-image` | POST   | Upload product image | file (form-data)                                                                                                                           | `{ "success": true, "url": "...", "message": "Image uploaded successfully!" }`            |
| `/add`          | POST   | Add new product      | `{ "image": "...", "title": "...", "description": "...", "category": "...", "brand": "...", "price": 0, "salePrice": 0, "totalStock": 0 }` | `{ "success": true, "data": { ...product }, "message": "Product added successfully!" }`   |
| `/edit/:id`     | PUT    | Edit product         | Body fields optional                                                                                                                       | `{ "success": true, "data": { ...product }, "message": "Product updated successfully!" }` |
| `/delete/:id`   | DELETE | Delete product       | `id`                                                                                                                                       | `{ "success": true, "message": "Product deleted successfully!" }`                         |
| `/get`          | GET    | Fetch all products   | None                                                                                                                                       | `{ "success": true, "data": [ ...products ] }`                                            |

### 3.2 Orders

| Endpoint       | Method | Description         | Body / Params                                       | Success Response                                                          |
| -------------- | ------ | ------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- |
| `/get`         | GET    | Fetch all orders    | None                                                | `{ "success": true, "data": [ ...orders ] }`                              |
| `/details/:id` | GET    | Fetch order details | `id`                                                | `{ "success": true, "data": { ...order } }`                               |
| `/update/:id`  | PUT    | Update order status | `{ "orderStatus": "Confirmed/Delivered/Canceled" }` | `{ "success": true, "message": "Order status is updated successfully!" }` |

---

