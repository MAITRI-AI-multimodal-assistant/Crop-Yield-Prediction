import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/productModel.js";

dotenv.config();

// 🔗 Connect DB
await mongoose.connect(process.env.MONGO_URI);

// 🌾 Products Data
const products = [
  {
    name: "Basmati Rice",
    category: "crops",
    price: 3200,
    unit: "quintal",
    quantity: 100,
    state: "Punjab",
    seller: "Gurpreet Farms",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
  },
  {
    name: "Wheat",
    category: "crops",
    price: 2200,
    unit: "quintal",
    quantity: 200,
    state: "Uttar Pradesh",
    seller: "Sharma Agro",
    badge: "Govt. Rate",
    image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc",
  },
  {
    name: "Maize",
    category: "crops",
    price: 1800,
    unit: "quintal",
    quantity: 150,
    state: "Bihar",
    seller: "Kisan Growers",
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1592928302636-c83cf1b94c0f",
  },
  {
    name: "Sugarcane",
    category: "crops",
    price: 300,
    unit: "quintal",
    quantity: 500,
    state: "Maharashtra",
    seller: "Green Fields",
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71",
  },
  {
    name: "Cotton",
    category: "crops",
    price: 6500,
    unit: "quintal",
    quantity: 120,
    state: "Gujarat",
    seller: "Cotton Hub",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1598514982732-2b1f33c61c64",
  },
  {
    name: "Paddy",
    category: "crops",
    price: 2000,
    unit: "quintal",
    quantity: 300,
    state: "West Bengal",
    seller: "Bengal Farmers",
    badge: "Govt. Rate",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
  },
  {
    name: "Mustard",
    category: "crops",
    price: 5500,
    unit: "quintal",
    quantity: 130,
    state: "Haryana",
    seller: "Golden Seeds",
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c1a7c2db",
  },
  {
    name: "Soybean",
    category: "crops",
    price: 4200,
    unit: "quintal",
    quantity: 140,
    state: "Madhya Pradesh",
    seller: "MP Agro",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71",
  },
  {
    name: "Potato",
    category: "crops",
    price: 1200,
    unit: "quintal",
    quantity: 300,
    state: "West Bengal",
    seller: "Veggie Market",
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1582515073490-dc2a4d1c53a6",
  },
  {
    name: "Onion",
    category: "crops",
    price: 1800,
    unit: "quintal",
    quantity: 250,
    state: "Maharashtra",
    seller: "Onion Traders",
    badge: "Govt. Rate",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510",
  },
  {
    name: "Hybrid Rice",
    category: "crops",
    price: 2800,
    unit: "quintal",
    quantity: 180,
    state: "West Bengal",
    seller: "Krishi Farms",
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
  },
  {
    name: "Red Chilli",
    category: "crops",
    price: 7000,
    unit: "quintal",
    quantity: 70,
    state: "Andhra Pradesh",
    seller: "Spice Growers",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
  },

  // 🌱 SEEDS
  {
    name: "Wheat Seeds HD-2967",
    category: "seeds",
    price: 120,
    unit: "kg",
    quantity: 500,
    state: "Punjab",
    seller: "Seed Corp",
    badge: "Certified",
    image: "https://images.unsplash.com/photo-1592928302636-c83cf1b94c0f"
  },
  {
    name: "Rice Seeds IR-64",
    category: "seeds",
    price: 150,
    unit: "kg",
    quantity: 400,
    state: "Tamil Nadu",
    seller: "Agri Seeds Ltd",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c"
  },
  {
    name: "Maize Hybrid Seeds",
    category: "seeds",
    price: 200,
    unit: "kg",
    quantity: 350,
    state: "Bihar",
    seller: "Hybrid Seeds Co",
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1592928302636-c83cf1b94c0f"
  },
  {
    name: "Vegetable Seed Pack",
    category: "seeds",
    price: 300,
    unit: "pack",
    quantity: 250,
    state: "Delhi",
    seller: "Urban Grow",
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec"
  },

  // 🧪 FERTILISERS
  {
    name: "Urea Fertilizer",
    category: "fertilisers",
    price: 300,
    unit: "bag",
    quantity: 600,
    state: "Uttar Pradesh",
    seller: "IFFCO",
    badge: "Govt. Rate",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71"
  },
  {
    name: "DAP Fertilizer",
    category: "fertilisers",
    price: 1350,
    unit: "bag",
    quantity: 450,
    state: "Haryana",
    seller: "Agri Supply",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71"
  },
  {
    name: "Organic Compost",
    category: "fertilisers",
    price: 500,
    unit: "bag",
    quantity: 300,
    state: "Karnataka",
    seller: "Eco Farms",
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1615486363224-0dbd8cba56c7"
  },
  {
    name: "Potash Fertilizer",
    category: "fertilisers",
    price: 900,
    unit: "bag",
    quantity: 200,
    state: "Punjab",
    seller: "Fertilizer Hub",
    badge: "Certified",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71"
  },

  // 🚜 EQUIPMENT
  {
    name: "Mini Tractor",
    category: "equipment",
    price: 250000,
    unit: "piece",
    quantity: 10,
    state: "Punjab",
    seller: "Mahindra Agro",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1598514982732-2b1f33c61c64"
  },
  {
    name: "Power Tiller",
    category: "equipment",
    price: 80000,
    unit: "piece",
    quantity: 25,
    state: "Tamil Nadu",
    seller: "Farm Equipments",
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1598514982732-2b1f33c61c64"
  },
  {
    name: "Sprayer Machine",
    category: "equipment",
    price: 5000,
    unit: "piece",
    quantity: 100,
    state: "Maharashtra",
    seller: "Agri Tools",
    badge: "Certified",
    image: "https://images.unsplash.com/photo-1598514982732-2b1f33c61c64"
  },
  {
    name: "Water Pump",
    category: "equipment",
    price: 12000,
    unit: "piece",
    quantity: 60,
    state: "Gujarat",
    seller: "Irrigation Co",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1598514982732-2b1f33c61c64"
  },

  // 🛡️ PESTICIDES
  {
    name: "Neem Oil Pesticide",
    category: "pesticides",
    price: 400,
    unit: "litre",
    quantity: 200,
    state: "Kerala",
    seller: "Organic Protect",
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec"
  },
  {
    name: "Insecticide Spray",
    category: "pesticides",
    price: 600,
    unit: "litre",
    quantity: 180,
    state: "Punjab",
    seller: "Crop Care",
    badge: "Certified",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71"
  },
  {
    name: "Herbicide Glyphosate",
    category: "pesticides",
    price: 750,
    unit: "litre",
    quantity: 150,
    state: "Haryana",
    seller: "Weed Control",
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71"
  },
  {
    name: "Fungicide Liquid",
    category: "pesticides",
    price: 550,
    unit: "litre",
    quantity: 130,
    state: "Uttar Pradesh",
    seller: "Agri Protect",
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1627308595181-0fdfb7f02a71"
  }
];

// 🌱 Seed Function
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // clear old data
    console.log("🧹 Old products removed");

    await Product.insertMany(products);
    console.log("🌱 Products seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();