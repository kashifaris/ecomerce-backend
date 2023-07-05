const express = require('express');
const { fetchBrands, createBrand } = require('../controller/Brand_controller');

const router= express.Router();

router.get('/',fetchBrands);
router.post('/',createBrand);



exports.router = router