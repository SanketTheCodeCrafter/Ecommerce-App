1. Collections & Relationships
Collection	Fields	Relationships	Notes
User	_id, userName, email, password, role	One-to-many: Address, Order, Cart, ProductReview	Password hashed, `role = 'user'
Product	_id, title, description, category, brand, price, salePrice, totalStock, averageReview	Referenced by Cart.items, Order.cartItems, ProductReview	Indexed: category, brand
Cart	_id, userId, items[{ productId, quantity }]	One-to-one: User	Active cart only
Address	_id, userId, address, city, pincode, phone, notes	One-to-many: User	Optional delivery notes
Order	_id, userId, cartItems[{ productId, quantity, price }], orderStatus, addressId	One-to-many: User, references Cart, Address	Lifecycle: Confirmed → Delivered → Canceled
ProductReview	_id, productId, userId, userName, reviewMessage, reviewValue	Many-to-one: Product, User	Only purchased users can review

Indexes:

User.email → Unique

Product.category, Product.brand → Filtering & search

Order.userId, Cart.userId → Fast retrieval

2. ERD (Entity Relationship Diagram)
erDiagram
    USER ||--o{ CART : has
    USER ||--o{ ADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o{ PRODUCTREVIEW : writes
    CART ||--|{ PRODUCT : contains
    ORDER ||--|{ PRODUCT : contains
    PRODUCT ||--o{ PRODUCTREVIEW : receives
    ORDER ||--|| ADDRESS : ships_to

3. Sequence Diagrams
3.1 Checkout / Order Placement
sequenceDiagram
    participant User
    participant Cart
    participant Product
    participant Order
    participant Address

    User->>Cart: Add items
    Cart->>Product: Validate stock
    User->>Address: Select shipping address
    User->>Order: Place order
    Order->>Product: Deduct stock
    Order->>Cart: Clear purchased items
    Order->>User: Confirm order

3.2 User Registration & Login
sequenceDiagram
    participant User
    participant Auth
    participant DB

    User->>Auth: Register / Login request
    Auth->>DB: Check / Save user
    DB-->>Auth: User data
    Auth-->>User: JWT token + success

3.3 Product Review Flow
sequenceDiagram
    participant User
    participant Order
    participant Review
    participant Product

    User->>Order: Check purchased product
    Order-->>User: Purchase verified
    User->>Review: Add review
    Review->>Product: Update average rating

3.4 Product Search
sequenceDiagram
    participant User
    participant Shop
    participant DB

    User->>Shop: Search keyword
    Shop->>DB: Query products (title, brand, category, description)
    DB-->>Shop: Matching products
    Shop-->>User: Return results

4. Data Flow Diagram (High-Level)
flowchart LR
    Auth --> DB[(MongoDB)]
    Shop --> DB
    Admin --> DB
    User --> Auth
    User --> Shop
    User --> Admin
    Shop --> Cart
    Shop --> Order
    Shop --> ProductReview