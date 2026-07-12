# ChatFlow - Real-time Chat Application

A modern, feature-rich real-time chat application built with React, Node.js, Express, Socket.io, and MongoDB.

## Features

### Core Features
- **Real-time messaging** using Socket.io
- **Chat history persistence** with MongoDB
- **Message timestamps** with smart formatting
- **User authentication** (dummy username-based)
- **Responsive design** for web and mobile

### Bonus Features
- **Typing indicators** - See when others are typing
- **Online/offline status** - Real-time user presence
- **Message read/delivered status** - Track message delivery
- **User avatars** - Colorful auto-generated avatars based on username
- **System messages** - Join/leave notifications stored in database
- **User chat history** - Click any user to view all their messages
- **Smooth animations** - Modern UI transitions and floating elements
- **Glass morphism design** - Beautiful glass-effect UI elements

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Socket.io Client
- date-fns for date formatting

### Backend
- Node.js with Express
- Socket.io for real-time communication
- MongoDB with Mongoose
- CORS middleware

## Project Structure

```
Chat Project/
├── client/                     # React frontend
│   ├── public/
│   │   └── chat.svg           # App icon
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ChatHeader.jsx      # App header with connection status
│   │   │   ├── ChatWindow.jsx      # Main chat layout container
│   │   │   ├── LoginModal.jsx      # Username login screen
│   │   │   ├── MessageInput.jsx    # Message input with auto-resize
│   │   │   ├── MessageItem.jsx     # Individual message bubble
│   │   │   ├── MessageList.jsx     # Scrollable message container
│   │   │   ├── SystemMessage.jsx   # Join/leave notifications
│   │   │   ├── TypingIndicator.jsx # Typing animation display
│   │   │   └── UserList.jsx        # Sidebar with online users
│   │   ├── context/
│   │   │   └── ChatContext.jsx     # Global auth state management
│   │   ├── hooks/
│   │   │   └── useSocket.js        # Socket.io connection logic
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── App.jsx                 # Root component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles & animations
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Node.js backend
│   ├── config/
│   │   └── db.js              # MongoDB connection setup
│   ├── controllers/
│   │   └── messageController.js   # REST API controllers
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling middleware
│   ├── models/
│   │   ├── Message.js         # Message schema (messages + system)
│   │   └── User.js            # User schema with online status
│   ├── routes/
│   │   └── messageRoutes.js   # REST API routes
│   ├── socket/
│   │   └── socketHandler.js   # Socket.io event handlers
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Express server entry point
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Environment Variables

### Server (.env)

```env
PORT=5000
MONGODB_URI=mongodb:mongodb://prakashjha:4YixoUXSGlFHZ8C6@ac-dfdhsmj-shard-00-00.mwessps.mongodb.net:27017,ac-dfdhsmj-shard-00-01.mwessps.mongodb.net:27017,ac-dfdhsmj-shard-00-02.mwessps.mongodb.net:27017/chatting-App?ssl=true&retryWrites=true&w=majority&replicaSet=atlas-q87ii6-shard-0&authSource=admin&appName=Cluster0
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (Optional .env)

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Chat Project"
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file with the environment variables listed above.

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Start MongoDB

Make sure MongoDB is running locally:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas and update the `MONGODB_URI` in your `.env` file.

## API Endpoints

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages` | Fetch chat history |
| POST | `/api/messages` | Send a new message |
| PUT | `/api/messages/:id/read` | Mark message as read |

### Query Parameters for GET /api/messages

- `room` (string): Chat room name (default: "general")
- `limit` (number): Number of messages to fetch (default: 50)
- `before` (ISO date): Fetch messages before this date

## Socket Events

### Client → Server

| Event | Data | Description |
|-------|------|-------------|
| `user:join` | `username` | Join the chat |
| `message:send` | `{username, content, to, room}` | Send a message (DM or general) |
| `typing:start` | `username` | Start typing indicator |
| `typing:stop` | `username` | Stop typing indicator |
| `message:read` | `{messageId, username}` | Mark message as read |
| `messages:fetch-user` | `targetUsername` | Fetch all messages from a user |
| `messages:fetch-general` | - | Re-fetch general chat messages |

### Server → Client

| Event | Data | Description |
|-------|------|-------------|
| `messages:history` | `messages[]` | Receive general chat history |
| `system:history` | `messages[]` | Receive system messages (join/leave) |
| `message:new` | `message` | New message received |
| `system:message` | `message` | New system message (join/leave) |
| `users:update` | `users[]` | All users list with status |
| `typing:update` | `{username, isTyping}` | Typing status update |
| `messages:user-history` | `{username, messages[]}` | Messages from specific user |
| `message:readUpdate` | `{messageId, readBy}` | Read status update |

## Data Model

### Message Schema

| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Sender's username |
| `to` | String | Recipient (for DMs) |
| `content` | String | Message text |
| `room` | String | Room name ("general" or private) |
| `type` | String | "message", "join", or "leave" |
| `readBy` | [String] | Users who read the message |
| `createdAt` | Date | Auto-generated timestamp |

### User Schema

| Field | Type | Description |
|-------|------|-------------|
| `username` | String | Unique username |
| `status` | String | "online" or "offline" |
| `lastSeen` | Date | Last activity timestamp |

## Design Decisions

### Architecture
- **Separation of concerns**: Clean separation between frontend and backend
- **Component-based UI**: Reusable React components
- **Custom hooks**: Encapsulated socket logic in `useSocket` hook
- **Context API**: Global state management for user authentication

### Real-time Communication
- **Socket.io**: Chosen for reliable real-time bidirectional communication
- **WebSocket with fallback**: Automatic fallback to polling if WebSocket fails
- **Event-based architecture**: Clean event handling for different message types

### Data Storage
- **MongoDB**: Flexible document storage for messages and users
- **Indexed queries**: Optimized message retrieval with compound indexes
- **Message persistence**: All messages and system events stored for history retrieval
- **Type field**: Messages categorized as "message", "join", or "leave"

### UI/UX
- **Glass morphism**: Modern glass-effect design elements
- **Gradient accents**: Visually appealing color schemes
- **Smooth animations**: CSS transitions for enhanced user experience
- **Responsive layout**: Works on desktop and mobile devices
- **Dynamic avatars**: Colorful avatars generated from username initials
- **Empty state design**: Attractive welcome screen with floating elements

## Assumptions

1. **No authentication required**: Users only need to enter a username
2. **Single chat room**: All users chat in a "general" room by default
3. **No message deletion**: Messages are permanent once sent
4. **Username uniqueness**: Not enforced - multiple users can have the same name
5. **No rate limiting**: Messages can be sent without limits
6. **MongoDB available**: Assumes MongoDB is running locally or accessible via Atlas

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, please open an issue in the repository.
