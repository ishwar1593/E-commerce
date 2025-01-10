import dotenv from "dotenv";
import app from "./app.js";

// Load env variables using import module
dotenv.config({
  path: ".env",
});

// // Connect to the database and then start the server
// const startServer = async () => {
//   try {
//     await connectDB(); // Ensure DB is connected first
//     console.log("Database connected successfully");

//     // Start the server after successful DB connection
//     app.listen(process.env.PORT || 8080, () => {
//       console.log(`Server is running on port ${process.env.PORT || 8080}`);
//     });
//   } catch (error) {
//     console.log("Postgres connection error:", error);
//     process.exit(1); // Exit the process if DB connection fails
//   }
// };

// startServer();
app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
});
