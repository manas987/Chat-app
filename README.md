# Chat App 💬

A modern, real-time chat application built with a premium minimal design. It features instant messaging via WebSockets, user authentication, and a clean, responsive interface.

## 🌟 Features

- **Real-Time Messaging:** Instant message delivery powered by WebSockets.
- **User Authentication:** Secure login and signup flows using JWT and Bcrypt.
- **User Discovery:** Search functionality to find and start conversations with other users.
- **Premium Minimalist UI:** A clean, warm, editorial-style interface designed for excellent user experience without the clutter.
- **Chat History:** Persistent message history loaded instantly when opening a conversation.
- **Responsive Layout:** Beautiful fluid design using Tailwind CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (custom minimal theme)
- **Icons:** Lucide React
- **Routing:** React Router v6
- **Real-Time:** Native WebSockets API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Real-Time:** `ws` (WebSocket server)
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt for password hashing

## 🚀 Getting Started

To run this project locally, you will need Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone git@github.com:manas987/Chat-app.git
cd Chat-app
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory with the following variables:
```env
PORT=3100
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd Frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Access the App
Open your browser and navigate to `http://localhost:5173` (or the port Vite provides) to start using the chat application.


