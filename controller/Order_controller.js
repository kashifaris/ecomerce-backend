const { Order } = require("../model/Order");


exports.fetchUserOrder = async (req, res) => {
  //this product we have to get from the API body
  console.log('fetch all user orders')
  const {id} = req.user;

  try {
    const orders = await Order.find({user:id})
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllOrders = async (req, res) => {
  //this product we have to get from the API body
console.log("inside fetch all orders")
  let query = Order.find({});
  let totalOrderQuery = Order.find({});

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalOrderQuery = totalOrderQuery.sort({ [req.query._sort]: req.query._order });

  }
  const totalDocs= await totalOrderQuery.count().exec();

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

exports.createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};


  exports.updateOrder = async (req, res) => {
    //this product we have to get from the API body
    console.log("inside Update Order")
    const {id} = req.params;
    
    try {
      const order = await Order.findByIdAndUpdate(id,req.body,{new:true})
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };
