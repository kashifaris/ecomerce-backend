const { User } = require("../model/User");
const crypto = require("crypto");
const { sanatizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";

exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        req.login(sanatizeUser(doc), (err) => {
          if (err) {
            res.status(400).text(err);
          } else {
            const token = jwt.sign(sanatizeUser(doc), process.env.JWT_SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 900000),
                httpOnly: true,
              })
              .status(201)
              .json(token);
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  console.log("inside auth login");
  res
  .cookie("jwt", req.user.token, {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
  })
  .status(201)
  .json( req.user.token);
  // try {
  //   const user = await User.findOne({ email: req.body.email }).exec();
  //   if (!user) {
  //      res.status(401).json({ message: "no such user" });
  //   }
  //  else if (user.password === req.body.password) {
  //     res.status(201).json({ id: user.id, email: user.email, name: user.name, addresses:user.addresses,role:user.role });
  //   } else {
  //     res.status(401).json({ message: "invalid credentials" });
  //   }
  // } catch (err) {
  //   res.status(401).json(err);
  // }
};

exports.checkAuth = async (req, res) => {
    if(req.user){
      res.json(req.user);
    } else{
      res.sendStatus(401)
    }
};

module.exports.destroySession=(req,res)=>{
  req.logout((err)=>{
      if(err) return;
  });
  req.flash('success', 'logged out successfull');
  return res.json({message:"sucess"});
}
