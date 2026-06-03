import express from "express";
import githubRoutes from "./routes/github.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

console.log("GITHUB TOKEN LOADED:", !!process.env.GITHUB_TOKEN);

app.use(cors());
app.use("/api/github", githubRoutes);

app.get("/", (req, res) => {
  res.send("hello there");
});

app.listen(5000, () => console.log("Server running on port 5000"));