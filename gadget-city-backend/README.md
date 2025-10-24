# Gadget City Backend

A complete e-commerce backend API for Gadget City Philippines, built with Node.js, Express.js, and MongoDB.

## Features

✅ **Complete E-commerce Backend**
- Product management with categories, brands, specifications
- Shopping cart functionality
- Order management and tracking
- User authentication (structure ready)
- Admin panel support

✅ **API Endpoints**
- `GET /api/products` - Product listing with filtering
- `GET /api/products/:id` - Single product details
- `POST /api/products` - Create product (Admin)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders/create` - Create order from cart
- `GET /api/orders` - User's order history

✅ **Advanced Features**
- Product search and filtering
- Stock management
- Coupon/discount system
- Order status tracking
- Comprehensive error handling

## Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `.env` file with your MongoDB connection string

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Seed the database:**
   ```bash
   npm run seed
   ```

## Usage

### Development
```bash
npm run dev    # Start with nodemon (auto-restart)
```

### Production
```bash
npm start      # Start the server
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/gadget-city

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (for authentication)
JWT_SECRET=gadget-city-secret-key-2024

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## API Documentation

### Products

#### Get all products
```http
GET /api/products?page=1&limit=12&category=smartphones&search=iphone
```

#### Get single product
```http
GET /api/products/:id
```

#### Create product (Admin)
```http
POST /api/products
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone model",
  "price": 69999,
  "category": "smartphones",
  "brand": "Apple",
  "stock": 50
}
```

### Cart

#### Get cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to cart
```http
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 2
}
```

### Orders

#### Create order
```http
POST /api/orders/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Manila",
    "province": "Metro Manila",
    "zipCode": "1000"
  },
  "paymentMethod": "cod"
}
```

## Project Structure

```
gadget-city-backend/
├── models/           # Database models
│   ├── Product.js   # Product schema
│   ├── User.js      # User schema
│   ├── Cart.js      # Shopping cart schema
│   └── Order.js     # Order schema
├── routes/          # API routes
│   ├── products.js  # Product routes
│   ├── cart.js      # Cart routes
│   └── orders.js    # Order routes
├── middleware/      # Custom middleware
├── seed.js         # Database seeding script
├── server.js       # Main server file
├── package.json    # Dependencies and scripts
└── .env           # Environment variables
```

## Sample Data

The seed script includes 12 sample products across various categories:
- Smartphones (iPhone, Samsung, OnePlus)
- Laptops (MacBook Pro, Dell XPS)
- Headphones (Sony WH-1000XM5, AirPods Pro)
- Gaming (PlayStation 5)
- Smartwatches (Apple Watch)
- Tablets (iPad Pro)
- Accessories (Anker Power Bank)
- Cameras (Sony Alpha 7 IV)

## Testing

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test basic endpoints:**
   ```bash
   curl http://localhost:5000/
   curl http://localhost:5000/health
   curl http://localhost:5000/api/products
   ```

## Next Steps

🔄 **Future Enhancements:**
- [ ] User authentication and authorization
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Product reviews and ratings
- [ ] Advanced search and filtering
- [ ] Inventory management
- [ ] Analytics and reporting

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally
- Check connection string in `.env`
- Use MongoDB Atlas for cloud database

**Port Already in Use:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process
taskkill /PID <PID> /F
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details.
