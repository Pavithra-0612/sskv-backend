import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Find user by email or phone
        const user = await userModel.findOne({ $or: [{ email }, { phone }] });

        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist. Please register first." });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Generate Token
        const token = createToken(user._id);
        res.status(200).json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword, address, pincode } = req.body;

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.json({ success: false, message: "Passwords do not match" });
        }

        // Check if user already exists with email or phone
        const exists = await userModel.findOne({ $or: [{ email }, { phone }] });
        if (exists) {
            return res.json({ success: false, message: "User already exists with this email or phone number" });
        }

        // Validate email format & password strength
        if (email && !validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Validate phone number (optional, if phone is provided)
        if (phone && (!/^\d{10}$/.test(phone))) {
            return res.json({ success: false, message: "Please enter a valid 10-digit phone number" });
        }

        // Validate address and pincode
        if (!address || address.trim() === "") {
            return res.json({ success: false, message: "Address is required" });
        }
        if (!pincode || pincode.length !== 6 || isNaN(pincode)) {
            return res.json({ success: false, message: "Please enter a valid 6-digit pincode" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            pincode
        });

        const user = await newUser.save();

        // Generate JWT token
        const token = createToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, adminLogin }