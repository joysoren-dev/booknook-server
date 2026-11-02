const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const sampleBooks = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    totalCopies: 6,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    description:
      "Set in Maycomb, Alabama during the Great Depression, this classic explores racial injustice and moral courage through the eyes of young Scout Finch.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    totalCopies: 5,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    description:
      "Theoretical physicist Stephen Hawking explores black holes, the big bang, and the search for the unified Theory of Everything.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || "booknookDB");
    const result = await db.collection("books").insertMany(sampleBooks);
    console.log(`Seeding successful! Inserted count: ${result.insertedCount}`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
