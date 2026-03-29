import Product from "../models/productModel.js";

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      unit,
      quantity,
      seller,
      state,
      image,
    } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      unit,
      quantity,
      seller,
      state,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};