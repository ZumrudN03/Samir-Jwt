import express from "express";
import mongoose, { Schema } from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3004;

const usereeSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
});
const UserModel = mongoose.model("User", usereeSchema);

app.get("/user/", async (req, res) => {
  try {
    const user = await UserModel.find({});
    res.send(user);
  } catch (error) {
    res.send(error.message);
  }
});
app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserModel.findById(id);
    res.send(users);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/user/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = bcrypt.hashSync(password, 12);
    const newUser = new UserModel({ email, password: hash });
    await newUser.save();
    const token = jwt.sign(
      { email: newUser.email, role: "user" },
      "@#ffhfdhgfd21432112",
      { expiresIn: "5h" }
    );
    res.send(token);
  } catch (error) {
    res.send(error.message);
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const checkpass = await bcrypt.compare(password, user.password);
    if (!user || !checkpass) {
      return res.status(400).send("email or password incorrect!");
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      "Your Secret Key"
    );
    res.send(token);
  } catch (error) {
    res.send(error.message);
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    res.send("Got a PUT request at /user");
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    res.send("Got a DELETE request at /user");
  } catch (error) {
    res.send(error.message);
  }
});
mongoose
  .connect("mongodb+srv://samir:samir@cluster0.ywgcy8n.mongodb.net/ ")
  .then(() => console.log("Connected!"))
  .catch(() => console.log("Not Connected!"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
