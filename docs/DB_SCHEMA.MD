# Database Schema — Ecommerce webapp

This document describes the MongoDB schema used by the project (Mongoose models in `server/models/`). It is intended to be concise, accurate and practical: field types and constraints are taken directly from the model files, relationships and important implementation notes are included, and placeholders for diagrams are provided for visualization.

Contents
- Overview
- Models (User, Product, Cart, Order, Review, Address)
- Relationships & important indexes
- Example documents
- Data validation & constraints
- Operational considerations (backups, retention, migrations)
- Diagram placeholders
- Mapping to source files

Overview
- Database: MongoDB (Mongoose models are used in `server/models/`).
- Design goals: document-oriented storage for shop data, denormalized order data for historical immutability, references for cart and address relations.

Models

1) User
- Collection: `users` (model: `User`)
- Source: `server/models/userModel.js`
- Fields
  - userName: String — required, unique
  - email: String — required, unique
  - password: String — required, minlength: 6 (hashed password expected)
  - role: String — optional, default: "user"

Notes
- `userName` and `email` must be unique; the application relies on unique email for authentication flows. Passwords should always be stored hashed (bcrypt or similar) by the Auth controller.

2) Product
- Collection: `products` (model: `Product`)
- Source: `server/models/Product.js`
- Fields
  - image: String
  - title: String
  - description: String
  - category: String
  - brand: String
  - price: Number
  - salePrice: Number
  - totalStock: Number
  - timestamps: createdAt, updatedAt (enabled via schema option)

Notes
- Images are stored as URL strings (Cloudinary or CDN). The `timestamps` option adds createdAt/updatedAt fields automatically.

3) Cart
- Collection: `carts` (model: `Cart`)
- Source: `server/models/Cart.js`
- Fields
  - userId: ObjectId (ref: 'User') — required
  - items: Array of { productId: ObjectId (ref: 'Product') required, quantity: Number required, min:1 }
  - timestamps: createdAt, updatedAt

Notes
- Cart is a per-user document. Items reference products by ObjectId. Controllers should validate product existence and available stock before checkout.

4) Order
- Collection: `orders` (model: `Order`)
- Source: `server/models/Order.js`
- Fields
  - userId: String
  - cartId: String
  - cartItems: Array of {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number
    }
  - addressInfo: { addressId: String, address: String, city: String, pincode: String, phone: String, notes: String }
  - orderStatus: String
  - paymentMethod: String
  - paymentStatus: String
  - totalAmount: Number
  - orderDate: Date
  - orderUpdateDate: Date
  - paymentId: String
  - payerId: String

Notes
- Orders are denormalized: cartItems store product snapshot (title, image, price) to keep historical accuracy even if products change later.
- Some fields use `String` for ids instead of ObjectId; controllers should be careful when querying and converting types.
- `orderDate` and `orderUpdateDate` track lifecycle; `paymentId` and `payerId` capture external payment provider identifiers (e.g., PayPal).

5) Review
- Collection: `productreviews` (model: `ProductReview`)
- Source: `server/models/Review.js`
- Fields
  - productId: String
  - userId: String
  - userName: String
  - reviewMessage: String
  - reviewValue: Number
  - timestamps: createdAt, updatedAt

Notes
- Reviews keep reviewer name and id; timestamps are included so the UI can show recency.

6) Address
- Collection: `addresses` (model: `Address`)
- Source: `server/models/Address.js`
- Fields
  - userId: ObjectId (ref: 'User') — required
  - address: String — required
  - city: String — required
  - pincode: String — required
  - phone: String — required
  - notes: String — required

Notes
- Address documents link to the owning user by ObjectId and include required fields for shipping.

Relationships and recommended indexes
- Cart.userId -> Users._id (reference). Recommend index on `carts.userId` for fast lookups.
- Cart.items.productId -> Products._id. Consider index on `carts.items.productId` if you perform reverse lookups.
- Address.userId -> Users._id. Index `addresses.userId` for find-by-user queries.
- Product: index on `title`, `category` and `price` if filter/search frequently; consider a text index on `title` and `description` for full-text search.
- Order.userId -> index for fast order history queries.

Diagram placeholder: ER diagram (compact)

<!-- DIAGRAM: er-focused
Filename suggestion: docs/diagrams/er-data-model-focused.png
Description: Compact ER showing Users, Products, Cart, Orders, Reviews, Address and their relationships (refs and denormalized order items). -->

Example documents

- User sample

```json
{
  "_id": "64f...",
  "userName": "alice",
  "email": "alice@example.com",
  "password": "<bcrypt-hash>",
  "role": "user"
}
```

- Product sample

```json
{
  "_id": "64f...",
  "image": "https://res.cloudinary.com/.../image.jpg",
  "title": "Cotton T-Shirt",
  "description": "Comfortable cotton tee",
  "category": "clothing",
  "brand": "Acme",
  "price": 19.99,
  "salePrice": 14.99,
  "totalStock": 120,
  "createdAt": "2025-09-01T10:00:00Z",
  "updatedAt": "2025-09-15T12:00:00Z"
}
```

- Cart sample

```json
{
  "_id": "64f...",
  "userId": "64f...",
  "items": [ { "productId": "64f...", "quantity": 2 } ],
  "createdAt": "2025-09-20T09:00:00Z",
  "updatedAt": "2025-09-20T09:05:00Z"
}
```

- Order sample

```json
{
  "_id": "64f...",
  "userId": "64f...",
  "cartItems": [ { "productId": "64f...", "title": "Cotton T-Shirt", "price": "14.99", "quantity": 2 } ],
  "addressInfo": { "addressId": "64f...", "address": "123 Street", "city": "Town", "pincode": "123456", "phone": "1234567890", "notes": "Leave at door" },
  "orderStatus": "pending",
  "paymentMethod": "paypal",
  "paymentStatus": "pending",
  "totalAmount": 29.98,
  "orderDate": "2025-09-20T09:10:00Z",
  "paymentId": "PAYID-..."
}
```

Data validation & constraints
- Use server-side validation for all create/update operations. The model-level constraints present are minimal (required flags, minlength, refs). Controllers should:
  - Validate email format and uniqueness when registering users.
  - Ensure password length and hash the password before saving.
  - Validate product fields (price non-negative, stock >= 0).
  - Validate cart item quantities against `totalStock` before creating orders.
  - Sanitize text fields to prevent injection in user-facing content.

Operational considerations
- Backups & restores
  - Use MongoDB Atlas automated snapshots or run regular mongodump backups. Retain daily snapshots for at least 30 days for production.

- Migrations
  - Keep migrations minimal — prefer additive migrations (new fields) with default values. Use a script or migration tool (migrate-mongo) for complex changes.

- Retention & archiving
  - Orders should be retained for business/audit purposes (consider GDPR/local regulations). If storage grows, archive older orders to a reporting DB or cold storage.

- Index maintenance
  - Monitor index usage (mongodb explain) and add/remove indexes as query patterns evolve.

Performance & scaling notes
- Denormalize read-heavy data (like product snapshot in orders) to avoid cross-collection joins at read time.
- Use pagination and limit result sizes for listing endpoints. Consider Redis caching for hot product listing queries.

Security & privacy
- Never store plaintext passwords. Store only bcrypt/argon2 hashed passwords.
- Avoid logging sensitive fields (password, payment tokens). Mask or redact logs containing personal data.

Diagram placeholder: Data flow (checkout)

<!-- DIAGRAM: checkout-flow
Filename suggestion: docs/diagrams/checkout-sequence.png
Description: Show the checkout sequence: client -> cart -> server creates order -> payment provider -> callback -> order finalization. -->

Mapping to source files
- `server/models/userModel.js` — User
- `server/models/Product.js` — Product
- `server/models/Cart.js` — Cart
- `server/models/Order.js` — Order
- `server/models/Review.js` — ProductReview
- `server/models/Address.js` — Address

Appendix: recommended next steps
- Add explicit indexes in model definitions where query patterns require them, e.g., `userId` on `Cart` and `Order`.
- Add a small data-migration script to normalize any existing string id fields to ObjectId where appropriate (if you later prefer strict ObjectId types for userId/productId in orders).
- Add a `docs/diagrams/` ER diagram (SVG) and embed it above.

If you'd like, I can now: generate the ER diagram SVG from the Mermaid source already present in `docs/diagrams/` and embed it into this file, or create an index/ migration script to standardize id fields. Which would you prefer?
