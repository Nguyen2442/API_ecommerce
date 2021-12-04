const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item')


exports.getAllOrders = async (req, res) => {
    try {
        const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
        res.status(200).send(orderList);
    } catch (err) {
        res.status(500).json({ success: false },{message: err})
    }
}

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems', populate: { path: 'product', populate: 'category' }
            });
        res.status(200).send(order);
    } catch (err) {
        res.status(500).json({ success: false }, { message: err })
    }
}


exports.addOrder = async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();

    if (!order)
        return res.status(400).send('the order cannot be created!')
    res.send(order);
}

exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        },
            // { new: true }
        )
        res.send(order).status(200);
    } catch (err) {
        return res.status(400).send('The order cannot be updated!').json({ error: err })
    }
}

exports.deleteOrder = async (req, res) => {
    // Order.findByIdAndRemove(req.params.id)
    //     .then(async order => {
    //         if (order) {
    //             await order.orderItems.map(async orderItem => {
    //                 await OrderItem.findByIdAndRemove(orderItem)
    //             })
    //             return res.status(200).json({ success: true, message: 'The order is deleted!' })
    //         } else {
    //             return res.status(404).json({ success: false, message: "order not found!" })
    //         }
    //     }).catch(err => {
    //         return res.status(500).json({ success: false, error: err })
    //     })
    
        try {
            const order = await Order.findByIdAndRemove(req.params.id);
            if(order){
               await order.orderItem.map(async orderItem => {
                   await OrderItem.findByIdAndRemove(orderItem)
               }) 
               res.status(200).json({ success: true, message: 'The product is deleted' })
            }
            res.status(404).json({ success: true, message: 'The order not found' })
        } catch (err) {
            res.status(500).json({ success: false, error: err })
        }
}