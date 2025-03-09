import { User } from '../models/user.models.js'
import { Agent } from '../models/agent.models.js'
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordRestEmail, sendResetSuccessEmail } from '../mailtrap/emails.js';
import cloudinary from '../utils/cloundinary.js'

import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import dotenv from "dotenv"
dotenv.config()


export const signup = async (req, res) => {
    const { email, password, name, phoneNumber } = req.body;
    let country = "Nigeria"
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required")

        }
        const userAlreadyExists = await User.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already Exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            phoneNumber,
            country,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hours
        })
        await user.save();

        //jwt 
        generateTokenAndSetCookie(res, user._id)
        console.log("reacched1")
        await sendVerificationEmail(user.email, verificationToken)
        res.status(201).json({
            success: true,
            message: "User Created Successfully",
            user: {
                ...user.doc,
                password: undefined

            }
        })

    } catch (error) {
        return res.status(400).json({ success: false, message: error.message })


    }
}
export const signupAgent = async (req, res) => {
    const { email, password, name, phoneNumber } = req.body;
    let country = "Nigeria"
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required")

        }
        const agentAlreadyExists = await Agent.findOne({ email })
        if (agentAlreadyExists) {
            return res.status(400).json({ success: false, message: "Agent already Exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const agent = new Agent({
            email,
            password: hashedPassword,
            name,
            phoneNumber,
            country,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hours
        })
        await agent.save();

        //jwt 
        generateTokenAndSetCookie(res, agent._id)
        await sendVerificationEmail(agent.email, verificationToken)
        res.status(201).json({
            success: true,
            message: "Agent  Created Successfully",
            agent: {
                ...agent.doc,
                password: undefined

            }
        })

    } catch (error) {

        return res.status(400).json({ success: false, message: error.message })


    }
}
export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // First, try to find a user with the verification token
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        // If a user is found, verify the user
        if (user) {
            user.isVerified = true;
            user.verificationToken = undefined;
            user.verificationTokenExpiresAt = undefined;
            await user.save();

            await sendWelcomeEmail(user.email, user.name);

            return res.status(200).json({
                success: true,
                message: "Email verified successfully",
                user: {
                    ...user._doc,
                    password: undefined, // Remove password from response
                },
            });
        }

        // If no user is found, try to find an agent with the same verification token
        const agent = await Agent.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        // If an agent is found, verify the agent
        if (agent) {
            agent.isVerified = true;
            agent.verificationToken = undefined;
            agent.verificationTokenExpiresAt = undefined;
            await agent.save();

            // You can send a different welcome email for agents if needed
            await sendWelcomeEmail(agent.email, agent.name);

            return res.status(200).json({
                success: true,
                message: "Agent email verified successfully",
                agent: {
                    ...agent._doc,
                    password: undefined, // Remove password from response
                },
            });
        }

        // If neither user nor agent is found, return an error
        return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    } catch (error) {
        console.log(`Server Error: ${error}`);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const agent = await Agent.findOne({ email });

        // If neither user nor agent exists, return error
        if (!user && !agent) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        // Check if user exists and validate password
        if (user) {
            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: "Invalid password" });
            }
            // Set user login details
            generateTokenAndSetCookie(res, user._id);
            user.lastLogin = new Date();
            await user.save();
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    ...user._doc,
                    password: undefined // Hides password in response
                }
            });
        }

        // Check if agent exists and validate password
        if (agent) {
            const isPasswordValid = await bcryptjs.compare(password, agent.password);
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: "Invalid password" });
            }
            // Set agent login details
            generateTokenAndSetCookie(res, agent._id);
            agent.lastLogin = new Date();
            await agent.save();
            return res.status(200).json({
                success: true,
                message: "Login successful",
                agent: {
                    ...agent._doc,
                    password: undefined // Hides password in response
                }
            });
        }

    } catch (error) {
        console.log("Error in login", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exist" })
        }
        //Generate reset token
        const resetToken = crypto.randomBytes(26).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour


        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save()

        //send email
        await sendPasswordRestEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Password reset link sent to your email" })
    } catch (error) {
        console.log("Error in forgotPassword ", error)
        res.status(400).json({ success: false, message: error.message })

    }
}
export const logout = (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })
}
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" })
        }
        const hashedPassword = await bcryptjs.hash(password, 10)
        user.password = hashedPassword
        await user.save()

        await sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: 'Reset Password succesfult' })
    } catch (error) {
        console.log("Error in reseting password ", error)
        res.status(400).json({ success: false, message: error.message })
    }
}
export const checkAuth = async (req, res) => {
    try {
        // First, try to find a user
        const agent = await Agent.findById(req.userId).select("-password")
        if (agent) {
            return res.status(200).json({ success: true, agent })
        }

        const user = await User.findById(req.userId).select("-password")
        if (user) {
            return res.status(200).json({ success: true, user })
        }

        // If no user is found, try to find an agent


        // If neither user nor agent is found
        return res.status(400).json({ success: false, message: "User or Agent not found" })
    } catch (error) {
        console.log("Error in checkAuth", error)
        res.status(400).json({ success: false, message: error.message })
    }
}
export const updateAgent = async (req, res) => {

    try {
        const { country, state, nin, image, area, touringFee, agentId } = req.body;
        const agent = await Agent.findById(agentId);

        console.log("This is agent id ", agent)

        if (!agent) {
            console.log("This is agent id ", agent)
            return res.status(404).json({ success: false, message: "Agent not found" });

        }

        // Update basic fields if provided
        if (nin) agent.nin = nin;
        if (area) agent.area = area;
        if (state) agent.state = state;
        if (country) agent.country = country;
        if (touringFee) agent.touringFee = touringFee;
        agent.verified = true;

        // If an image file is included in the request
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const upload = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        folder: 'agent_images' // Specify folder for agent images
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                // Stream the file buffer to Cloudinary
                upload.end(req.file.buffer);
            });

            // Update the agent’s image URL in the database
            agent.image = {
                url: result.secure_url,
                // public_id: result.public_id,
            };
        }

        // Save the updated agent information
        await agent.save();

        res.status(200).json({
            success: true,
            message: "Agent profile updated successfully",
            agent: {
                ...agent._doc,
                password: undefined, // Hide password in the response
            }
        });
    } catch (error) {
        console.error("Error updating agent profile:", error);
        res.status(500).json({ success: false, message: "Failed to update agent profile" });
    }
};
