import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/index.js";

// Load env variables using import module
dotenv.config({
  path: ".env",
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Make sure this matches the frontend origin exactly
    methods: "GET,POST,PUT,DELETE,PATCH", // Allow the necessary methods
    allowedHeaders: "Content-Type,Authorization", // Allow necessary headers
    credentials: true, // Allow cookies (if needed)
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// static files : PDF, DOCX, MP4, etc
app.use(express.static("public"));

// Routes Declaration
app.use(routes);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
