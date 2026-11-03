const { MongoClient, ServerApiVersion } = require("mongodb");

require("dotenv").config();

const sampleBooks = [
  // ----------------- FICTION -----------------
  {
    title: "Love By The Book",
    author: "Jessica George",
    category: "Fiction",
    totalCopies: 5,
    rating: 4.8,
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1751287829l/231127042._SY475_.jpg",
    description:
      "Remy is an expert at keeping her life meticulously organized, which makes her the ideal candidate to assist a chaotic, high-profile book editor. But as she navigates office politics and unexpected friendships, she discovers that letting go of perfectionism might be the greatest adventure of all.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    totalCopies: 6,
    rating: 4.7,
    image:
      "https://m.media-amazon.com/images/I/617lxveUjYL._AC_UF894,1000_QL80_.jpg",
    description:
      "Embarking on a magical desert journey, a young Andalusian shepherd follows his recurring dreams to find a hidden treasure and his true destiny.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },

  // ----------------- KIDS & YOUNG READERS -----------------
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Kids & Young Readers",
    totalCopies: 4,
    rating: 4.6,
    image:
      "https://m.media-amazon.com/images/I/81gzleLabBL._AC_UF1000,1000_QL80_.jpg",
    description:
      "Bilbo Baggins was perfectly content living a quiet life in his comfortable hobbit-hole until a wizard and a band of homeless dwarves drag him into an epic adventure. Now, he must brave treacherous mountains, giant spiders, and a dragon's hoard to help reclaim a lost kingdom.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Shadow and Bone",
    author: "Leigh Bardugo",
    category: "Kids & Young Readers",
    totalCopies: 5,
    rating: 4.7,
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1519072763i/37834723.jpg",
    description:
      "A powerless orphan discovers a rare magical light capable of destroying a terrifying shadow.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Harry Potter",
    author: "J.K. Rowling",
    category: "Kids & Young Readers",
    totalCopies: 8,
    rating: 4.9,
    image:
      "https://m.media-amazon.com/images/I/71LAk2VRj9L._AC_UF894,1000_QL80_.jpg",
    description:
      "An orphaned boy discovers he is a famous wizard and enters a magical world of hidden danger, destiny, and lifelong friendship.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },

  // ----------------- SELF-HELP -----------------
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Self-Help",
    totalCopies: 6,
    rating: 4.8,
    image:
      "https://upload.wikimedia.org/wikipedia/en/2/20/The_Psychology_of_Money_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    description:
      "Discover how your personal behavior, ego, and worldview shape financial decisions, proving that doing well with money has little to do with raw intelligence.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Never Finished",
    author: "David Goggins",
    category: "Self-Help",
    totalCopies: 6,
    rating: 4.8,
    image:
      "https://m.media-amazon.com/images/I/81uWWAHp25L._AC_UF1000,1000_QL80_.jpg",
    description:
      "Take a ruthless, no-excuses look inside your own mind to shatter mental limits, embrace discomfort, and dominate every goal.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Big Magic: Creative Living Beyond Fear",
    author: "Elizabeth Gilbert",
    category: "Self-Help",
    totalCopies: 4,
    rating: 4.5,
    image: "https://images.gr-assets.com/books/1451446242l/24453082.jpg",
    description:
      "Stop letting fear dictate your life and discover how to pursue your creative passions with curiosity, courage, and joy.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    category: "Self-Help",
    totalCopies: 5,
    rating: 4.7,
    image:
      "https://www.hachette.co.uk/wp-content/uploads/2025/07/hbg-title-deep-work-5-51.jpg",
    description:
      "Learn how to cultivate rare, distraction-free focus to dramatically upgrade your productivity and master cognitively demanding tasks.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    totalCopies: 7,
    rating: 4.9,
    image:
      "https://d1y2du6z1jfm9e.cloudfront.net/covers/a89202bd-f8ac-42f6-a271-2335c50fba84/image_resized.webp",
    description:
      "Master the compounding power of small habits to break bad routines, build good ones, and completely transform your life.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },

  // ----------------- THRILLER & MYSTERY -----------------
  {
    title: "Gone Girl",
    author: "Gillian Flynn",
    category: "Thriller & Mystery",
    totalCopies: 4,
    rating: 4.5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMmpw_BdT-9y2lbRqAKcCqxzAGoHpKZB7l2Rpwdpfce5z6PA-Dp9U_x98v&s=10",
    description:
      "A husband under intense suspicion after his wife goes missing realizes the shocking web of lies is much deeper than anyone imagines.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "The Guest List",
    author: "Lucy Foley",
    category: "Thriller & Mystery",
    totalCopies: 4,
    rating: 4.4,
    image:
      "https://upload.wikimedia.org/wikipedia/en/f/fd/The_Guest_List_by_Lucy_Foley.jpeg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    description:
      "A celebrity wedding on a storm-swept Irish coast takes a deadly turn when an unexpected murder traps everyone with a killer.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Verity",
    author: "Colleen Hoover",
    category: "Thriller & Mystery",
    totalCopies: 5,
    rating: 4.5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFm-UslSngZog4eHdFMJJ8JbVO6BgSo-fEnQTZzDG7SFPm2lt3HAhH414&s=10",
    description:
      "A struggling writer takes a lucrative job completing a paralyzed author's autobiography, only to unearth a horrifying, hidden truth.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "The Maidens",
    author: "Alex Michaelides",
    category: "Thriller & Mystery",
    totalCopies: 3,
    rating: 4.3,
    image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1608557750l/45300567.jpg",
    description:
      "A grieving therapist infiltrates a secretive society of female students at Cambridge to stop a charismatic professor from killing again.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    category: "Thriller & Mystery",
    totalCopies: 5,
    rating: 4.6,
    image:
      "https://www.bookowlsbd.com/cdn/shop/files/TheSilentPatientNovelbyAlexMichaelides_6753bce4-b922-45d5-9212-65cae633c701.png?v=1754896633",
    description:
      "A woman shoots her husband five times and falls into total silence—leaving one obsessed psychotherapist to unlock her chilling secret.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },

  // ----------------- SCIENCE FICTION -----------------
  {
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    totalCopies: 6,
    rating: 4.9,
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
    description:
      "Thrust into a deadly interstellar conspiracy on the desert world of Arrakis, young Paul Atreides must survive giant sandworms and imperial betrayal.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Delta-v",
    author: "Daniel Suarez",
    category: "Science Fiction",
    totalCopies: 3,
    rating: 4.5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-g02Ycrk5wbMdGkPUlW4kuFmyTGU17MGvDstIEOlL8edDnVUt7UzYKX8&s=10",
    description:
      "Tricked into joining a secretive space mission, an elite team of thrill-seekers must mine a perilous asteroid just to make it home.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Critical Mass",
    author: "Daniel Suarez",
    category: "Science Fiction",
    totalCopies: 4,
    rating: 4.6,
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1663513598i/60149528.jpg",
    description:
      "Defying Earth's governments and a new Cold War in orbit, rogue asteroid miners risk everything to save their stranded crewmates.",
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "The Martian",
    author: "Andy Weir",
    category: "Science Fiction",
    totalCopies: 4,
    rating: 4.7,
    image: "https://cdn2.penguin.com.au/covers/original/9781785031137.jpg",
    description:
      'Left for dead on the desolate surface of Mars, lone astronaut Mark Watney must "science the heck" out of survival until rescue arrives.',
    userEmail: "admin@booknook.com",
    userName: "BookNook Admin",
    createdAt: new Date(),
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    category: "Science Fiction",
    totalCopies: 5,
    rating: 4.8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVH8a8SVC7dxMUi-cx2HaLs8LMJcVgesSbpbZAgJsQATiYam-LH-eIFwo&s=10",
    description:
      "A lone amnesiac astronaut must use science, ingenuity, and an unexpected interstellar friendship to save Earth from extinction.",
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

    // Purono test data ebong borrows clear kora
    console.log("Cleaning old test data...");

    await db.collection("books").deleteMany({});
    await db.collection("borrows").deleteMany({});

    // Reverse order-e notun 20-ti books insert kora
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
