import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import path from "path";
import fs from "fs";
import { validationResult, body } from 'express-validator';

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

export const validateUsersBatch = [
    body('users').isArray().withMessage('Users must be an array'),
    body('users.*.firstName').notEmpty().withMessage('First Name is required'),
    body('users.*.lastName').notEmpty().withMessage('Last Name is required'),
    body('users.*.email')
      .isEmail()
      .withMessage('Valid Email is required')
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .withMessage('Email must be a Gmail address'),
    body('users.*.phone1')
      .matches(/^\d{10}$/)
      .withMessage('Phone1 must be 10 digits'),
    body('users.*.phone2')
      .optional({ nullable: true, checkFalsy: true })
      .matches(/^\d{10}$/)
      .withMessage('Phone2 must be 10 digits'),
    body('users.*.hobbies').isArray().withMessage('Hobbies must be an array'),
    body('users.*.place').notEmpty().withMessage('Place is required'),
    body('users.*.gender').notEmpty().withMessage('Gender is required'),
  ];
  
//data filling for csv
  export const dataFillBatch = async (req, res) => {
    // check for validation errors from middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const { users } = req.body;
  
//inserting multiple users
      await User.insertMany(users);
  
      res.status(201).json({ message: 'Users added successfully', count: users.length });
    } catch (error) {
      console.error('Batch insert error:', error);
      res.status(500).json({ message: 'Server error while adding users' });
    }
  };

export const deleteData=async(req, res) => {

    const { ids } = req.body;
    console.log("reached endpoint",ids);
    try {
      await User.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ message: "Users deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete users" });
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