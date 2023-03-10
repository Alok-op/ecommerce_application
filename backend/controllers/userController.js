import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, confirmPassword, termsAndCondition } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (user) {
            res.send({ "status": "failed", "message": "Email already exists" });
        } else {
            if (name && email && password && confirmPassword) {
                if (password === confirmPassword) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            termsAndCondition: termsAndCondition
                        })
                        await doc.save();
                        const saved_user = await UserModel.findOne({ email: email });
                        // Generate JWT token
                        const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });
                        res.status(201).send({ "status": "success", "message": "Registration successs", "token": token });
                    } catch (error) {
                        console.log(error);
                        res.status(500).send({ "status": "failed", "message": "Unable to Register" });
                    }
                } else {
                    res.status(500).send({ "status": "failed", "message": "Password and confirm password does not match" });
                }
            } else {
                res.status(500).send({ "status": "failed", "message": "All fields are required" });
            }
        }
    }

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (user) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if ((user.email === email) && isMatch) {
                        // Generate JWT token
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { "expiresIn": "5d" });
                        res.send({ "status": "success", "message": "Login success", "token": token });
                    } else {
                        res.send({ "status": "failed", "message": "Email or Password is not valid" });
                    }
                } else {
                    res.send({ "status": "failed", "message": "You are not a registered user" });
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" });
            }
        } catch (error) {
            res.send({ "status": "failed", "message": "Unable to login" });
        }
    }

}

export default UserController;
