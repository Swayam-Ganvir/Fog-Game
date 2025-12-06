import jwt from "jsonwebtoken"

const ADMIN_EMAIL = "admin@gmail.com"
const ADMIN_PASSWORD = "admin@123"

export const admnLogin = async (req, res) => {

    try {

        const { email, password } = req.body

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

            const token = jwt.sign(
                { email, role: "admin" },
                process.env.JWT_SECRET || "secretKey",
                { expiresIn: "1h" }
            )

            return res.json({
                success: true,
                message: "Admin login successful",
                token,
            });

        }
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }

}
