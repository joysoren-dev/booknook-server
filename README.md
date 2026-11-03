# 📚 BookNook Server – API & Backend Services

Backend RESTful API service for **BookNook**, powering authentication, book catalog management, and real-time borrowing lifecycle operations.

---

## 🌐 Connected Repositories & Live App

- **Live Client URL:** https://booknook-client-gamma.vercel.app/
- **Client Repository:** https://github.com/joysoren-dev/booknook-client
- **Server Repository:** https://github.com/joysoren-dev/booknook-server

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Native Driver)
- **Authentication & Security:** JSON Web Tokens (JWT), BetterAuth compatibility, CORS, Cookie-Parser, Dotenv
- **Deployment:** Vercel

---

## ✨ Key Backend Features & Endpoints

### 1. Books Management (`/books`)
- `GET /books` — Retrieve all books (supports filtering, sorting newest first, and limits)
- `GET /books/:id` — Fetch specific book details by ID
- `POST /books` — Add a new book listing (protected)
- `PATCH /books/:id` — Update existing book information (protected)
- `DELETE /books/:id` — Remove a contributed book entry (protected)

### 2. Borrow & Return Operations (`/borrows`)
- `POST /borrows` — Borrow a book (validates quantity > 0 and prevents duplicate active borrows)
- `GET /borrows/my` — Fetch all books currently borrowed by the authenticated user
- `DELETE /borrows/:id` — Return a borrowed book and automatically restore the inventory count

---

## 🚀 Local Development Setup

### 1. Clone the repository
git clone https://github.com/joysoren-dev/booknook-server.git
cd booknook-server

### 2. Install dependencies
npm install

### 3. Environment Configuration
Create a `.env` file in the root directory:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000

### 4. Run the server
npm run dev
# or
node index.js
