const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item')
const express = require('express');
const { getAllOrders, getOrderById, addOrder, deleteOrder, updateOrder } = require('../controllers/orders');
const router = express.Router();

router.get(`/`, getAllOrders);

router.get(`/:id`, getOrderById);

//add order
router.post('/', addOrder);


//update order
router.put('/:id', updateOrder);

//delete order
router.delete('/:id', deleteOrder)


module.exports = router;