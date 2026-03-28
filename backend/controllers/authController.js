import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { getDB } from "../database/nativeDB.js";

// 🔐 Generate Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.SECRET_KEY,
    { expiresIn: "7d" }
  );
};

// 📧 Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔢 Generate 6 digit code
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ✅ SEND VERIFICATION CODE
export const sendVerificationCode = async (req, res) => {
  try {
    const db = getDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const code = generateCode();

    const users = db.collection("users");

    // Save code in DB (temporary)
    await users.updateOne(
      { email },
      {
        $set: {
          verificationCode: code,
          codeExpires: Date.now() + 10 * 60 * 1000, // 10 mins
        },
      },
      { upsert: true }
    );

    // Send email
    await transporter.sendMail({
      from: `"KrishiPredict" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: `<h2>Your verification code is:</h2>
             <h1>${code}</h1>
             <p>This code will expire in 10 minutes.</p>`,
    });

    res.json({
      message: "Verification code sent",
      code, // ⚠️ remove this in production
    });

  } catch (error) {
    console.error("SEND CODE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ REGISTER (with email verification)
export const registerUser = async (req, res) => {
  try {
    const db = getDB();
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      verificationCode,
    } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const users = db.collection("users");

    const userData = await users.findOne({ email });

    // ✅ VERIFY CODE
    if (
      !userData ||
      userData.verificationCode !== verificationCode ||
      userData.codeExpires < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    // check if already registered (has password)
    if (userData.password) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // update user with full data
    await users.updateOne(
      { email },
      {
        $set: {
          name,
          password: hashedPassword,
          role,
          phone,
          address,
          createdAt: new Date(),
        },
        $unset: {
          verificationCode: "",
          codeExpires: "",
        },
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(userData._id, role),
      user: {
        id: userData._id,
        name,
        email,
        role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ LOGIN
export const loginUser = async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const users = db.collection("users");

    const user = await users.findOne({ email });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;

    const users = db.collection("users");

    const user = await users.findOne({ email });

    if (!user || user.role !== "admin") {
      return res.status(401).json({ message: "Admin only access" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Admin login successful",
      token: generateToken(user._id, user.role),
      user: {
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GOOGLE LOGIN (ONLY IF USER EXISTS)
export const googleLogin = async (req, res) => {
  try {
    const db = getDB();
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const users = db.collection("users");

    const user = await users.findOne({ email });

    // ❌ If user NOT found → block login
    if (!user) {
      return res.status(403).json({
        message: "Account not found. Please register first.",
      });
    }

    // ✅ OPTIONAL: ensure user is verified (extra safety)
    if (user.verificationCode || user.codeExpires) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    // ✅ SUCCESS LOGIN
    res.json({
      message: "Google login successful",
      token: generateToken(user._id, user.role),
      user: {
        name: user.name || name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("GOOGLE LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};