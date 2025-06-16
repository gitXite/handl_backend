# Handl — Backend

Backend repository for **Handl**, a collaborative full-stack shopping list web application.

## ⚙️ Tech Stack

- Node.js + Express
- PostgreSQL
- Passport (Session-based auth)
- Nodemailer
- SSE (Server-Sent Events for real-time updates)
- REST API

## 📂 Project Structure

```plaintext
handl_backend/
├── src/
|    ├── config/         # DB and email configuration
|    ├── controllers/    # Express route handlers
|    ├── middleware/     # Auth, error handling
|    ├── routes/         # API endpoints
|    ├── services/       # Business logic
├── package.json
```

## 🧑‍💻 Getting Started

### Prerequisites

- PostgreSQL database
- Node.js (v18+)
- `.env` file with required variables

### Environment Setup

Create a `.env` file in the root with the following:
```
PORT=5000
SESSION_SECRET=your_secret
DATABASE_URL=postgresql://user:pass@localhost:5432/handl
EMAIL_USER=you@example.com
EMAIL_PASS=yourpassword
CLIENT_URL=http://localhost:3000
```

## 🛡️ Authentication
Session-based authentication using Passport

Email confirmation & password reset via token logic

## 🔄 Real-time Features
Server-Sent Events (SSE) for real-time list updates and sharing

## 📦 Deployment Notes
Be sure to use secure cookies and HTTPS in production

Configure CORS and sessions properly with frontend origin

## 📄 License

This project is licensed under the [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) license — non-commercial use only.
