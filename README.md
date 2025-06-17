# HANDL — Backend
## //IN PROGRESS//

Backend repository for **HANDL**, a full-stack web app that helps users create, manage, and share shopping lists in real time. Whether you're planning groceries solo or coordinating with family, HANDL keeps everything in sync across devices. 

## ⚙️ Tech Stack

- Node.js + Express
- PostgreSQL
- Passport (Session-based auth)
- Nodemailer
- SSE (Server-Sent Events for real-time updates)
- REST API

## 🧑‍💻 Getting Started

### Prerequisites

- PostgreSQL database
- Node.js (v18+)
- `.env` file with required variables

### Installation

```bash
git clone https://github.com/gitXite/handl_backend.git
cd handl_backend
npm install
```

The app can be installed locally as a progressive web app (PWA). 

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

### Running the App
```bash
npm run dev
```

## 📂 Project Structure

```plaintext
handl_backend/
├── src/
|    ├── config/         # DB and email configuration
|    ├── controllers/    # Express route handlers
|    ├── middleware/     # Auth, error handling
|    ├── routes/         # API endpoints
|    ├── services/       # Business logic
|    ├── index.js        # Entry point
├── .env.example
├── README.md
├── package.json
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
