# QuickChat — Backend

REST API and WebSocket server for the QuickChat messaging app, built with Node.js and Express.

> The frontend lives in the [quickchat-client](https://github.com/aymene-dev/quickchat-client) repository.  
> 🔗 **Live app:** [quick-chat-client-woad-eight.vercel.app](https://quick-chat-client-woad-eight.vercel.app)

---

## Features

- **Authentication** — Register, login, logout, JWT access tokens + refresh tokens
- **Conversations** — Create private or group conversations, manage members (add, remove, roles)
- **Messages** — Send, edit, soft-delete messages, retrieve conversation history
- **Real-time** — WebSocket server with Socket.io, room-based broadcasting
- **Media** — Avatar upload handled via Cloudinary on the client side, URLs stored in DB
- **Security** — JWT middleware, bcrypt password hashing, input validation, rate limiting, CORS

---

## Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Socket.io** for real-time messaging
- **JWT** (jsonwebtoken) for authentication
- **bcrypt** for password hashing
- **express-validator** for input validation
- **express-rate-limit** for rate limiting
- **Helmet** for HTTP security headers
- **dotenv** for environment variables

---

## Getting Started

```bash
git clone https://github.com/aymene-dev/quickChat
cd quickChat
npm install
```

Create a `.env` file at the root:

```
PORT=3000
DB_CONN_URI=mongodb+srv://...
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

Then run:

```bash
npm run dev
```

---

## Project Structure

```
src/
├── controllers/
│   ├── auth.controller.js         # Register, login, logout, refresh token
│   ├── conversation.controller.js # CRUD conversations + member management
│   ├── message.controller.js      # Send, edit, delete, retrieve messages
│   └── user.controller.js         # User search, profile
├── db/
│   └── index.js                   # MongoDB connection
├── middlewares/
│   └── auth.middleware.js         # JWT verification
├── models/
│   ├── conversation.model.js
│   ├── conversationMember.model.js
│   ├── message.model.js
│   ├── refreshToken.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── conversations.routes.js
│   ├── message.routes.js
│   └── user.routes.js
├── utils/
│   ├── jwt.utils.js               # Generate access/refresh tokens
│   ├── password.utils.js          # Hash and compare passwords
│   └── socket.utils.js            # Socket.io initialization
├── validators/
│   ├── message.validator.js
│   └── user.validator.js
└── index.js                       # Entry point
```

---

## API Routes

### Auth

| Method | Route            | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/auth/register` | Create a new account     |
| POST   | `/auth/login`    | Login and receive tokens |
| POST   | `/auth/refresh`  | Refresh access token     |
| POST   | `/auth/logout`   | Logout                   |

### Conversations

| Method | Route                              | Description                                |
| ------ | ---------------------------------- | ------------------------------------------ |
| POST   | `/conversation/createConversation` | Create a private or group conversation     |
| GET    | `/conversation/userConvs`          | Get all conversations for the current user |
| GET    | `/conversation/convMembers`        | Get members of a conversation              |
| POST   | `/conversation/addMember`          | Add a member to a group                    |
| DELETE | `/conversation/deleteMember`       | Remove a member from a group               |

### Messages

| Method | Route              | Description                      |
| ------ | ------------------ | -------------------------------- |
| POST   | `/message/send`    | Send a message                   |
| GET    | `/message/recover` | Get messages from a conversation |
| PUT    | `/message/update`  | Edit a message                   |
| DELETE | `/message/delete`  | Soft-delete a message            |

### Users

| Method | Route           | Description              |
| ------ | --------------- | ------------------------ |
| GET    | `/users/search` | Search users by username |

---

## WebSocket Events

| Event               | Direction       | Description                             |
| ------------------- | --------------- | --------------------------------------- |
| `joinConversation`  | Client → Server | Join a conversation room                |
| `leaveConversation` | Client → Server | Leave a conversation room               |
| `newMessage`        | Server → Client | Broadcast a new message to room members |

---

## Roadmap

This is an MVP. Planned features that will definitely be implemented someday (narrator: they won't):

- [ ] End-to-end encryption
- [ ] Push notifications
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File and image sharing in messages
- [ ] Admin transfer
- [ ] Account deletion

---

## Deployment

- **Backend** — Railway
- **Database** — MongoDB Atlas
