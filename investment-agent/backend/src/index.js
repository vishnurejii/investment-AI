import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AI Investment Research Agent backend running on http://localhost:${PORT}`);
});
