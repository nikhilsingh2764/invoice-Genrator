# 🧾 InvoicePilot — Invoice Management System

A full-stack invoice management application built with **Node.js, Express.js, MongoDB, React, and Redis**.

InvoicePilot helps businesses manage their billing workflow from a centralized platform. Users can manage business profiles, customers, products, and invoices, automatically calculate invoice totals, generate PDF invoices, download them, and send invoices to customers through email.

The backend follows a layered architecture with separate **routes, controllers, services, repositories, models, middleware, and utilities**, along with JWT authentication, refresh-token based sessions, HTTP-only cookies, request validation, Redis caching, rate limiting, PDF generation, and email delivery.

---

## 🚀 Live Demo

| Resource                  | Link                                                                                                                                                                                                                                              |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 Frontend               | [InvoicePilot Frontend](https://invoicepilot-zeta.vercel.app?utm_source=chatgpt.com)                                                                                                                                                              |
| ⚙️ Backend API            | [InvoicePilot Backend API](https://invoice-backend-drqr.onrender.com?utm_source=chatgpt.com)                                                                                                                                                      |
| 🧪 Postman API Collection | [Invoice Generator Postman Collection](https://www.postman.com/technical-physicist-35686083-s-team/workspace/invoice-generator-api/collection/39798617-83cff721-5ce7-4e00-ba58-0d49017d3f39?action=share&creator=39798617&utm_source=chatgpt.com) |
| 💻 GitHub Repository      | [InvoicePilot GitHub Repository](https://github.com/nikhilsingh2764/invoice-Genrator?utm_source=chatgpt.com)                                                                                                                                      |

> **Note:** The backend is deployed on Render's free tier, so the first request after a period of inactivity may take a few seconds while the service starts.

---

## 📋 Table of Contents

* [Problem & Solution](#-problem--solution)
* [Key Features](#-key-features)
* [System Architecture](#-system-architecture)
* [Application Flow](#-application-flow)
* [Authentication Flow](#-authentication-flow)
* [Tech Stack](#️-tech-stack)
* [Project Structure](#-project-structure)
* [Database Design](#️-database-design)
* [API Reference](#-api-reference)
* [Redis & Caching](#-redis--caching)
* [Security](#-security)
* [Error Handling](#-error-handling)
* [Installation](#-installation)
* [Environment Variables](#️-environment-variables)
* [API Testing](#-api-testing)
* [Deployment](#-deployment)
* [Technical Design Decisions](#-technical-design-decisions)
* [Future Improvements](#-future-improvements)
* [License](#-license)

---

# 📌 Problem & Solution

## Problem

Managing invoices manually becomes difficult as the number of customers, products, and transactions increases.

Businesses need to maintain customer information, product pricing, taxes, discounts, invoice records, payment status, and invoice documents while also being able to quickly send invoices to customers.

Handling these tasks separately can result in repetitive work and make invoice tracking more difficult.

## Solution

InvoicePilot provides a centralized invoice management system for the complete billing workflow.

Users can:

* Manage their business profile
* Manage customers
* Manage products and services
* Create invoices containing multiple products
* Automatically calculate invoice totals
* Track invoice payment status
* Search, filter, sort, and paginate invoices
* Duplicate existing invoices
* Generate PDF invoices
* Download invoice PDFs
* Send invoices through email
* View business and invoice information through the dashboard

---

# ✨ Key Features

## 🔐 Authentication & Security

* User registration
* Email OTP verification
* Google OAuth authentication
* JWT authentication
* Access token + refresh token flow
* HTTP-only cookies
* Protected API routes
* Secure logout
* Password hashing with bcrypt
* Forgot-password flow
* Password reset using OTP
* Failed login attempt tracking
* Temporary account lock mechanism
* Rate limiting for authentication and API endpoints
* Request validation
* Helmet security headers
* CORS configuration

---

## 👤 User & Business Management

### User Management

* User registration and verification
* Login and logout
* Profile management
* Password change
* Password reset
* Account deactivation
* Account deletion

### Business Management

Users can create and manage their business profile, including:

* Business name
* Owner information
* Contact details
* GST information
* Business logo
* Signature
* Currency
* Terms and conditions

Frequently accessed profile/business information can be cached using Redis.

---

## 👥 Customer Management

Users can:

* Create customers
* View customers
* View individual customer details
* Update customer information
* Delete customers
* Store billing and shipping addresses

---

## 📦 Product Management

Users can manage products or services with:

* Product name
* Description
* Category
* Unit
* Price
* Tax rate
* Discount

Supported operations:

* Create product
* Get products
* Get individual product
* Update product
* Delete product

---

## 🧾 Invoice Management

InvoicePilot supports:

* Invoice creation
* Multiple products per invoice
* Automatic subtotal calculation
* Automatic tax calculation
* Automatic discount calculation
* Grand total calculation
* Payment status tracking
* Invoice history
* Search
* Filtering
* Sorting
* Pagination
* Invoice duplication

Supported invoice statuses include:

* Draft
* Pending
* Paid
* Partially Paid
* Overdue
* Cancelled

---

## 📄 PDF Generation

The backend generates dynamic invoice PDFs using **PDFKit**.

Users can:

* Generate invoice PDFs
* Download invoice PDFs
* Generate invoices using stored business/customer/product information

---

## 📧 Email Delivery

Invoices can be sent directly to customers through email.

The email system integrates with **Brevo API** and supports PDF invoice attachments.

---

# 🏗️ System Architecture

```text
                         Client
                           │
                           ▼
                    React Frontend
                           │
                           ▼
                       Axios API
                           │
                           ▼
                  ┌─────────────────┐
                  │  Express Server │
                  └────────┬────────┘
                           │
                           ▼
                    Middleware Layer
             ┌─────────────┼─────────────┐
             │             │             │
        Authentication   Validation   Rate Limiting
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                         Routes
                           │
                           ▼
                      Controllers
                           │
                           ▼
                        Services
                           │
                           ▼
                      Repositories
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
              MongoDB              Redis
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                 Caching                    Rate Limiting

                         External Services
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
                 Brevo                    PDFKit
                Email API              PDF Generation
```

---

# 🔄 Application Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Email Verification / Google OAuth
 │
 ▼
Authenticated Session
 │
 ▼
Create Business Profile
 │
 ├──► Add Customers
 │
 └──► Add Products
          │
          ▼
      Create Invoice
          │
          ▼
   Automatic Calculations
          │
          ▼
    Invoice Stored
          │
      ┌───┴────┐
      ▼        ▼
   PDF      Email
      │        │
      ▼        ▼
 Download   Customer
```

---

# 🔐 Authentication Flow

InvoicePilot uses JWT-based authentication with separate access and refresh tokens.

```text
                    Login
                      │
                      ▼
              Validate Credentials
                      │
                      ▼
            Generate Access Token
                      +
            Generate Refresh Token
                      │
                      ▼
               HTTP-only Cookies
                      │
                      ▼
              Protected API Request
                      │
                      ▼
              Validate Access Token
                      │
                ┌─────┴─────┐
                │           │
              Valid       Expired
                │           │
                ▼           ▼
             Request    Refresh Token
             Allowed         │
                            ▼
                    Generate New Access
                         Token
```

### Logout

```text
Logout Request
      │
      ▼
Invalidate Refresh Token
      │
      ▼
Session Can No Longer Be Refreshed
```

---

# 🛠️ Tech Stack

## Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js            | JavaScript runtime         |
| Express.js         | REST API framework         |
| MongoDB            | Database                   |
| Mongoose           | MongoDB ODM                |
| Redis              | Caching and rate limiting  |
| ioredis            | Redis client               |
| JWT                | Authentication             |
| bcrypt             | Password hashing           |
| Zod                | Request validation         |
| express-validator  | Request validation         |
| Helmet             | HTTP security headers      |
| CORS               | Cross-origin configuration |
| express-rate-limit | API rate limiting          |
| PDFKit             | PDF invoice generation     |
| Brevo API          | Email delivery             |
| Nodemailer         | Email handling             |
| dotenv             | Environment configuration  |
| Morgan             | HTTP request logging       |
| Nodemon            | Development server         |

## Frontend

| Technology      | Purpose             |
| --------------- | ------------------- |
| React           | UI                  |
| Vite            | Frontend build tool |
| Tailwind CSS    | Styling             |
| Zustand         | State management    |
| React Router    | Routing             |
| Axios           | API communication   |
| React Hook Form | Form management     |
| Zod             | Form validation     |
| Framer Motion   | Animations          |
| React Hot Toast | Notifications       |
| Lucide React    | Icons               |
| React Icons     | Icons               |
| ESLint          | Code quality        |

---

# 📂 Project Structure

```text
invoice-Genrator/
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── Database & Redis configuration
│   │   │
│   │   ├── controller/
│   │   │   ├── auth/
│   │   │   └── invoice/
│   │   │
│   │   ├── helper/
│   │   │
│   │   ├── middleware/
│   │   │   └── Authentication & error handling
│   │   │
│   │   ├── model/
│   │   │   ├── auth/
│   │   │   └── invoice/
│   │   │
│   │   ├── repository/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── invoice/
│   │   │
│   │   ├── route/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── invoice/
│   │   │
│   │   ├── service/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── invoice/
│   │   │
│   │   ├── templates/
│   │   │   └── Email & PDF templates
│   │   │
│   │   ├── utils/
│   │   │   └── Reusable utilities
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── test.http
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── validation/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
└── README.md
```

## The repository structure is based on the generated documentation, including the controller/service/repository separation and frontend organization.

# 🗄️ Database Design

The application uses MongoDB with Mongoose.

### Main entities

```text
User
 │
 ├── Business
 │
 ├── Customers
 │
 ├── Products
 │
 └── Invoices
        │
        ├── Customer
        │
        └── Products
```

### Authentication Models

```text
User
OTP
RefreshToken
```

### Invoice Models

```text
Business
Customer
Product
Invoice
Address
```

The repository separates authentication models from invoice/business models, as reflected in the project structure.

---

# ⚡ Redis & Caching

Redis is used for performance and API protection.

## Redis Responsibilities

### 1. Profile / Business Caching

Frequently accessed user and business information can be cached to reduce repeated database queries.

```text
API Request
    │
    ▼
Check Redis
    │
 ┌──┴───┐
 │      │
Hit    Miss
 │      │
 ▼      ▼
Return  MongoDB
Cache     │
          ▼
      Store in Redis
          │
          ▼
       Response
```

### 2. Rate Limiting

Redis is also used with the rate-limiting system to control repeated requests and protect authentication/API endpoints.

---

# 🛡️ Security

The application implements multiple security layers:

* JWT authentication
* Access and refresh tokens
* HTTP-only cookies
* Password hashing with bcrypt
* Email OTP verification
* Google OAuth authentication
* Protected routes
* Rate limiting
* Failed login attempt tracking
* Temporary account locking
* Request validation
* Helmet security headers
* CORS configuration
* Environment variables for sensitive configuration
* Refresh-token invalidation during logout

The generated repository documentation specifically identifies these authentication and security mechanisms.

---

# 🚨 Error Handling

The backend contains dedicated middleware and utility layers for handling API errors and responses.

The architecture separates error-handling middleware from business logic so that controllers and services do not need to independently implement the entire error-handling flow.

```text
Request
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ├──── Success ────► Response
   │
   └──── Error ──────► Error Middleware
                           │
                           ▼
                    Standard API Response
```

> Error responses should be handled through the application's centralized error-handling implementation rather than exposing internal server details.

---

# 📚 API Reference

All API endpoints are prefixed with:

```text
/api/v1
```

## Authentication

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| POST   | `/signup`             | Register a new user            |
| POST   | `/verify-otp`         | Verify user email              |
| POST   | `/login`              | Login                          |
| POST   | `/google`             | Google OAuth login/signup      |
| GET    | `/profile`            | Get authenticated user profile |
| POST   | `/logout`             | Logout                         |
| PATCH  | `/update-profile`     | Update profile                 |
| PATCH  | `/change-password`    | Change password                |
| PATCH  | `/deactivate-account` | Deactivate account             |
| DELETE | `/delete-account`     | Delete account                 |
| POST   | `/forgot-password`    | Request password reset OTP     |
| POST   | `/reset-password`     | Reset password                 |
| POST   | `/refresh-token`      | Generate a new access token    |

---

## Business

| Method | Endpoint    | Description             |
| ------ | ----------- | ----------------------- |
| POST   | `/business` | Create business profile |
| GET    | `/business` | Get business profile    |
| PATCH  | `/business` | Update business profile |
| DELETE | `/business` | Delete business profile |

---

## Customers

| Method | Endpoint        | Description        |
| ------ | --------------- | ------------------ |
| POST   | `/customer`     | Create customer    |
| GET    | `/customer`     | Get customers      |
| GET    | `/customer/:id` | Get customer by ID |
| PATCH  | `/customer/:id` | Update customer    |
| DELETE | `/customer/:id` | Delete customer    |

---

## Products

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | `/product`     | Create product    |
| GET    | `/product`     | Get products      |
| GET    | `/product/:id` | Get product by ID |
| PATCH  | `/product/:id` | Update product    |
| DELETE | `/product/:id` | Delete product    |

---

## Invoices

| Method | Endpoint                 | Description          |
| ------ | ------------------------ | -------------------- |
| POST   | `/invoice`               | Create invoice       |
| GET    | `/invoice/:id`           | Get invoice          |
| PATCH  | `/invoice/:id`           | Update invoice       |
| DELETE | `/invoice/:id`           | Delete invoice       |
| GET    | `/invoice/:id/pdf`       | Download invoice PDF |
| POST   | `/invoice/:id/email`     | Email invoice        |
| POST   | `/invoice/:id/duplicate` | Duplicate invoice    |

---

## Dashboard

| Method | Endpoint | Description                               |
| ------ | -------- | ----------------------------------------- |
| GET    | `/`      | Dashboard summary and invoice information |

The endpoint list above follows the generated repository documentation.

---

# 🧪 API Testing

The API can be tested using the public Postman collection.

### Postman Collection

[Open Invoice Generator API Collection in Postman](https://www.postman.com/technical-physicist-35686083-s-team/workspace/invoice-generator-api/collection/39798617-83cff721-5ce7-4e00-ba58-0d49017d3f39?action=share&creator=39798617&utm_source=chatgpt.com)

The collection can be used to test:

* Authentication
* OTP verification
* Token refresh
* Protected routes
* Business APIs
* Customer APIs
* Product APIs
* Invoice APIs
* PDF generation
* Email delivery

---

# ⚙️ Installation

## Prerequisites

Before running the project locally, install:

* Node.js 18+
* MongoDB or MongoDB Atlas
* Redis or Redis Cloud
* Git

These prerequisites are also listed in the generated project documentation.

---

## 1. Clone Repository

```bash
git clone https://github.com/nikhilsingh2764/invoice-Genrator.git
cd invoice-Genrator
```

---

## 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory.

---

## 3. Start Backend

```bash
npm run dev
```

The backend runs on the configured port.

---

## 4. Frontend Setup

Open another terminal:

```bash
cd Frontend
npm install
```

Create the frontend environment file and configure the backend API URL.

---

## 5. Start Frontend

```bash
npm run dev
```

The frontend will be available through the Vite development server.

---

# ⚙️ Environment Variables

## Backend

Create:

```text
Backend/.env
```

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

REDIS_URL=your_redis_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=15d

BREVO_API_KEY=your_brevo_api_key

EMAIL_USER=your_email

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
```

Never commit real secrets or API keys to GitHub.

The generated documentation identifies these environment variables and their purposes.

---

## Frontend

Create:

```text
Frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5000/api/v1

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

# 🧠 Technical Design Decisions

## Why Layered Architecture?

The backend separates:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Database
```

This keeps HTTP handling, business logic, and database access separated.

---

## Why Redis?

Redis is used for caching frequently accessed information and supporting rate limiting.

This reduces unnecessary database operations and provides a centralized mechanism for controlling repeated requests.

---

## Why JWT?

JWT provides token-based authentication for protected REST API endpoints.

Using separate access and refresh tokens allows short-lived access credentials while maintaining a mechanism for obtaining a new access token.

---

## Why HTTP-only Cookies?

HTTP-only cookies prevent JavaScript from directly accessing authentication cookies, reducing exposure to token theft through client-side scripts.

---

## Why MongoDB?

MongoDB provides a document-oriented database suitable for the application's business, customer, product, invoice, and authentication data.

---

## Why Service and Repository Layers?

The service layer contains application/business logic while repositories handle database interaction.

This separation makes the backend easier to organize, maintain, and extend.

---

# 📈 Scalability Considerations

The project already includes several foundations that support scaling:

* Redis caching
* Redis-backed rate limiting
* Pagination
* Layered backend architecture
* Separate repository layer
* Protected API routes
* External email service
* Environment-based configuration
* Modular feature-based organization

Future scaling can build on this architecture by introducing additional background processing, automated testing, containerization, and CI/CD.

---

# 🔄 Complete Invoice Workflow

```text
User Login
    │
    ▼
Authentication
    │
    ▼
Business Profile
    │
    ├───────────────┐
    ▼               ▼
Customers        Products
    │               │
    └───────┬───────┘
            ▼
       Create Invoice
            │
            ▼
    Select Customer
            │
            ▼
     Select Products
            │
            ▼
   Calculate Subtotal
            │
            ▼
      Apply Tax
            │
            ▼
    Apply Discount
            │
            ▼
       Grand Total
            │
            ▼
       Save Invoice
            │
       ┌────┴────┐
       ▼         ▼
   Generate     Email
      PDF       Invoice
       │
       ▼
    Download
```

---

# 🚀 Deployment

## Frontend

Deployed using Vercel:

[InvoicePilot Frontend](https://invoicepilot-zeta.vercel.app?utm_source=chatgpt.com)

## Backend

Deployed using Render:

[InvoicePilot Backend API](https://invoice-backend-drqr.onrender.com?utm_source=chatgpt.com)

## Database

The application supports MongoDB/MongoDB Atlas.

## Cache

The application supports Redis/Redis Cloud.

---

# 🗺️ Future Improvements

Potential future improvements include:

* Automated backend test suite
* Swagger/OpenAPI documentation
* Background job processing for email/PDF operations
* Docker containerization
* CI/CD pipeline
* Advanced dashboard analytics
* Monitoring and alerting
* Additional database optimization
* Improved automated API testing

---

# 🤝 Contributing

For development contributions:

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/your-feature-name
```

Then open a pull request.

---

# 📄 License

No license is currently specified for this repository.

If you intend to allow others to use, modify, or distribute the project, add an appropriate open-source license to the repository.

---

# 👨‍💻 Author

**Nikhil Singh**

Backend Developer | Node.js | Express.js | MongoDB | Redis

### Project Repository

[InvoicePilot GitHub Repository](https://github.com/nikhilsingh2764/invoice-Genrator?utm_source=chatgpt.com)

### Live Application

[InvoicePilot](https://invoicepilot-zeta.vercel.app?utm_source=chatgpt.com)

### API

[InvoicePilot API](https://invoice-backend-drqr.onrender.com?utm_source=chatgpt.com)

### Postman

[Invoice Generator API Collection](https://www.postman.com/technical-physicist-35686083-s-team/workspace/invoice-generator-api/collection/39798617-83cff721-5ce7-4e00-ba58-0d49017d3f39?action=share&creator=39798617&utm_source=chatgpt.com)
