# SynBot — Synergy Labs HR & Onboarding Assistant

SynBot is an AI-powered chatbot that instantly answers common HR and onboarding questions for new employees — so they don't have to keep bothering the HR team for every small query. Built on the MERN stack (MongoDB, Express, React, Node.js) and powered by the Google Gemini API.

### 🔗 [Live Demo → synbot-1.onrender.com](https://synbot-1.onrender.com)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

## 🎯 Problem Statement

When new employees join a company, they usually have a lot of basic questions — leave policy, working hours, IT setup, reimbursement process, dress code, etc. These same questions get asked to HR repeatedly, wasting HR's time and making new employees wait for responses.

**SynBot solves this problem** — a 24/7 available chatbot that instantly answers these questions, reduces HR's workload, and gives new employees immediate help.

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login/register system
- 💬 **AI-Powered Chat** — natural language responses via the Google Gemini API
- 📝 **Conversation History** — past chats are saved and accessible
- 🌙 **Dark Mode** — theme switches based on user preference
- 📱 **Responsive Design** — works on both mobile and desktop
- ⚡ **Real-time Responses** — instant replies, no need to wait on HR

## 🛠️ Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express
- MongoDB (Mongoose)
- JWT (jsonwebtoken) — authentication
- bcryptjs — password hashing
- Google Gemini API — AI responses

**Deployment:**
- Render (Web Service — backend, Static Site — frontend)
- MongoDB Atlas — database hosting

## 📁 Project Structure

```
SynBot/
├── backend/
│   ├── models/          # Mongoose schemas (User, Chat)
│   ├── routes/          # API routes (auth, chat)
│   ├── server.js        # Entry point
│   ├── seed.js          # Database seeding script
│   └── .env             # Environment variables (not tracked)
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (AuthPage, ChatBox)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env              # Environment variables (not tracked)
└── .gitignore
```

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/KrishikaSinha/SynBot.git
cd SynBot
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `backend/.env` file and add the following variables:
```
MONGO_CONNECTION_STRING=your_mongodb_connection_string
PORT=5000
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Start the backend:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
```

Create a `frontend/.env` file:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The app will now be accessible at `http://localhost:5173`.

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/chat` | Send a message to the chatbot |
| GET | `/api/conversations/:userId` | Get all conversations for a user |

## 🔒 Security Notes

- `.env` files are never pushed to Git/GitHub — always keep them in `.gitignore`
- Passwords are hashed using `bcryptjs`, never stored in plain text
- Every protected route verifies a JWT token

## 📦 Deployment

This project is deployed on [Render](https://render.com):
- **Live App:** [https://synbot-1.onrender.com](https://synbot-1.onrender.com)
- **Backend:** Web Service (Root Directory: `backend`)
- **Frontend:** Static Site (Root Directory: `frontend`, Build Command: `npm install && npm run build`, Publish Directory: `dist`)

Environment variables are set manually in the Render dashboard (since `.env` files aren't pushed to GitHub).

## 🤝 Future Improvements

- Admin dashboard for the HR team (to manage FAQs)
- Multi-language support
- Analytics — which questions are asked most often
- Escalation feature — forward complex queries directly to the HR team

## 📄 License

This project was built for the internal use of Synergy Labs.

---

**Built with krishika sinha❤️ to make onboarding easier for everyone.**
