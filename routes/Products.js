const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById } = require('../controller/Product_controller');

const router= express.Router();

router.post('/',createProduct);
router.get('/',fetchAllProducts);
router.get('/:id',fetchProductById);



exports.router = router