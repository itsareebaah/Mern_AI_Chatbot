# 🚀 MERN AI Chatbot

An AI-powered full-stack chatbot application built using the **MERN Stack** with **OpenRouter + DeepSeek AI** integration.  
The application allows users to securely authenticate, chat with an AI assistant in real time, and store conversation history in MongoDB.

---

# 🌟 Features

- 💬 Real-time AI chatbot interface
- 🧠 AI responses using OpenRouter + DeepSeek
- 🔐 JWT Authentication System
- 🗂️ Recent chat history sidebar
- ⚡ Modern React + Vite frontend
- 🎨 Smooth UI animations with Framer Motion
- 📦 MongoDB database integration
- 🔌 RESTful API architecture
- 🔒 Secure password hashing with bcrypt

---

# 🛠️ Tech Stack

## Frontend
- React
- Vite
- Axios
- Framer Motion

## Backend
- Node.js
- Express.js
- Mongoose
- JWT Authentication
- bcrypt

## Database
- MongoDB

## AI Integration
- OpenRouter API
- DeepSeek Chat Model

---

# 📁 Project Structure

```txt
mern-ai-chatbot/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── Chat.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── chatRoutes.js
│   │
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Auth.jsx
│   │   └── main.jsx
│   │
│   └── vite.config.js
│
└── README.md
```

---

# ⚡ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/mern-ai-chatbot.git

cd mern-ai-chatbot
```

---

# 🔧 Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a `.env` file inside the backend folder:

```env
OPENROUTER_API_KEY=your_openrouter_api_key

MONGODB_URI=your_mongodb_connection_string

MODEL_NAME=deepseek/deepseek-chat

JWT_SECRET=your_jwt_secret

PORT=5000
```

---

## Run Backend

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# 🎨 Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# 🔐 Authentication

The application uses **JWT Authentication**.

## Auth Endpoints

### Signup

```http
POST /api/auth/signup
```

### Login

```http
POST /api/auth/login
```

After successful authentication, the backend returns a JWT token.

The frontend stores the token in:

```txt
localStorage
```

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📡 API Reference

# 🧑 Authentication APIs

## POST `/api/auth/signup`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt_token"
}
```

---

## POST `/api/auth/login`

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt_token"
}
```

---

# 💬 Chat APIs

## POST `/api/chat`

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

```json
{
  "message": "Hello AI"
}
```

### Response

```json
{
  "reply": "Hello! How can I help you today?"
}
```

---

## GET `/api/chats`

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Response

```json
{
  "chats": [
    {
      "_id": "123",
      "userMessage": "Hello",
      "botReply": "Hi there!",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

# 🧠 How It Works

1. User sends a message from the frontend
2. Backend receives the request
3. OpenRouter API processes the prompt
4. DeepSeek AI generates a response
5. Chat is saved in MongoDB
6. Response is returned to the frontend

---

# 🔒 Security Features

- Password hashing using bcrypt
- JWT token verification
- Protected API routes
- Environment variable protection
- MongoDB schema validation

---

# 🚀 Future Improvements

- Multi-chat conversations
- Streaming AI responses
- Voice input support
- Markdown rendering
- Chat deletion
- User profile management
- Dark/light mode
- File upload support
- AI memory/context support

---

# 🌐 Deployment

## Frontend
- Vercel
- Netlify

## Backend
- Render
- Railway

## Database
- MongoDB Atlas

---

# 📸 Screenshots

Add project screenshots here:

```md
![Login Page](./screenshots/login.png)

![Chat UI](./screenshots/chat.png)
```

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

Developed by **Areeba Ahmad**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.
