const { Product } = require("../model/Product");

exports.createProduct = async (req, res) => {
  //this product we have to get from the API body

  const product = new Product(req.body);
  console.log("inside crreate products")
  try {
    const doc = await product.save();
    console.log(doc);
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  //this product we have to get from the API body

  let query = Product.find({});
  let totalProductQuery = Product.find({});


  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductQuery = totalProductQuery.find({ category: req.query.category });

  }

  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductQuery = totalProductQuery.find({ brand: req.query.brand });

  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalProductQuery = totalProductQuery.sort({ [req.query._sort]: req.query._order });

  }
  const totalDocs= await totalProductQuery.count().exec();
  console.log({totalDocs});

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set('X-Total-Count',totalDocs)
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.fetchProductById = async (req, res) => {
  //this product we have to get from the API body
  const {id} = req.params;

  try {
    const product = await Product.findById(id)
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  //this product we have to get from the API body
  const {id} = req.params;
  
  try {
    const product = await Product.findByIdAndUpdate(id,req.body,{new:true})
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};
