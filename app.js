const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
dotenv.config();
const LocalStrategy = require('passport-local').Strategy;
const pool = require("./db/pool");
const app = express();

const userRouter = require("./routes/usersRouter");


app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
            const user = rows[0];

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password_hash);
            if (!match) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
  
        done(null, user);
    } catch(err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    res.render("index", { user: res.locals.currentUser });
});
app.get("/signup",(req, res) => {
    res.render("signup", { user: res.locals.currentUser });
});
app.get("/login",(req, res) => {
    res.render("login", { user: res.locals.currentUser });
});
app.post("/login", passport.authenticate("local", { successRedirect : "/", failureRedirect: "/ "}));
app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});
app.get("/join", (req, res) => {
    res.render("join", {user: res.locals.currentUser });
});
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));