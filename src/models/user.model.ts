import mongoose, { Schema } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";
import { object, string } from "yup";
import otpGenerator from "otp-generator";
import { assignRoleToUser } from "../services/user.services.js";
import OTP from "./otp.model.js";
import Role from "./role.model.js";

import {
  initOTPGeneration,
  sendVerificationMail,
} from "../services/otp.services.js";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  count: number;
  password: string;
  emailVerified: boolean;
  roles: string[];
};

const registerUserSchema = object({
  firstName: string().trim().min(2).required(),
  lastName: string().trim().min(3).required(),
  email: string().email().required(),
  password: string().min(6).required(),
});

const loginUserSchema = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

const editUserSchema = object({
  firstName: string().trim().min(2).required(),
  lastName: string().trim().min(3).required(),
  email: string().email().required(),
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    count: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role",
        default: [],
      },
    ],
    sparks: [{ type: Schema.Types.ObjectId, ref: "Spark" }], // References to sparks created by this user
  },
  {
    timestamps: true,
    statics: {
      async registerUser(data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      }) {
        try {
          // validate user input
          await registerUserSchema.validate(data);
          // check if user exists
          const existingUser = await this.findOne({ email: data.email });
          if (existingUser) {
            throw new Error("User already exists");
          }
          // hash password
          const salt = await genSalt(10);
          const hashedPassword = await hash(data.password, salt);
          // create user
          const user = await this.create({
            ...data,
            password: hashedPassword,
          });
          // assign user role
          await assignRoleToUser(user._id.toString(), "user");
          const userWithRoles = await this.findById(user._id).populate("roles");

          // send verification email
          await initOTPGeneration(data.email);

          return userWithRoles;
        } catch (error) {
          throw new Error(error);
        }
      },
      async loginUser({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) {
        // validate user input
        await loginUserSchema.validate({ email, password });
        // check if user exists
        const user = await this.findOne({ email }).populate("roles");
        if (!user) {
          throw new Error("User does not exist");
        }
        if (!user.password) {
          throw new Error(
            "Seems like you have signed up with Google. Please login with Google"
          );
        }
        // compare password
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        // check if user is verified
        if (!user.emailVerified) {
          throw new Error("User is not verified");
        }
        return user;
      },
      async me({ id }: { id: string }) {
        try {
          return this.findById(id);
        } catch (error) {
          throw new Error(error);
        }
      },
      async editUser({
        id,
        firstName,
        lastName,
        email,
      }: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      }) {
        try {
          // validate user input
          await editUserSchema.validate({ firstName, lastName, email });
          // check if user exists
          const user = await this.findById(id);
          if (!user) {
            throw new Error("User does not exist");
          }
          // update user
          return this.findByIdAndUpdate(
            id,
            { firstName, lastName, email },
            { new: true }
          );
        } catch (error) {
          throw new Error(error);
        }
      },
      async upsertGoogleUser({
        email,
        firstName,
        lastName,
        picture,
        verified_email,
      }: {
        email: string;
        firstName: string;
        lastName: string;
        picture: string;
        verified_email: boolean;
      }) {
        try {
          const userRole = await Role.findOne({ name: "user" });
          const user = await this.findOneAndUpdate(
            { email },
            {
              firstName,
              lastName,
              email,
              picture,
              emailVerified: verified_email,
              roles: [userRole._id],
            },
            { new: true, upsert: true }
          );

          console.log("👤👤👤👤👤 ~ user", user);

          // assign user role
          // await assignRoleToUser(user._id.toString(), "user");
          // const userWithRoles = await user.populate("roles");

          const userWithRoles = await user.populate("roles");
          console.log("👤👤👤👤👤 ~ userWithRoles", userWithRoles);

          return userWithRoles;
        } catch (error) {
          console.log("👤👤👤👤👤 ~ error", error);

          throw new Error(error.message);
        }
      },
    },
  }
);

const User = mongoose.model("User", userSchema);
export default User;
