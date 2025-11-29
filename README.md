# Subscription Tracker API

A production-ready backend API for managing personal subscriptions with automated email reminders, rate limiting, and bot protection. Built with Node.js and Express, this system helps users track their recurring subscriptions and never miss a renewal date.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication system
- **Subscription Management** - Create, read, update, and delete subscriptions
- **Automated Email Reminders** - Get notified before subscription renewals using Nodemailer
- **Rate Limiting & Bot Protection** - Powered by Arcjet for enhanced security
- **Workflow Automation** - Upstash integration for scheduled tasks and reminder workflows
- **MongoDB Integration** - Persistent data storage with MongoDB Atlas
- **RESTful API** - Clean and intuitive API endpoints

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Security**: Arcjet (Rate Limiting & Bot Protection)
- **Workflows**: Upstash (QStash)
- **Email Service**: Nodemailer
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- MongoDB Atlas account
- Arcjet API key
- Upstash account and QStash token
- Email service credentials for Nodemailer

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/Atom9950/subscription-tracker.git
cd subscription-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5500
SERVER_URL=http://localhost:5500
NODE_ENV=development

# Database
DB_URI=your_mongodb_atlas_connection_string

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

# Arcjet (Rate Limiting & Bot Protection)
ARCJET_KEY=your_arcjet_api_key
ARCJET_ENV=development

# Upstash (Workflows)
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=your_qstash_token

# Nodemailer (Email Service)
EMAIL_PASSWORD=your_email_app_password
EMAIL_USER=your_email_address
```

4. **Run the application**

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:5500`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions for authenticated user
- `GET /api/subscriptions/:id` - Get specific subscription
- `POST /api/subscriptions` - Create new subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Example Request Body (Create Subscription)

```json
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "Entertainment",
  "startDate": "2025-01-20T00:00:00.000Z",
  "paymentMethod": "Credit Card",
  "reminderDays": 3
}
```

## 🔐 Security Features

### Arcjet Integration
- Rate limiting to prevent API abuse
- Bot detection and protection
- Request validation and filtering

### Authentication
- Password hashing
- JWT token-based authentication
- Secure session management

## 📧 Email Reminders

The system uses Upstash workflows to schedule and send automated email reminders:

- Reminders sent X days before renewal (configurable per subscription)
- Email notifications include subscription details
- Automated workflow management for reliable delivery

## 🗄️ Database Schema

### User Model
- Email (unique)
- Password (hashed)
- Name
- Created/Updated timestamps

### Subscription Model
- User reference
- Name
- Price & Currency
- Billing frequency (monthly/yearly)
- Category
- Start date
- Next renewal date
- Payment method
- Reminder settings
- Status (active/cancelled)

## 🚧 Environment Modes

### Development
- Detailed error messages
- CORS enabled for local development
- Debug logging

### Production
- Optimized error handling
- Security headers
- Rate limiting enforced

## 📝 Scripts

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Important Notes

- This is a **backend API only** - it requires a frontend application to interact with
- Ensure all environment variables are properly configured before running
- Use strong JWT secrets in production
- Keep your API keys and credentials secure

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Atom9950**

---

**Note**: This is backend dude! Why would you even possibly try to run it on your browser??? 💔🥀
