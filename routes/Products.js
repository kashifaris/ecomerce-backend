const express = require('express');
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require('../controller/Product_controller');

const router= express.Router();

router.post('/',createProduct);
router.get('/',fetchAllProducts);
router.get('/:id',fetchProductById);
router.patch('/:id',updateProduct);




exports.router = router