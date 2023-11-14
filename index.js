const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

const app = express();
dotenv.config();

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
// Add your database name here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  `mongodb+srv://${username}:${password}@cluster0.hi5gr7f.mongodb.net/registrationForm`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received registration request:", { name, email, password });

    const check = await Registration.findOne({ email: email });
    if (!check) {
      const user_data = new Registration({
        name,
        email,
        password,
      });
      await user_data.save();
      console.log("User registered successfully!");
      res.redirect("/success");
    } else {
      console.log("User already exists. Redirecting to error page.");
      res.redirect("/error");
    }
  } catch (error) {
    console.log("Error during registration:", error);
    res.redirect("/error"); // Send an error response
  }
});


app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/client/success.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/client/error.html");
});

app.listen(port, () => {
  console.log(`Server on ${port}`);
});
