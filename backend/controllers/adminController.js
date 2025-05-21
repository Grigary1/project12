import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import path from "path";
import fs from "fs";

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD) 
      {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "10h",
      });

      return res.status(200).json({
        success: true,
        token,
        message: "Admin login successful",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid admin credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



export const showData = async (req, res) => {
  try {
    const users = await User.find();

    const formattedUsers = users.map(user => ({
      name: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" "),
      email: user.email || null,
      phone1: user.phone1 || null,
      phone2: user.phone2 || null,
      hobbies: user.hobbies?.length ? user.hobbies : null,
      place: user.place || null,
      gender: user.gender || null,
      _id: user._id,
    }));

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const dataFill = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phone1,
      phone2,
      hobbies,
      place,
      gender,
    } = req.body;

    const user = new User({
      firstName,
      middleName,
      lastName,
      email,
      phone1,
      phone2,
      hobbies: Array.isArray(hobbies) ? hobbies : [hobbies],
      place,
      gender,
    });

    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error in dataFill:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export {adminLogin}