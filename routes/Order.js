const express = require('express');
const { createOrder, fetchAllOrders, updateOrder, fetchUserOrder } = require('../controller/Order_controller');

const router= express.Router();

router.post('/',createOrder);
router.get('/',fetchAllOrders);
router.patch('/:id',updateOrder);
router.get('/own',fetchUserOrder);





exports.router = router