import User from "../../models/UserModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { transporter } from "../../utils/mailer.js"

export const registerUser = async (req, res) => {

    try {
        //Validate inputs (assuming express-validator middleware is used)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, errors: errors.array() });
        }

        const {username, email, password} = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ $or : [{email}, {username}]});
        if(existingUser){
            return res.status(409).json({
                success : false,
                message : "User or email already in use"
            })
        }

        // Hash the password 
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create and save user 
        const newUser = new User({
            username,
            email,
            password : hashPassword,
        });
        await newUser.save();

        // Create JWT token
        const token = jwt.sign(
            {id : newUser._id, role: newUser.role},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

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

        // Return response
        return res.status(201).json({
            success : true,
            message : "User registered successfully",
            data : {
                user : {
                    _id : newUser._id,
                    username: newUser.username,
                    email : newUser.email,
                    avtar: newUser.avtar,
                    role : newUser.role,
                },
                token,
            },
        })

    }  
    
    catch (error){

        console.error("Register error : ", error)
        return res.status(500).json({
            success : false,
            message : "Something went wrong during registration"
        })

    }
}