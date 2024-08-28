import express from "express";
import cors from "cors";
import { json } from "express"; 
import { join } from "path";
import userRouter from "./routes/user.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, 
    
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// CSRF protection setup
// const csrfProtection = csurf({
//    cookie: {
//      key: '_csrf', 
//      httpOnly: false,
//      secure: process.env.NODE_ENV === 'production',
//      sameSite: 'lax',
//      path: '/'
//    }
//  });
// app.use(csrfProtection);

// app.get("/get-csrf-token", (req, res) => {
//   const token = req.csrfToken();
//   console.log("CSRF token: from  backend +++++++++++++++++ ", token);
//   res.cookie("_csrf", token, {
//     httpOnly: false,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "none",
  
//   });
//   res.status(200).json({ csrfToken: token });
// });

const port = process.env.PORT;

app.use("/user", userRouter);

// app.get("/get-csrf-token", (req, res) => {
//   res.status(200).json({ csrfToken: req.csrfToken() });
// });



app.listen(port, () => {
  console.log("The server is now running on port " + port);
});
