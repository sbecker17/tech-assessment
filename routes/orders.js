const express = require("express");
const router = express.Router();
const Order = require("../models/order_model");

router.get("/", async (req, res) => {
	try{
		const orders = await Order.find();
		res.send(orders);
	}
	catch (err) {
		res.status(500).json({message:err.message});
	}
});

router.post("/", async (req, res) => {
    console.log('body', req.body);
    for (var i = 0; i<req.body.length; i++){
        const body1 = req.body[i];
        console.log(body1);
        for (var info in body1){
            let temp;
            if (typeof body1[info] === "string"){
                temp = body1[info];
                temp = temp.toUpperCase();
                body1[info]=temp;
                console.log(body1[info]);
            }
            if (typeof body1[info] === "object"){
                for (var item in body1[info]){
                    if (typeof body1[info][item] === "string"){
                        temp = body1[info][item];
                        temp = temp.toUpperCase();
                        body1[info][item]=temp;
                    }
                }
            }
        }
        console.log(body1.item_id);
        const order = new Order({
            item_id: body1.item_id,
            quantity: body1.quantity,
            customer: body1.customer
        });
        try{
            const newOrder = await order.save();
            res.status(201).json(newOrder);
        }
        catch(err) {
            res.status(400).json({message:err.message});
        }
    }
    // res.status(201).json({message:"Order Added"});
});

router.get("/:item_id", getOrder, async (req, res) => {
	if (res.order != null) {
		res.json(res.order);
	}
	else{
        console.log(res.order);
		res.json({message: "Cannot locate order with that id"});
	}
});

router.get("/customer/:lastName", getOrdersByCustomer, async (req, res) => {
	if (res.order != null) {
		res.json(res.order);
	}
	else{
        console.log(res.order);
		res.json({message: "Cannot locate order with that id"});
	}
});

async function getOrder(req, res, next) {
	let order1;
	let item_id = req.params.item_id;
    try{
        order1 = await Order.find({'item_id': item_id});
        console.log('o1', order1);
        // order = await Order.findById(req.params.lastName);
        if (order1 == null) {
            return res.status(303).json({message:"Cannot find order"});
        }
    }
    catch (err) {
        // console.log(err + ` in getorder`)
        return res.status(500).json({message: err.message});
    }
    res.order = order1[0];
    next();
}

async function getOrdersByCustomer(req, res, next) {
	let order1;
	let lastName = req.params.lastName.toUpperCase();
    try{
        order1 = await Order.find({'customer': lastName});
        // console.log('o1', order1);
        // order = await Order.findById(req.params.lastName);
        if (order1 == null) {
            return res.status(303).json({message:"Cannot find orders for that customer"});
        }
    }
    catch (err) {
        // console.log(err + ` in getorder`)
        return res.status(500).json({message: err.message});
    }
    res.order = order1;
    next();
}


module.exports = router;