import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check email against env
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Check password against hashed password in env
        const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Generate JWT
        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                email: process.env.ADMIN_EMAIL,
                role: "admin",
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /api/auth/verify - verify token validity
router.get("/verify", (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ valid: false });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({ valid: true, admin: decoded });
    } catch (error) {
        res.status(401).json({ valid: false });
    }
});

export default router;
