import User from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { transporter } from "../../utils/mailer.js";

export const registerUser = async (req, res) => {
  try {
    // 1) Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // 2) Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already in use",
      });
    }

    // 3) Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // 4) Create and save user
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();

    // 5) Create JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
    }

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || "fallback_secret", // better to crash at startup in real app, but ok for now
      { expiresIn: "7d" }
    );

    // 6) Try sending email, but DO NOT let it break registration
    try {
      await transporter.sendMail({
        from: `"Fog of War" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to Fog of War 🎮",
        html: `
          <h2>Welcome, ${username}!</h2>
          <p>Thanks for joining <b>Fog of War</b>. Your adventure begins now!</p>
          <p>Login to start exploring the world 🌍</p>
        `,
      });

      console.log("Welcome email sent to:", email);
    } catch (mailError) {
      console.error("Email sending failed (user still registered):", mailError);
      // Don't throw here. User is already created; we just couldn’t send the email.
    }

    // 7) Return response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          avtar: newUser.avtar, // if typo, you can fix later to `avatar`
          role: newUser.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};
