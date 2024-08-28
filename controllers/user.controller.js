import { generate_access_token, generate_refresh_token } from "../lib/auth.js";
import { db } from "../lib/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createUser = async (req, res) => {
  try {
   
  

    const { name: user_name, email: user_email, password: user_password } = req.body;

    const existingUser = await db.user.findUnique({ where: { email: user_email } });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed_password = await bcrypt.hash(user_password, 10);

    const newUser = await db.user.create({
      data: {
        name: user_name,
        email: user_email,
        password: hashed_password,
      },
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const signIn = async (req, res) => {
  try {
    // const csrfToken = req.body._csrf || req.headers['csrf-token'];

    // if (!csrfToken || csrfToken !== req.csrfToken()) {
    //   console.log("|||||||||||| this is the token" , csrfToken)
    //   // return res.status(403).json({ message: 'Invalid CSRF token' });
    // }

    const { email: user_email, password: user_password } = req.body;

    if (!user_email || !user_password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db.user.findUnique({ where: { email: user_email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passwordDoesMatch = await bcrypt.compare(user_password, user.password);
    if (!passwordDoesMatch) {
      return res.status(400).json({ message: `Invalid credentials` });
    }

    const accessToken = generate_access_token(user);
    const refreshToken = generate_refresh_token(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      sameSite: "none",
    });

    return res.status(200).json({ accessToken ,refreshToken});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const editUser = async (req, res) => {
  try {
   
    const { name: user_name, email: user_email, password: user_password } = req.body;

    const user = await db.user.findUnique({ where: { email: user_email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashed_password = await bcrypt.hash(user_password, 10);

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user_name,
        email: user_email,
        password: hashed_password,
      },
    });

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteUser = async (req, res) => {
  try {
   

    const { id } = req.params;

    const user = await db.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db.user.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const refresh_token = (req, res) => {
  try {
    console.log("All cookies:", req.cookies);
    const refreshToken = req.cookies.refreshToken;
    console.log("Refresh token from cookie:", refreshToken);

    if (!refreshToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("Refresh token verification failed:", err);
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid refresh token", err });
      }

      console.log("Refresh token verified successfully:", user);

      const accessToken = generate_access_token(user);
      return res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error("Couldn't refresh token:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const verify_token = (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    console.log(" this is the cookie from verify token ", req.cookies);

    const token = req.headers.authorization.split(" ")[1]  // Bearer <token>

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token is missing" })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification failed:", err)
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid token", err })
      }

      console.log("Token verified successfully:", user)

      return res.status(200).json({ message: "Authorized", user })
    });
  } catch (error) {
    console.error("Token verification failed:", error)
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token", error })
  }
};

const profile = async (req, res) => {
  const result = await verify_token(req, res)

  if (result.status == 200) {
    return res.status(200).json({ user: result.user })
  }
  return res
    .status(401)
    .json({ message: "Unauthorized: Invalid token", result })
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken 
  if (refreshToken) {
    try {
      // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

      
      res.clearCookie("refreshToken"); // cookie cleared.
      res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
      res.status(400).json({ error: "Invalid refresh token" })
    }
  } else {
    res.status(400).json({ error: "No refresh token provided" })
  }
};

export {
  createUser,
  deleteUser,
  signIn,
  editUser,
  refresh_token,
  verify_token,
  profile,
  logout,
};
