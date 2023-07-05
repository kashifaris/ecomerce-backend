const express = require('express');
const { fetchCategories, createCategory } = require('../controller/Category_controller');

const router= express.Router();

router.get('/',fetchCategories);
router.post('/',createCategory);



exports.router = router