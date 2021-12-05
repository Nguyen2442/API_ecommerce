const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item')
const express = require('express');
const { getAllOrders, getOrderById, addOrder, deleteOrder, updateOrder, getTotalSales, getCount, getUserOrders } = require('../controllers/orders');
const router = express.Router();

router.get(`/`, getAllOrders);

router.get(`/:id`, getOrderById);

router.post('/', addOrder);

router.put('/:id', updateOrder);

router.delete('/:id', deleteOrder)

router.get('/get/totalsales', getTotalSales);

router.get('/get/count', getCount);

router.get('/get/userorders/:userid', getUserOrders);


module.exports = router;