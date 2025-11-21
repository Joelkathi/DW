import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "./models/index.js";
import Product from "./models/product.js";
import Admin from "./models/admin.js";
import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import checkoutRoutes from "./routes/checkout.js";
import qrRoutes from "./routes/qr.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.DOMAIN || "http://localhost:5173" }));

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/auth", authRoutes);
app.use("/products", publicRoutes);      // GET /products, GET /products/:id (public)
app.use("/admin", adminRoutes);          // product CRUD + upload (requires JWT)
app.use("/checkout", checkoutRoutes);    // create checkout session
app.use("/qr", qrRoutes);                // create qr

// root
app.get("/", (req, res) => res.send("Daaruwala API"));

// sync DB and create admin if missing
(async () => {
  await sequelize.sync();
  const adminExists = await Admin.findOne();
  if (!adminExists && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) {
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password_hash: process.env.ADMIN_PASSWORD_HASH
    });
    console.log("Admin user created from .env");
  } else if (!adminExists) {
    console.log("No admin user exists. Create one with the script.");
  }
})();

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
