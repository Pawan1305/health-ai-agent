# 🏥 MediMind AI — Healthcare AI Agent

A full-stack MERN application featuring an AI-powered healthcare assistant with **real-time streaming responses**, **medical context personalization**, and a stunning premium dark UI.

---

## ✨ Features

- 🤖 **AI-Powered Q&A** — Powered by Google Gemini 1.5 Flash (free tier)
- 🏥 **Medical Context** — Personalize responses with your health profile
- ⚡ **Streaming Responses** — Real-time token-by-token response like ChatGPT
- 💬 **Conversation History** — Persist chats in MongoDB
- 🌙 **Premium Dark UI** — Glassmorphism, animated gradients, Framer Motion
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 📋 **Markdown Rendering** — Formatted AI responses with code blocks, tables, lists

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + Vite + Tailwind CSS + Framer Motion |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **AI** | Google Gemini 1.5 Flash |
| **Animations** | Framer Motion + CSS Animations |
| **Icons** | Lucide React |

---

## 🚀 Quick Start

### Step 1 — Get Free Gemini API Key

1. Visit **[Google AI Studio](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key (starts with `AIza...`)

> 🎁 **Free Tier**: 15 requests/min, 1M tokens/day — more than enough for demo!

---

### Step 2 — Clone & Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY
npm run dev
```

### Step 3 — Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 4 — Open the App

Visit `http://localhost:5173` 🎉

---

## 📁 Project Structure

```
health-ai-agent/
├── backend/
│   ├── server.js              # Express server
│   ├── config/db.js           # MongoDB connection
│   ├── models/
│   │   └── Conversation.js    # Chat history model
│   ├── routes/
│   │   ├── chat.js            # AI chat + streaming
│   │   └── context.js         # Context validation
│   └── middleware/
│       └── errorHandler.js
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── context/AppContext.jsx   # Global state
    │   ├── services/api.js           # API + streaming
    │   ├── pages/
    │   │   ├── LandingPage.jsx       # Hero landing
    │   │   └── ChatPage.jsx          # Chat interface
    │   └── components/
    │       ├── Navbar.jsx
    │       ├── ChatWindow.jsx
    │       ├── MessageBubble.jsx     # Markdown + streaming
    │       ├── InputArea.jsx
    │       ├── ContextSidebar.jsx    # Medical context panel
    │       ├── ConversationList.jsx
    │       └── TypingIndicator.jsx
    └── tailwind.config.js
```

---

## 🔧 Environment Variables

### `backend/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/medimind
GEMINI_API_KEY=AIza...your_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 💡 How It Works

1. **Add Medical Context** — Enter your age, conditions, medications, allergies
2. **Ask Questions** — Chat naturally about symptoms, medications, conditions
3. **AI Personalization** — Gemini uses your context for tailored responses
4. **Stream & Save** — Responses stream in real-time and save to MongoDB

---

## ⚠️ Medical Disclaimer

> MediMind AI is for **educational purposes only**. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.

---

## 📄 License

MIT — Built for resume showcase purposes.
# health-ai-agent
