import { nanoid } from "nanoid";
import { userModel } from "../../../DB/models/userModel.js";
import cloudinary from "../../utils/multerConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendMailService } from "../../services/mailSender.js";

//-------------- sign up --------------

export const signUp = async (req, res, next) => {
  const { username, email, password, gender } = req.body;
  if (!email || !username || !password) {
    return next(
      new Error("Username, email, and password are required", { cause: 400 })
    );
  }
  const customId = nanoid(5);

  const userMatch = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userMatch) {
    return next(new Error("username or email duplicated", { cause: 400 }));
  }

  if (!req.file) {
    return next(new Error("please upload profile image", { cause: 400 }));
  }
  const { path } = req.file;

  const { public_id, secure_url } = await cloudinary.uploader.upload(path, {
    folder: `E-commerce/users/profilePic/${customId}`,
    unique_filename: true,
  });

  if (!email || !username) {
    return next(new Error("email and password are required", { cause: 400 }));
  }

  if (!password) {
    return next(new Error("Password is required", { cause: 400 }));
  }

  const hashedPassword = bcrypt.hashSync(password, +process.env.HASH_LEVEL);

  const userInstance = new userModel({
    username,
    email,
    password: hashedPassword,
    gender,
    customId,
    profilePic: {
      public_id,
      secure_url,
    },
    role: "user",
  });

  const newUser = await userInstance.save();

  if (newUser) {
    const userToken = jwt.sign(
      { id:newUser._id},
      process.env.TOKEN_KEY
    );

    const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${userToken}`;
    const message = `<a href=${confirmLink}>confirm email address</a>`;

    await sendMailService({
      to: email,
      subject: "bntest",
      message,
    });
    return res.status(200).json({
      msg: "user created successfully",
      token: userToken,
    });
  }
  if (!newUser) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("User not saved", { cause: 500 }));
  }
};

//-------------- sign up Admin--------------

export const signUpAdmin = async (req, res, next) => {
  const { username, email, password, gender } = req.body;
  if (!email || !username || !password) {
    return next(
      new Error("Username, email, and password are required", { cause: 400 })
    );
  }
  const customId = nanoid(5);

  const userMatch = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (userMatch) {
    return next(new Error("username or email duplicated", { cause: 400 }));
  }

  if (!req.file) {
    return next(new Error("please upload profile image", { cause: 400 }));
  }
  const { path } = req.file;

  const { public_id, secure_url } = await cloudinary.uploader.upload(path, {
    folder: `E-commerce/users/profilePic/${customId}`,
    unique_filename: true,
  });

  if (!email || !username) {
    return next(new Error("email and password are required", { cause: 400 }));
  }

  if (!password) {
    return next(new Error("Password is required", { cause: 400 }));
  }

  const hashedPassword = bcrypt.hashSync(password, +process.env.HASH_LEVEL);

  const userInstance = new userModel({
    username,
    email,
    password: hashedPassword,
    gender,
    customId,
    profilePic: {
      public_id,
      secure_url,
    },
    role: "admin",
  });

  const newUser = await userInstance.save();

  if (newUser) {
    const userToken = jwt.sign(
      { id:newUser._id},
      process.env.TOKEN_KEY
    );

    const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${userToken}`;
    const message = `<a href=${confirmLink}>confirm email address</a>`;

    await sendMailService({
      to: email,
      subject: "bntest",
      message,
    });
    return res.status(200).json({
      msg: "user created successfully",
      token: userToken,
    });
  }
  if (!newUser) {
    await cloudinary.uploader.destroy(public_id);
    return next(new Error("User not saved", { cause: 500 }));
  }
};

//--------------- confirm email  -----------

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new Error("No token found !", { cause: 400 }));
  }

  const { email } = jwt.verify(token, process.env.TOKEN_KEY);

  const userCheck = await userModel.findOne({ email });

  if (!userCheck) {
    return next(new Error("user not found!", { cause: 404 }));
  }

  if (userCheck.isConfirmed) {
    return res.status(200).json({ message: "email already confirmed" });
  }

  const updatedUser = await userModel
    .findOneAndUpdate({ email }, { isConfirmed: true }, { new: true })
    .select("username email role customId");

  if (!updatedUser) {
    return next(new Error("failed to confirm this email!", { cause: 500 }));
  }

  return res
    .status(200)
    .json({ message: "email confirmed successfully", updatedUser });
};

//-------------- login --------------

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Error("email and password are required", { cause: 400 }));
  }

  const userCheck = await userModel.findOne({ email });

  if (!userCheck) {
    return next(new Error("user not exist , please sign up first"));
  }

  const passwordCheck = bcrypt.compareSync(password, userCheck.password);

  if (!passwordCheck) {
    return next(new Error("incorrect email or password", { cause: 400 }));
  }

  const userToken = jwt.sign(
    { id:userCheck._id},
    process.env.TOKEN_KEY
  );

  if (userToken) {
    return res.status(200).json({ msg: "Done", token: userToken });
  }
  next(new Error("failed", { cause: 500 }));
};

//------------------------------

export const updateUser = async (req, res, next) => {
  const { username, email, password, gender } = req.body;
  const { id } = req.userData;

  const updateFields = {};

  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (gender) updateFields.gender = gender;
  if (password) {
    updateFields.password = bcrypt.hashSync(password, process.env.HASH_LEVEL);
  }

  const updatedUser = await userModel
    .findByIdAndUpdate(id, updateFields, {
      new: true,
    })
    .select("username email gender role ");

  if (!updatedUser) {
    return next(new Error("user not found", { cause: 400 }));
  }

  res.status(200).json({ message: "Done !", updatedUser });
};

//--------------- get all users ----------------

export const getAllUsers = async (req, res, next) => {
  const allUsers = await userModel.find().populate("products");

  if (!allUsers) {
    return next(new Error("Failed to get users", { cause: 500 }));
  }
  if (allUsers.length === 0) {
    return res.status(200).json({ message: "No users found", users: [] });
  }
  res.status(200).json({ message: "Done", allUsers });
};
