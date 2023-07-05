const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product_controller");
const productsRouter= require('./routes/Products')
const categoriesRouter= require('./routes/Categories')
const brandsRouter= require('./routes/Brands')


server.use(express.json()) //middleware to parse req.body into json
server.use('/products',productsRouter.router)
server.use('/categories',categoriesRouter.router)
server.use('/brands',brandsRouter.router)



mongoose
  .connect("mongodb://127.0.0.1:27017/ecomerce")
  .then(() => console.log("Connected!"))
  .catch((err) => console.log(err));

server.get("/", (req, res) => {
  res.json({ status: "success" });
});


server.listen(8080, () => {
  console.log("server started");
});
