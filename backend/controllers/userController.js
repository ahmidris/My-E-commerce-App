import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}
// Route for user Login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = createToken(user._id);
            return res.status(200).json({ success: true, message: "User Logged In Successfully", token })
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid Credentials" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Login Failed, Please try again later" })
    }

}

// Route for user register

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Checking user already exists or not 

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        // Valdiating the Email Format & Password Strength
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid Email" })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" })
        }

        // Hashing the Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token =
            createToken(user._id);

        res.status(201).json({ success: true, message: "User Registered Successfully", token })


    } catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: "Registeration Failed, Please try again later" })

    }

}



// Route for Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.status(200).json({ success: true, message: "Admin Logged In Successfully", token });
        } else {
            res.status(401).json({ success: false, message: "Invalid Admin Credentials" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Admin Login Failed, Please try again later" });
    }
}

// Route for getting user profile
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                _id: user._id
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch profile" });
    }
}

export { loginUser, registerUser, adminLogin, getUserProfile }