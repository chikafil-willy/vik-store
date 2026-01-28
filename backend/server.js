import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Category tables
const categories = ["jewelries", "caps", "trousers", "shirts_and_polos", "shoes"];

// --------------------------------------------------------
// GET /api/product-stock?name=PRODUCT_NAME
// --------------------------------------------------------
app.get("/api/product-stock", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.json({ quantity: 0 });

    for (let category of categories) {
      const { data, error } = await supabase
        .from(category)
        .select("quantity")
        .eq("name", name)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Stock lookup error:", error);
        continue;
      }

      if (data) {
        return res.json({ quantity: data.quantity });
      }
    }

    return res.json({ quantity: 0 });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ quantity: 0 });
  }
});

// --------------------------------------------------------
// POST /api/orders
// --------------------------------------------------------
app.post("/api/orders", async (req, res) => {
  try {
    const { name, email, address, phone, products, total } = req.body;

    if (!name || !email || !address || !phone || !products?.length || !total) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1️⃣ CHECK STOCK AND ASSIGN CATEGORY
    for (let p of products) {
      let found = false;
      let productData = null;

      for (let category of categories) {
        const { data, error } = await supabase
          .from(category)
          .select("id, name, quantity")
          .eq("name", p.name)
          .single();

        if (error && error.code !== "PGRST116") console.error("Stock lookup error:", error);

        if (data) {
          found = true;
          productData = data;
          p.category = category;
          break;
        }
      }

      if (!found) {
        return res.status(400).json({ success: false, message: `Product not found: ${p.name}` });
      }

      if (productData.quantity < p.qty) {
        return res.status(400).json({ success: false, message: `Product "${p.name}" is out of stock` });
      }
    }

    // 2️⃣ REDUCE STOCK
    for (let p of products) {
      const { data: current, error: fetchError } = await supabase
        .from(p.category)
        .select("quantity")
        .eq("name", p.name)
        .single();

      if (fetchError) return res.status(500).json({ success: false, message: fetchError.message });

      const newQty = current.quantity - p.qty;

      const { error: updateError } = await supabase
        .from(p.category)
        .update({ quantity: newQty })
        .eq("name", p.name);

      if (updateError) return res.status(500).json({ success: false, message: updateError.message });
    }

    // 3️⃣ INSERT ORDER RECORD
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([{ name, email, address, phone, items: products, total }])
      .select()
      .single();

    if (orderError) return res.status(500).json({ success: false, message: "Failed to place order", error: orderError.message });

    return res.status(200).json({ success: true, message: "Order placed successfully!", order: orderData });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ success: false, message: "Server crashed", error: err.message });
  }
});

// --------------------------------------------------------
// START SERVER
// --------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
