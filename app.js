const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const userRouter = require("./routes/usersRouter");


app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("/", (req, res) => {
    res.render("index");
});
app.get("/signup",(req, res) => {
    res.render("signup");
});
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));