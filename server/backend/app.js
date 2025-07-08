require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGOOSE_STRING);

  // Importing controllers
  const router = require("./controllers/routes");

  // Use Controllers in app
  app.use(router);

  app.listen(process.env.PORT, () => {
    console.log(`The server is spinning up at port: ${process.env.PORT}`);
  });
}
