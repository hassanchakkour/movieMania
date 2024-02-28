const express = require("express");
const moviesRouter = require("../routes/admin/manageMoviesRoute.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const extensions = require("../helper/extensions.js");
const multer = require("multer");
const path = require("path");
const bundleRouter = require("../routes/admin/manageBundlesRoute.js");
const userRegisterRouter = require("../routes/user/register.js");
const getMoviesRouter = require("../routes/user/getMoviesRouter.js");
const getInfoRouter = require("../routes/user/getInfoRouter.js");
const manageUsersRouter = require("../routes/admin/manageUsersRoute.js");
const getNewsRouter = require("../routes/user/getNewsRouter");
const displayDashBoardInfo = require("../controllers/admin/dashBoardController");
const getLikedMoviesRouter = require("../routes/user/getLikedMoviesRouter.js");
const loginRouter = require("../routes/loginRoute.js");
const userSchema = require("../models/userSchema");
const {
  validateUser,
  validateAdmin,
} = require("../middleware/authMiddleware.js");
const upload = multer();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

dotenv.config({ path: __dirname + "/../../.env" });

const {
  dbPort,
  dbHost,
  dbName,
  serverPort,
  sessionSecret,
  jwtSecret,
  movieApi,
  apiKey,
} = process.env;

async function connectDB() {
  const uri = `mongodb://127.0.0.1:27017/movieMania`;
  await mongoose.connect(uri);
  console.log("Connected to db!");
}

async function startServer() {
  try {
    await connectDB();

    const app = express();

    app.use(cookieParser());

    app.use(express.json());

    app.use(bodyParser.json());

    upload.array("pictures", 1);

    app.use(bodyParser.urlencoded({ extended: true }));

    app.set("views", path.join(__dirname, "/../views/"));

    app.set("view engine", "ejs");

    app.use(
      session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: false,
      })
    );

    // Insert Routest here

    app.get("/success", (req, res) => {
      let currentUserId = req.cookies.uuid;
      let userExist = req.session[currentUserId];

      if (userExist) {
        let currentUser = req.session[currentUserId][0];

        let user = {
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          password: currentUser.password,
          age: currentUser.age,
          email: currentUser.email,
          bundlesId: currentUser.bundlesId,
        };

        extensions.userAlreadyExist(user.email).then(async (result) => {
          if (result) {
            await extensions.existingUserSubscribeToBundle(
              user.email,
              user.bundlesId[user.bundlesId.length - 1]
            );
            res.json("done");
          } else {
            await extensions.addToDb(userSchema, user);
            await extensions.newUserSubscribeToBundle(
              user.email,
              user.bundlesId[user.bundlesId.length - 1]
            );
            res.json("done");
          }
        });
      } else {
        res.json("forbidden");
      }
    });

    app.post("/googleLogin", async (req, res) => {
      try {
        const { email, firstName, lastName } = req.body;
        let userExist;

        extensions.getUserInfo(email).then(async (data) => {
          let uuid = uuidv4();

          res.cookie("uuid", `${uuid}`, { httpOnly: true });

          if (data == undefined) {
            let user = {
              firstName: firstName,
              lastName: lastName,
              email: email,
              subscribedMovies: [],
            };

            jwt.sign(
              { user: user, role: "user" },
              jwtSecret,
              async (err, token) => {
                res.cookie("jwt", token, { httpOnly: true });
                req.session[String(uuid)] = user;
                res.send("done");
              }
            );
          } else {
            let user = {
              firstName: data.firstName,
              lastName: data.lastName,
              _id: data._id,
              email: email,
              subscribedMovies: [],
              likedMovies: data.likedMovies,
            };

            await extensions
              .getThisMonthEnrolledMovies(email)
              .then(async (resp) => {
                user.subscribedMovies = resp;
              });
            console.log(user);

            jwt.sign(
              { user: user, role: "user" },
              jwtSecret,
              async (err, token) => {
                res.cookie("jwt", token, { httpOnly: true });
                req.session[String(uuid)] = user;
                console.log(user);
                res.send("exist");
              }
            );
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    });

    app.get("/cancel", (req, res) => {
      res.render("cancel.ejs");
    });

    app.use("/login", loginRouter);

    app.use("/register", userRegisterRouter);

    app.use("/admin/dashboard", validateAdmin, displayDashBoardInfo);

    app.use("/user/Movies", validateUser, getMoviesRouter);

    app.use("/user/profile", getInfoRouter);

    app.use("/admin/manageUsers", validateAdmin, manageUsersRouter);

    app.use("/admin/bundles", validateAdmin, bundleRouter);

    app.use("/admin/movies", validateAdmin, moviesRouter);

    app.use("/user", validateUser, getLikedMoviesRouter);

    app.use("/Logout", (req, res) => {
      res.cookie("jwt", { maxAge: 0, httpOnly: true });

      let uuid = req.cookies.uuid;
      // console.log(uuid)
      if (uuid) {
        res.cookie("uuid", "i will die", { maxAge: 0 });
        req.session.uuid = null;
      }
      res.send("cleared");
    });

    app.use("/upcoming", getNewsRouter);

    app.listen(serverPort, () =>
      console.log(`Listening to port ${serverPort}`)
    );
  } catch (error) {
    console.log(`Error server connection with Db : ${error.message}`);
  }
}

startServer();
