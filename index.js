const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// JWT Verification Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Unauthorized access: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ message: "Forbidden access: Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db(process.env.DB_NAME || "booknookDB");
    const booksCollection = db.collection("books");
    const borrowsCollection = db.collection("borrows");

    // ----------------- JWT TOKEN GENERATION -----------------
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    });

    // ----------------- BOOKS APIS -----------------

    // 1. GET /books - Public
    app.get("/books", async (req, res) => {
      try {
        const { limit, sort, userEmail } = req.query;
        let query = {};

        if (userEmail) {
          query = { userEmail: userEmail };
        }

        let cursor = booksCollection.find(query);

        if (sort === "newest") {
          cursor = cursor.sort({ createdAt: -1 });
        }

        if (limit) {
          cursor = cursor.limit(parseInt(limit));
        }

        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching books", error });
      }
    });

    // 2. GET /books/:id - Details
    app.get("/books/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.findOne(query);
        if (!result) {
          return res.status(404).send({ message: "Book not found" });
        }
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error fetching book details", error });
      }
    });

    // Payload validator for book creation
    const validateBookPayload = (req, res, next) => {
      const { title, author, category } = req.body;
      if (!title || !author || !category) {
        return res.status(400).send({
          message: "Title, author, and category are required fields.",
        });
      }
      next();
    };

    // 3. POST /books - Add Book (Private)
    app.post("/books", verifyToken, validateBookPayload, async (req, res) => {
      try {
        const bookData = req.body;
        bookData.totalCopies = parseInt(bookData.totalCopies) || 1;
        bookData.createdAt = new Date();

        const result = await booksCollection.insertOne(bookData);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add book", error });
      }
    });

    // 4. PATCH /books/:id - Update Book (Private)
    app.patch("/books/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedData = req.body;

        if (updatedData.totalCopies) {
          updatedData.totalCopies = parseInt(updatedData.totalCopies);
        }

        delete updatedData._id;

        const updateDoc = {
          $set: updatedData,
        };

        const result = await booksCollection.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update book", error });
      }
    });

    // 5. DELETE /books/:id - Delete Book (Private)
    app.delete("/books/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await booksCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to delete book", error });
      }
    });

    // ----------------- BORROWS APIS -----------------

    // 6. POST /borrows - Borrow a book (Private + Challenge logic)
    app.post("/borrows", verifyToken, async (req, res) => {
      try {
        const borrowData = req.body;
        const { bookId, userEmail } = borrowData;

        // Challenge 1: Double borrow check
        const existingBorrow = await borrowsCollection.findOne({
          bookId: bookId,
          userEmail: userEmail,
        });

        if (existingBorrow) {
          return res.status(400).send({
            message:
              "You have already borrowed this book. Please return it before borrowing again.",
          });
        }

        // Challenge 2: Stock check & decrement
        const book = await booksCollection.findOne({
          _id: new ObjectId(bookId),
        });
        if (!book || book.totalCopies <= 0) {
          return res
            .status(400)
            .send({ message: "Book is currently out of stock." });
        }

        borrowData.borrowDate = new Date();
        const borrowResult = await borrowsCollection.insertOne(borrowData);

        await booksCollection.updateOne(
          { _id: new ObjectId(bookId) },
          { $inc: { totalCopies: -1 } },
        );

        res.status(201).send(borrowResult);
      } catch (error) {
        res.status(500).send({ message: "Failed to borrow book", error });
      }
    });

    // 7. GET /borrows - Get user borrows (Private)
    app.get("/borrows", verifyToken, async (req, res) => {
      try {
        const userEmail = req.query.email;

        if (req.user.email !== userEmail) {
          return res
            .status(403)
            .send({ message: "Forbidden access to user borrow records" });
        }

        const query = { userEmail: userEmail };
        const result = await borrowsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Failed to retrieve borrow list", error });
      }
    });

    // 8. DELETE /borrows/:id - Return a book (Private + Challenge logic)
    app.delete("/borrows/:id", verifyToken, async (req, res) => {
      try {
        const borrowId = req.params.id;
        const borrowRecord = await borrowsCollection.findOne({
          _id: new ObjectId(borrowId),
        });

        if (!borrowRecord) {
          return res.status(404).send({ message: "Borrow record not found" });
        }

        const deleteResult = await borrowsCollection.deleteOne({
          _id: new ObjectId(borrowId),
        });

        // Stock increment by 1
        await booksCollection.updateOne(
          { _id: new ObjectId(borrowRecord.bookId) },
          { $inc: { totalCopies: 1 } },
        );

        res.send({ message: "Book returned successfully", deleteResult });
      } catch (error) {
        res.status(500).send({ message: "Failed to return book", error });
      }
    });

    app.get("/", (req, res) => {
      res.send("BookNook Server is running smoothly!");
    });

    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// Process keep-alive handling
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
