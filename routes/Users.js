const express = require('express');
const {fetchUserById, updateUser } = require('../controller/User_controller');

const router= express.Router();

router.get('/own',fetchUserById);
router.patch('/:id',updateUser);



exports.router = router