require("dotenv").config();
import("./connection/db-connections.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/user-routes");
const mailRouter = require("./routes/mail-routes");
const excelRouter = require("./routes/excel-routes");

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://nomencapture.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use("/api", authRouter);
app.use("/api", mailRouter);
app.use("/api", excelRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
