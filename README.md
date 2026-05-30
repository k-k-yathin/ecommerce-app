# ShopHub - Full-Stack E-Commerce Application

A modern, full-stack e-commerce web application built with React, Node.js, Express, PostgreSQL, and Prisma.

## Tech Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS 4
- React Router 7
- Axios
- Framer Motion
- Vite

### Backend
- Node.js + Express 5
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt password hashing
- Zod validation

## Features

- **Authentication** — Register, login, logout with JWT and role-based access (Admin/User)
- **Products** — Browse, search, filter by category, sort, pagination, product details
- **Shopping Cart** — Add, remove, update quantity (persisted in database)
- **Checkout** — Place orders, order summary, order history, status tracking
- **Admin Dashboard** — Product CRUD, view all orders, update order status
- **Responsive UI** — Modern design with loading states and error handling

## Project Structure

```
ecommerce-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── index.ts
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── types/
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Getting Started

### 1. Clone and install dependencies

```bash
cd ecommerce-app

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Set up the database

Create a PostgreSQL database:

```sql
CREATE DATABASE ecommerce;
```

Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 3. Run database migrations and seed

```bash
cd backend
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Start the development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Demo Accounts

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@shop.com  | admin123  |
| User  | user@shop.com   | user123   |

## API Endpoints

### Authentication
| Method | Endpoint          | Description       | Auth     |
|--------|-------------------|-------------------|----------|
| POST   | /api/auth/register | Register user    | Public   |
| POST   | /api/auth/login    | Login user       | Public   |
| POST   | /api/auth/logout   | Logout user      | Public   |
| GET    | /api/auth/me       | Get profile      | Required |

### Products
| Method | Endpoint           | Description          | Auth        |
|--------|--------------------|----------------------|-------------|
| GET    | /api/products      | List products        | Public      |
| GET    | /api/products/:id  | Get product          | Public      |
| POST   | /api/products      | Create product       | Admin       |
| PUT    | /api/products/:id  | Update product       | Admin       |
| DELETE | /api/products/:id  | Delete product       | Admin       |

Query params for GET /api/products: `search`, `category`, `sort`, `page`, `limit`, `minPrice`, `maxPrice`

### Cart
| Method | Endpoint        | Description        | Auth     |
|--------|-----------------|--------------------|----------|
| GET    | /api/cart       | Get cart           | Required |
| POST   | /api/cart       | Add to cart        | Required |
| PUT    | /api/cart/:id   | Update quantity    | Required |
| DELETE | /api/cart/:id   | Remove from cart   | Required |

### Orders
| Method | Endpoint                  | Description         | Auth     |
|--------|---------------------------|---------------------|----------|
| POST   | /api/orders               | Place order         | Required |
| GET    | /api/orders               | User order history  | Required |
| GET    | /api/orders/:id           | Get order details   | Required |
| GET    | /api/orders/admin/all     | All orders          | Admin    |
| PATCH  | /api/orders/:id/status    | Update order status | Admin    |

## Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Deployment Notes

1. Set strong `JWT_SECRET` in production
2. Use a managed PostgreSQL service (e.g., Supabase, Railway, Neon)
3. Set `NODE_ENV=production` and `FRONTEND_URL` to your deployed frontend URL
4. Enable HTTPS and set secure cookie flags
5. Run `npm run db:migrate` for production database migrations

## License

MIT
