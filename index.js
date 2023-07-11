require('dotenv').config()
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const path = require('path')

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { sanatizeUser, isAuth, cookieExtractor } = require("./services/common");

// JWT options

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY; // TODO: should not be in code;


const userRouter = require("./routes/Users");
const authRouter = require("./routes/auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const { User } = require("./model/User.js");


server.use(express.static(path.resolve(__dirname,"build")));

server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(cookieParser());
server.use(passport.authenticate("session"));

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json()); //middleware to parse req.body into json
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandsRouter.router);
server.use("/auth", authRouter.router);
server.use("/users", isAuth(), userRouter.router);
server.use("/cart", isAuth(), cartRouter.router);
server.use("/orders", isAuth(), orderRouter.router);
server.get('*', (req, res) =>
  res.sendFile(path.resolve('build', 'index.html'))
);

//passport local strategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      console.log("inside passport");
      try {
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
          console.log('inside if');
          return done(null, false, { message: "no such user email" });
        }
        console.log(user);
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            const token = jwt.sign(sanatizeUser(user), process.env.JWT_SECRET_KEY);
            done(null, { token });
          }
        );
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanatizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log("inside jwt");
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

//this changes session variable req.user when called from authorized request
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

const stripe = require("stripe")(
  process.env.STRIPE_SERVER_KEY
);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

const endpointSecret = process.env.ENDPOINT_SECRET;
//webhook
server.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected!"))
  .catch((err) => console.log(err));

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(process.env.PORT, () => {
  console.log("server started");
});
