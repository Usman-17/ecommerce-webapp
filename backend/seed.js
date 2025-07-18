import dotenv from "dotenv";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import User from "./models/user.model.js";
import Review from "./models/review.model.js";
import Product from "./models/product.model.js";

// 🔌 Connect to MongoDB
dotenv.config();
await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Connected to MongoDB");

// 📌 Pakistani Names
const pakistaniNames = [
  "Ali Raza",
  "Usman Arif",
  "Ayesha Khan",
  "Fatima Noor",
  "Ahmed Nawaz",
  "Zainab Tariq",
  "Bilal Saeed",
  "Hassan Javed",
  "Sana Malik",
  "Hira Shah",
  "Imran Qureshi",
  "Nadia Khan",
  "Waleed Butt",
  "Anum Fatima",
  "Fahad Sheikh",
  "Mehwish Iqbal",
  "Raza Ali",
  "Kiran Bukhari",
  "Junaid Tariq",
  "Sadia Rehman",
];

const pakistaniComments = [
  "بہت زبردست پراڈکٹ ہے، highly recommended!",
  "Quality bohat achi hai, mujhe bohat pasand ayi.",
  "Fast delivery aur packaging bhi best thi!",
  "Sahi cheez hai bhai, paisay wasool!",
  "Bilkul waisi hi item mili jaise photos mein thi!",
  "Bohat acha experience raha shopping ka!",
  "Value for money, next time bhi yahan se loonga!",
  "Nice packaging aur quick delivery, thank you!",
  "Awesome quality, thanks seller!",
  "Pehli baar online kuch acha mila hai 😂",
  "Excellent quality aur price bhi reasonable hai!",
  "MashAllah zabardast product!",
  "Service aur quality dono top notch hain!",
  "Best online purchase ever from Pakistan!",
  "On time delivery aur product bhi 10/10 hai!",
  "Har angle se perfect product hai!",
  "Jo order kiya tha wohi mila, amazing!",
  "Bohat acha laga, maa bhi khush ho gayi 😄",
  "Acha laga dekh kar k kisi ne dhoka nahi diya!",
  "High quality and trusted seller!",
];

const getRandomPakistaniName = () => faker.helpers.arrayElement(pakistaniNames);

const getRandomPakistaniComment = () =>
  faker.helpers.arrayElement(pakistaniComments);

const getRandomProfileImage = () =>
  `https://randomuser.me/api/portraits/${
    Math.random() < 0.5 ? "men" : "women"
  }/${faker.number.int({ min: 1, max: 75 })}.jpg`;

// 👤 Create 20 users if fewer than 20 exist
const createPakistaniUsers = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers >= 20) {
    console.log("✅ Enough users already exist");
    return await User.find().limit(20);
  }

  const newUsers = Array.from({ length: 20 }, () => ({
    fullName: getRandomPakistaniName(),
    email: faker.internet.email().toLowerCase(),
    mobile: faker.string.numeric({ length: 11, prefix: "03" }),
    password: faker.internet.password(),
    profileImg: {
      url: getRandomProfileImage(),
    },
  }));

  const createdUsers = await User.insertMany(newUsers);
  console.log("✅ Created 20 Pakistani users");
  return createdUsers;
};

// 📝 Add 20 reviews to each product
const addReviewsToProducts = async (users) => {
  const products = await Product.find();

  if (!products.length) {
    console.log("❌ No products found in the database.");
    process.exit(1);
  }

  for (const product of products) {
    const existingReviews = await Review.find({ product: product._id });
    const reviewedUserIds = new Set(
      existingReviews.map((r) => r.user.toString())
    );
    const newReviews = [];

    for (const user of users) {
      if (reviewedUserIds.has(user._id.toString())) continue;

      newReviews.push({
        user: user._id,
        product: product._id,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: getRandomPakistaniComment(),
      });

      if (newReviews.length >= 20) break;
    }

    if (newReviews.length) {
      await Review.insertMany(newReviews);
      console.log(
        `✅ ${newReviews.length} reviews added for "${product.title}"`
      );
    } else {
      console.log(
        `⚠️ Product "${product.title}" already reviewed by all users`
      );
    }
  }
};

// 🚀 Run Seeder
const runSeeder = async () => {
  try {
    const users = await createPakistaniUsers();
    await addReviewsToProducts(users);
    console.log("🎉 Seeder completed successfully.");
  } catch (err) {
    console.error("❌ Seeder failed:", err);
  } finally {
    mongoose.disconnect();
  }
};

runSeeder();
